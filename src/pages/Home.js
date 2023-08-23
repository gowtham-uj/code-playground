import React, { useState, useEffect } from "react";
import { v4 as uuidV4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import store from "../store/store";
import { useSelector, useDispatch } from "react-redux";
import { replace } from "lodash";

const Home = () => {
  const navigate = useNavigate();

  const authState = useSelector((state) => state.auth);
  const [roomId, setRoomId] = useState("");
  const location = useLocation();
  const [username, setUsername] = useState("");

  // useEffect(() => {
  //   if (authState.isLoggedIn === false) {
  //     navigate("/");
  //   }
  // }, [authState]);

  const createNewRoom = (e) => {
    e.preventDefault();
    navigate("/create-room");
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("ROOM ID & username is required");
      return;
    }

    // Redirect
    navigate(`/editor/${roomId}`, {
      state: {
        username,
        fromPage: "join-room",
      },
    });
  };

  if (!!location.state?.toastMsg) {
    toast.success(location.state?.toastMsg);
  }

  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };
  return (
    <div className="homePageWrapper">
      <div className="formWrapper">
        <img
          className="homePageLogo"
          src="/code-sync.png"
          alt="code-sync-logo"
        />
        <h2 style={{ textAlign: "center" }}>Join Room</h2>
        <h4 className="mainLabel">Paste invitation ROOM ID</h4>
        <div className="inputGroup">
          <input
            type="text"
            className="inputBox"
            placeholder="ROOM ID"
            onChange={(e) => setRoomId(e.target.value)}
            value={roomId}
            onKeyUp={handleInputEnter}
          />
          <input
            type="text"
            className="inputBox"
            placeholder="USERNAME"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            onKeyUp={handleInputEnter}
          />
          <button
            className="btn joinBtn"
            onClick={joinRoom}
            style={{ width: "100%" }}
          >
            Join
          </button>
          <span className="createInfo">
            If you don't have invite code then you can create a new room
            <button
              className="btn joinBtn"
              onClick={createNewRoom}
              style={{
                width: "100%",
              }}
            >
              Create New Room
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Home;
