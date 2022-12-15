import { useEffect, useState, useRef, useLayoutEffect } from "react";
import shortUUID, { uuid } from "short-uuid";

import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import { motion } from "framer-motion";

import "./editor.css";
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/go/go";
import "codemirror/mode/swift/swift";
import "codemirror/mode/python/python";
import "codemirror/mode/php/php";
import "codemirror/mode/markdown/markdown";
import "codemirror/mode/rust/rust";
import "codemirror/mode/sql/sql";
import "codemirror/mode/css/css";
import "codemirror/addon/scroll/simplescrollbars.js";

import "codemirror/theme/material-palenight.css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";

import ACTIONS from "../../Actions";

export default function Editor({
  socketRef,
  roomId,
  onCodeChange,
  height,
  width,
}) {
  // let { roomId } = useParams();
  // let socketRef = useRef(null);
  // console.log(props.socket);
  const editorRef = useRef(null);

  useEffect(() => {
    async function init() {
      editorRef.current = await CodeMirror.fromTextArea(
        document.getElementById(`${editorInstanceId}`),
        {
          mode: { name: "javascript", json: true },
          lineNumbers: true,
          theme: "material-palenight",
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineWrapping: true,
        }
      );

      editorRef.current.setSize(width, height);

      editorRef.current.on("change", (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);
        if (origin !== "setValue") {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
          });
        }
      });
    }
    init();
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          editorRef.current.focus();
          editorRef.current.setValue(code);
          editorRef.current.setCursor(editorRef.current.lineCount(), 0);
        }
      });
      socketRef.current.on(ACTIONS.UPDATE_CODE_LANGUAGE, ({ language }) => {
        console.log(language);
        if (language) {
          setSelectedOptions((state) => {
            return (
              <motion.select
                // whileHover={{  }}
                ref={selectELRef}
                onChange={(e) => verifyEditorLang(e.target.value)}
                value={language}
              >
                {selectLangOptions.map((el, index, arr) => {
                  return (
                    <option value={el.value} key={uuid()}>
                      {el.text}
                    </option>
                  );
                })}
              </motion.select>
            );
          });
        }
      });
    }

    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]);

  const navigate = useNavigate();

  const [editorLang, setEditorLang] = useState("javascript");
  const [roomConfigData, setRoomConfigData] = useState(null);

  let [editorInstanceId, setEditorInstanceId] = useState(() => {
    return shortUUID.generate();
  });

  let selectELRef = useRef(null);

  let [CMInstance, setCMInstance] = useState(null);

  let selectLangOptions = [
    { value: "javascript", text: "Javascript" },
    { value: "python", text: "Python" },
    { value: "go", text: "Go" },
    { value: "swift", text: "Swift" },
    { value: "rust", text: "Rust" },
    { value: "css", text: "Css" },
    { value: "sql", text: "Sql" },
    { value: "markdown", text: "Markdown" },
  ];

  let [selectedOptions, setSelectedOptions] = useState(null);
  const editorSupportedLangs = {
    javascript: "javascript",
    python: "python",
    swift: "swift",
    go: "go",
    php: "php",
    markdown: "markdown",
    rust: "rust",
    sql: "sql",
    css: "css",
  };

  // let configUpdateMutation = useMutation({
  //   mutationFn: updateRoomConfig,
  // });

  const verifyEditorLang = (newValue) => {
    if (!!editorSupportedLangs[newValue]) {
      setEditorLang(editorSupportedLangs[newValue]);
      // console.log(editorSupportedLangs[newValue]);
      socketRef.current.emit(ACTIONS.UPDATE_CODE_LANGUAGE, {
        language: editorSupportedLangs[newValue],
        roomId: roomId,
      });
      setSelectedOptions((state) => {
        return (
          <motion.select
            // whileHover={{  }}
            ref={selectELRef}
            onChange={(e) => verifyEditorLang(e.target.value)}
            // defaultValue="javascript"
            value={newValue}
          >
            {selectLangOptions.map((el, index, arr) => {
              return (
                <option value={el.value} key={uuid()}>
                  {el.text}
                </option>
              );
            })}
          </motion.select>
        );
      });
    }
  };

  useEffect(() => {
    async function init() {
      // console.log(cmIns);

      // let fetchedConfigs = await fetchRoomConfig(roomId);

      // console.log(fetchedConfigs.roomConfig.ROOM_LANGUAGE);

      // cmIns.setMode
      // cmIns.setOption("mode", fetchedConfigs.roomConfig.ROOM_LANGUAGE);

      // setCMInstance(cmIns);
      setSelectedOptions((state) => {
        return (
          <motion.select
            // whileHover={{  }}
            ref={selectELRef}
            onChange={(e) => verifyEditorLang(e.target.value)}
            // defaultValue="javascript"
            // value={fetchedConfigs.roomConfig.ROOM_LANGUAGE}
          >
            {selectLangOptions.map((el, index, arr) => {
              return (
                <option value={el.value} key={uuid()}>
                  {el.text}
                </option>
              );
            })}
          </motion.select>
        );
      });

      // console.log(selectELRef.current.value);
    }
    init();
  }, []);

  return (
    <>
      <div className="editor-options-header">
        <div className="lang-select-wrapper">{selectedOptions}</div>
        {/* <div>languages</div>
        <div>languages</div>
        <div>languages</div>
        div>languages</.div> */}
      </div>
      <textarea
        id={editorInstanceId}
        // style={{ height: `${props.height}`, width: `${props.width}` }}
      ></textarea>
    </>
  );
}

/*


code auto formate when a button is clicked

*/

/*
Socket io design for the bith frontend and backend

when the language option is changed the event should be fired to the server that updates the room config in the db and send the latest updated config and we will take it and create the options with the value being set to the newly updated value form the server.


EVENTS TO BE EMITTED:
frontend:
update_ECL

EVENTS TO BE HANDLED:
frontend:
handle_ECU

backend:
update_ECL



ECU - EDITOR CONFIG UPDATE

ECL - EDITOR CONFIG LANGUAGE

ROOMS FOR THE PEOPLE ON THE GROUP MEM

HAVE AN OPTION IN THE CONFIG THAT IS SAYING THE WHO CAN ACCESS THE ROOM WHEATHER IT IS ONLY GROUP MEMBERS OR EVERYONE IS ALLOWED TO JOIN

for only group members we can
1. frist get the req to join the socket room with room id and user id

2. we wil check weather the user id is in participants list if yes then then join that socket in the room.

--------------------------------
1. api to take room code and return the room details if the room code is valid.

2. show a screen to all peers that want to connect to that room using the room code a simple form that collects email id and name .

3. join the peers to the room

4. edit the code and code should be synced with all of the sockets in the room.

5. the edited code should be stored in the db and should gets updated for every update from the peers in the room.


*/
