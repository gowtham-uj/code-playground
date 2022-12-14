import { useEffect, useRef, useLayoutEffect } from "react";
// import ejs from "ejs";
import { motion } from "framer-motion";
// const short = require("short-uuid");
import shortUid from "short-uuid";

import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

// import Select from "react-select";

//mui imports
// import { Select, InputLabel, MenuItem } from "@mui/material";

// components imports

import AppHeader from "../AppHeader/AppHeader";

// cm imports
import Editor from "../Editor/Editor";

import "./CodeRoom.css";
import { useState } from "react";
// import { FormControl, FormControlLabel } from "@mui/material";
// css imports

export default function CodeRoom(props) {
  // let { roomId } = useParams();

  const [editorCode, setEditorCode] = useState();
  // const editorRef = useCMWHook([]);

  const [codeToExecute, setCodeToExecute] = useState("");
  // const [iframeLogs, setIframeLogs] = useState([]);
  // const [renderIframe, setRenderIframe] = useState(false);
  // const [iframeSrcDoc, setIframeSrcDoc] = useState(null);
  const [editorLang, setEditorLang] = useState("javascript");
  // const [roomConfigData, setRoomConfigData] = useState(null);

  const navigate = useNavigate();

  function runClickHandler(e) {}

  const editor = useRef();

  return (
    <div className="code-room-wrapper">
      <div className="code-editor-comp">
        <Editor
          height="81vh"
          width="82vw"
          socketRef={props.socketRef}
          roomId={props.roomId}
          onCodeChange={props.onCodeChange}
        ></Editor>
      </div>
    </div>
  );
}
