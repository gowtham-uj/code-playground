const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
// const piston = require("./modified-libs/piston-client");
const { Server } = require("socket.io");
const ACTIONS = require("./src/Actions");
const axios = require("axios");

const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("build"));
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const userSocketMap = {};
function getAllConnectedClients(roomId) {
  // Map
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
}

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);

  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.UPDATE_CODE_LANGUAGE, ({ roomId, language }) => {
    // console.log("update code language " + language);
    socket.in(roomId).emit(ACTIONS.UPDATE_CODE_LANGUAGE, { language });
  });

  socket.on(ACTIONS.RUN_CODE, async ({ code, roomId, language, version }) => {
    // console.log(code);
    const executeCode = await axios.post(
      "https://emkc.org/api/v2/piston/execute",
      {
        language: language,
        version: version,
        files: [
          {
            name: "code_sync_exec.js",
            content: `${code}`,
          },
        ],
        compile_timeout: 10000,
        run_timeout: 3000,
        compile_memory_limit: -1,
        run_memory_limit: -1,
      }
    );
    // let output = `output will come here in ${language} with version ${version}`;
    io.to(roomId).emit(ACTIONS.SHOW_OUTPUT, { output: executeCode.data });
  });

  // ACTIONS.FETCH_AVAILABLE_LANGUAGES

  socket.on(ACTIONS.FETCH_AVAILABLE_LANGUAGES, async ({ roomId }) => {
    const runtimes = await axios.get("https://emkc.org/api/v2/piston/runtimes");
    io.to(roomId).emit(ACTIONS.AVAILABLE_LANGUAGES_LIST, {
      data: runtimes.data,
    });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
    socket.leave();
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
