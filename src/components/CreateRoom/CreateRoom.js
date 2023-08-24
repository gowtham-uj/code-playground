import React, { useState, useEffect } from "react";
import { v4 as uuidV4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreateRoom = (props) => {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState("");

  useEffect(() => {
    document.title = props.title;
  }, [props.title]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (!token || !user) {
      navigate("/");
    }
    setUserData(user);
    setUsername(user.name);
  }, [userData]);

  const createNewRoomId = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success("Generated A New Room Id");
  };

  const createRoom = () => {
    if (!roomId || !username) {
      toast.error("ROOM ID & username is required");
      return;
    }

    // Redirect
    navigate(`/editor/${roomId}`, {
      state: {
        username,
        fromPage: "create-room",
      },
    });
  };

  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      createRoom();
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
        <h2 style={{ textAlign: "center" }}>Create A New Room </h2>
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
          <span className="createInfo">
            To auto generate the room id &nbsp;
            <a onClick={createNewRoomId} href className="createNewBtn">
              click here
            </a>
            <button
              className="btn joinBtn"
              onClick={createRoom}
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

export default CreateRoom;
