require("dotenv").config();

const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const cors = require("cors");

const morgan = require("morgan");
const bodyParser = require("body-parser");

// const piston = require("./modified-libs/piston-client");
const { Server } = require("socket.io");
// const authorize = import("@thream/socketio-jwt");
const ACTIONS = require("./src/Actions");
const axios = require("axios");
const sequelize = require("./config/db.js");
const Room = require("./models/room");

const { BigPromise } = require("./utils/BigPromise.js");
const homeRoutes = require("./routes/homeRoutes.js");
const { devKickStart } = require("./seeds/seeds");
const { verifyJwtToken } = require("./utils/jwt-utils");

const UserModel = require("./models/User.js");

const {
  errorLogger,
  errorResponder,
  invalidPathHandler,
} = require("./middlewares/error-handler-middlewares.js");

const server = http.createServer(app);
const io = new Server(server);

app.use(
  cors({
    origin: "*",
  })
);
app.options("*", cors());

app.use(express.static("build"));
app.use(morgan("tiny"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// db related code
(async () => {
  await sequelize.authenticate();
  // await sequelize.sync({ force: true });
  // await devKickStart();
  // await authorize;
  // await Room.create({
  //   roomId: "crazy-codes",
  //   users: [],
  //   codeChanges: "",
  //   codeOutput: "",
  //   roomLanguage: "",
  // });
  // let rooms = await Room.findAll();
  // console.log(rooms);
})();

/*
all express stuff starts from here
*/
// root route that will deliver the react bundle
app.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// api routes here
app.use("/api/v1/auth", homeRoutes);

// fallback for any invalid routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

/*
all the socket stuff starts from here
*/
function getAllConnectedClients(roomId, users) {
  // Map
  // console.log(users);
  // let userNames = users.filter((el) => {
  //   console.log(el.username);
  //   return false;
  // });
  // console.log(userNames);
  function filterUser(usersFromDb, sIdFromSocketRoom) {
    let filteredUser = usersFromDb.filter((el) => {
      if (el.socketId === sIdFromSocketRoom) return true;
    });

    // the filtered array will always be a single object array
    return filteredUser[0].username;
  }
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      // console.log(socketId);
      return {
        socketId,
        username: filterUser(users, socketId),
      };
    }
  );
}

// auth middleware for socket communications

io.on("connection", (socket) => {
  // action create room
  socket.on("connect_failed", function () {
    document.write("Sorry, there seems to be an issue with the connection!");
  });

  socket.on(ACTIONS.CREATE_ROOM, async ({ roomId, username }) => {
    // console.log("creating a room in db to make it persistent");
    try {
      let room = await Room.create({
        roomId: roomId,
        users: [],
        codeChanges: "",
        codeOutput: "",
        roomLanguage: "",
      });

      room.users = [
        {
          username,
          socketId: socket.id,
          creator: true,
        },
      ];

      await room.save();
      // join this socket into the new room
      try {
        socket.join(roomId);
      } catch (err) {
        console.log("from joining the socket to room");
      }

      // get all the current online connected clients
      const clients = getAllConnectedClients(roomId, room.users);
      socket.emit(ACTIONS.ROOM_CREATED, {
        clients,
        username,
        socketId: socket.id,
        isCreator: true,
      });
    } catch (err) {
      socket.emit(ACTIONS.INVALID_ROOM_ID);
    }
  });

  // the first person who created the room will only be able to share video of him too all of the others and all the others cant share their video with all others.
  // emitted whenever the a new user has joined the new room
  socket.on(ACTIONS.JOIN, async ({ roomId, username }) => {
    // let rooms = await Room.findAll();
    let room = await Room.findOne({
      where: {
        roomId: roomId,
      },
    });

    // console.log(room);

    if (!room) {
      // socket.emit(ACTIONS.CREATE_ROOM);
      socket.emit(ACTIONS.INVALID_ROOM_ID);
      return;
    }

    // console.log(room);

    // add user to the room
    room.users = [...room.users, { username, socketId: socket.id }];
    room.save();

    // join the new socket in the room
    socket.join(roomId);
    console.log(io.sockets.adapter.rooms);

    // get all the current online connected clients
    const clients = getAllConnectedClients(roomId, room.users);
    // console.log(clients);
    clients.forEach((client) => {
      // console.log(username);
      // emit the event to every client in the connected client list and
      io.to(client.socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });

    // emitting the initial sync data event so that the newly joined socket/user will be in sync with rooms latest state
    socket.emit(ACTIONS.INITIAL_SYNC_DATA, {
      roomLanguage: room.roomLanguage,
      codeChanges: room.codeChanges,
      codeOutput: room.codeOutput,
    });
  });
  // socket.emit(ACTIONS.PREV_SYNC_DATA, prevRoomState);

  socket.on(ACTIONS.CODE_CHANGE, async ({ roomId, code }) => {
    let room = await Room.findOne({
      where: {
        roomId: roomId,
      },
    });
    room.codeChanges = code;
    room.save();
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.LANG_CHANGE, async ({ roomId, language }) => {
    let room = await Room.findOne({
      where: {
        roomId: roomId,
      },
    });
    room.roomLanguage = language;
    room.save();
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
    let room = await Room.findOne({
      where: {
        roomId: roomId,
      },
    });
    room.codeOutput = executeCode.data;
    room.save();
    io.to(roomId).emit(ACTIONS.SHOW_OUTPUT, { output: executeCode.data });
  });

  // ACTIONS.FETCH_AVAILABLE_LANGUAGES

  socket.on(ACTIONS.FETCH_AVAILABLE_LANGUAGES, async ({ roomId }) => {
    const runtimes = await axios.get("https://emkc.org/api/v2/piston/runtimes");
    io.to(roomId).emit(ACTIONS.AVAILABLE_LANGUAGES_LIST, {
      data: runtimes.data,
    });
  });

  socket.on(ACTIONS.LEAVE_ROOM, async (roomId) => {
    let room = await Room.findOne({
      where: {
        roomId: roomId,
      },
    });
    let exitingUser = {};
    let usersFromDel = room.users.filter((val, ind) => {
      if (val.socketId === socket.id) {
        exitingUser = val;
        return false;
      } else {
        return true;
      }
    });
    room.users = usersFromDel;
    await room.save();
    console.log(room.users);
    socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
      socketId: socket.id,
      username: exitingUser.username,
    });
    socket.leave();
  });

  socket.on(ACTIONS.DESTROY_ROOM, async (roomId) => {
    let room = await Room.findOne({
      where: {
        roomId: roomId,
      },
    });
    let exitingUser = {};
    let usersFromDel = room.users.filter((val, ind) => {
      if (val.socketId === socket.id) {
        exitingUser = val;
        return true;
      } else {
        return false;
      }
    });
    if (exitingUser.creator === true) {
      await room.destroy();
      // make all clients in that room leave , so no active users means the room will be automatically deleted.
      io.to(roomId).emit(ACTIONS.ROOM_DELETED);
      io.in(roomId).socketsLeave(roomId);
      // socket.leave();
    }
  });
});

app.use(errorLogger);
app.use(errorResponder);
app.use(invalidPathHandler);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
