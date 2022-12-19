import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import ACTIONS from "../Actions";
import Client from "../components/Client";
import CodeRoom from "../components/CodeRoom/CodeRoom";
import AppHeader from "../components/AppHeader/AppHeader";

import { initSocket } from "../socket";
import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";
import { motion } from "framer-motion";
import shortUid from "short-uuid";

const EditorPage = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const reactNavigator = useNavigate();
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("Socket connection failed, try again later.");
        reactNavigator("/");
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      // Listening for joined event
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room.`);
            console.log(`${username} joined`);
          }
          setClients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );

      // Listening for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room.`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID has been copied to your clipboard");
    } catch (err) {
      toast.error("Could not copy the Room ID");
      console.error(err);
    }
  }

  function leaveRoom() {
    reactNavigator("/");
  }

  if (!location.state) {
    return <Navigate to="/" />;
  }

  const runClickHandler = async () => {
    if (!socketRef.current) return;
    console.log(codeRef.current);
    socketRef.current.emit(ACTIONS.RUN_CODE, {
      roomId: roomId,
      code: codeRef.current.code,
      language: !codeRef.current.language
        ? "javascript"
        : codeRef.current.language,
      version: !codeRef.current.version ? "16.3.0" : codeRef.current.version,
    });
  };

  return (
    <div className="mainWrap">
      <AppHeader
        leftLinks={[
          <motion.a
            onClick={(e) => runClickHandler(e)}
            whileHover={{
              borderBottom: "4px solid #ffc600",
              cursor: "pointer",
            }}
            key={shortUid.generate()}
          >
            Run
          </motion.a>,
          <motion.a
            key={shortUid.generate()}
            whileHover={{
              borderBottom: "4px solid #ffc600",
              cursor: "pointer",
            }}
          >
            Save
          </motion.a>,
          <motion.a
            key={shortUid.generate()}
            whileHover={{
              borderBottom: "4px solid #ffc600",
              cursor: "pointer",
            }}
          >
            Collaborate
          </motion.a>,
        ]}
        // rightLinks={[{ name: "Settings" }, { name: "Go To Dashboard" }]}
        rightLinks={[]}
      />
      <div className="editor-space">
        <div className="aside">
          <div className="asideInner">
            <h3>Connected</h3>
            <div className="clientsList">
              {clients.map((client) => (
                <Client key={client.socketId} username={client.username} />
              ))}
            </div>
          </div>
          <button className="btn copyBtn" onClick={copyRoomId}>
            Copy ROOM ID
          </button>
          <button className="btn leaveBtn" onClick={leaveRoom}>
            Leave
          </button>
        </div>
        <div className="editorWrap">
          <CodeRoom
            socketRef={socketRef}
            roomId={roomId}
            onCodeChange={(code) => {
              // console.log(code);
              codeRef.current = code;
            }}
            codeRef={codeRef}
          />
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
