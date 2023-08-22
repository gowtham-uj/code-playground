import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import ACTIONS from "../Actions";
import Client from "../components/Client";
import CodeRoom from "../components/CodeRoom/CodeRoom";
import AppHeader from "../components/AppHeader/AppHeader";

import { useSelector, useDispatch } from "react-redux";

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
  const [isRoomCreator, setIsRoomCreator] = useState(false);
  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket(authState.user.jwtToken);
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("Socket connection failed, try again later.");
        reactNavigator("/");
      }

      if (location.state?.fromPage === "create-room") {
        socketRef.current.emit(ACTIONS.CREATE_ROOM, {
          roomId,
          username: location.state?.username,
        });
      }

      if (location.state?.fromPage === "join-room") {
        socketRef.current.emit(ACTIONS.JOIN, {
          roomId,
          username: location.state?.username,
        });
      }

      // if (authState.isLoggedIn === false) {
      //   reactNavigator("/");
      // }

      // socketRef.current.emit(ACTIONS.SYNC_CODE, {
      //   code: codeRef.current,
      //   socketId,
      // });

      // Listening for joined event
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room.`);
            console.log(`${username} joined`);
          }
          setClients(clients);
        }
      );
      // listening for new-room-created event
      socketRef.current.on(
        ACTIONS.ROOM_CREATED,
        ({ clients, username, socketId, isCreator }) => {
          setClients(clients);
          if (isCreator === true) {
            setIsRoomCreator(true);
          }
        }
      );
      //listening for invalid room id event
      socketRef.current.on(ACTIONS.INVALID_ROOM_ID, () => {
        reactNavigator("/");
      });

      // if room is deleted
      socketRef.current.on(ACTIONS.ROOM_DELETED, () => {
        reactNavigator(`/`, {
          state: {
            toastMsg: "You Successfully Deleted The Room.",
          },
        });
      });

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
    socketRef.current.emit(ACTIONS.LEAVE_ROOM, roomId);
    reactNavigator("/");
  }

  if (!location.state) {
    return <Navigate to="/" />;
  }

  const runClickHandler = async () => {
    if (!socketRef.current) return;
    socketRef.current.emit(ACTIONS.RUN_CODE, {
      roomId: roomId,
      code: codeRef.current.code,
      language: !codeRef.current.language
        ? "javascript"
        : codeRef.current.language,
      version: !codeRef.current.version ? "16.3.0" : codeRef.current.version,
    });
  };
  const destroyRoom = async () => {
    if (!socketRef.current) return;
    socketRef.current.emit(ACTIONS.DESTROY_ROOM, roomId);
  };

  return (
    <div className="mainWrap">
      {isRoomCreator === true ? (
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
              onClick={destroyRoom}
              key={shortUid.generate()}
              whileHover={{
                borderBottom: "4px solid #ffc600",
                cursor: "pointer",
              }}
            >
              Destroy The Room
            </motion.a>,
          ]}
          // rightLinks={[{ name: "Settings" }, { name: "Go To Dashboard" }]}
          rightLinks={[]}
        />
      ) : (
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
          ]}
          // rightLinks={[{ name: "Settings" }, { name: "Go To Dashboard" }]}
          rightLinks={[]}
        />
      )}

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
