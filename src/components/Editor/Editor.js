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
import OutputTerminal from "../OutputTerminal/OutputTerminal";

export default function Editor({
  socketRef,
  roomId,
  onCodeChange,
  height,
  width,
  codeRef,
}) {
  // let { roomId } = useParams();
  // let socketRef = useRef(null);
  // console.log(props.socket);
  const editorRef = useRef(null);

  const navigate = useNavigate();

  const [editorLang, setEditorLang] = useState("javascript");
  const [editorLangVer, setEditorLangVer] = useState("16.3.0");
  const [roomConfigData, setRoomConfigData] = useState(null);

  let [editorInstanceId, setEditorInstanceId] = useState(() => {
    return shortUUID.generate();
  });

  let selectELRef = useRef(null);

  let [CMInstance, setCMInstance] = useState(null);
  let [codeOutput, setCodeOutput] = useState(null);

  let [selectLangOptions, setSelectLangOptions] = useState([]);
  // let [selectedOptions, setSelectedOptions] = useState(null);
  let [selectedValue, setSelectedValue] = useState("");

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
        // let proccessedEditorLang = selectedValue.split("-");
        // codeRef.current = { code, language: editorLang };
        onCodeChange({
          ...codeRef.current,
          code: code,
        });
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

      console.log("emmting the code lang fetch event");
      socketRef.current.emit(ACTIONS.FETCH_AVAILABLE_LANGUAGES, {
        roomId,
      });

      socketRef.current.on(ACTIONS.AVAILABLE_LANGUAGES_LIST, ({ data }) => {
        let denoJavascriptElement = null;
        let nodeJsOption = null;
        data.forEach((element, index) => {
          if (element.language === "javascript" && element.runtime === "deno") {
            denoJavascriptElement = index;
          }

          if (element.language === "javascript" && element.runtime === "node") {
            nodeJsOption = index;
          }
        });
        delete data[denoJavascriptElement];
        data[nodeJsOption].isDefault = true;
        setEditorLang(data[nodeJsOption].language);
        setEditorLangVer(data[nodeJsOption].version);
        onCodeChange({
          code: null,
          language: data[nodeJsOption].language,
          version: data[nodeJsOption].version,
        });
        setSelectedValue(
          `${data[nodeJsOption].language}-${data[nodeJsOption].version}`
        );
        setSelectLangOptions(data);
        // socketRef.current.emit(ACTIONS.SYNC_PREV_ROOM_STATE, roomId);
      });

      socketRef.current.on(ACTIONS.UPDATE_CODE_LANGUAGE, ({ language }) => {
        let procLang = language.split("-");
        onCodeChange({
          code: null,
          language: procLang[0],
          version: procLang[1],
        });
        console.log(language);
        setSelectedValue(language);
      });

      socketRef.current.on(ACTIONS.INITIAL_SYNC_DATA, (roomState) => {
        // console.log(roomState);
        if (!!roomState.roomLanguage) {
          // console.log("hello1");
          let procLang = roomState.roomLanguage.split("-");
          onCodeChange({
            code: null,
            language: procLang[0],
            version: procLang[1],
          });
          setSelectedValue(roomState.roomLanguage);
        }
        if (!!roomState.codeChanges) {
          // console.log("hello2");
          editorRef.current.focus();
          editorRef.current.setValue(roomState.codeChanges);
          editorRef.current.setCursor(editorRef.current.lineCount(), 0);
        }
        if (!!roomState.codeOutput) {
          // console.log("hello3");
          setCodeOutput(roomState.codeOutput);
        }
      });
      socketRef.current.on(ACTIONS.SHOW_OUTPUT, ({ output }) => {
        if (!output) return;
        setCodeOutput(output);
      });
    }

    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]);

  const verifyEditorLang = (newValue) => {
    // console.log(newValue);
    let extractedLangVer = newValue.split("-");
    setEditorLang(extractedLangVer[0]);
    setEditorLangVer(extractedLangVer[1]);
    socketRef.current.emit(ACTIONS.LANG_CHANGE, {
      language: newValue,
      roomId: roomId,
    });
    // console.log(extractedLangVer);
    onCodeChange({
      code: null,
      language: extractedLangVer[0],
      version: extractedLangVer[1],
    });
  };

  useEffect(() => {
    async function init() {
      if (socketRef.current) {
        // emit FETCH_AVAILABLE_LANGUAGES event to server
        socketRef.current.emit(ACTIONS.FETCH_AVAILABLE_LANGUAGES, {
          roomId,
        });

        // server will handel it and send the actual data by firing a another event to the client with the data - event name : AVAILABLE_LANGUAGES_LIST
        // client takes the data and it will change the state of selectedLangs state , the event handler will be on top of the component.
      }

      // console.log(selectELRef.current.value);
    }
    init();
  }, [socketRef.current]);

  // useEffect(() => {
  //   socketRef.current.emit(ACTIONS.LANG_CHANGE, selectedValue);
  // }, [selectedValue]);

  return (
    <>
      <div className="editor-options-header">
        <div className="lang-select-wrapper">
          <motion.select
            // whileHover={{  }}
            ref={selectELRef}
            onChange={(e) => {
              verifyEditorLang(e.target.value);
              setSelectedValue(e.target.value);
            }}
            value={selectedValue}
            className="language-selector"
          >
            {selectLangOptions.map((el, index, arr) => {
              return (
                <option
                  value={`${el.language}-${el.version}`}
                  key={uuid()}
                  // defaultValue={el.isDefault === true ? true : false}
                >
                  {`${el.language} (${el.version})`}
                </option>
              );
            })}
          </motion.select>
        </div>
      </div>
      <div className="editor-wrapper">
        <textarea id={editorInstanceId}></textarea>
        {!!codeOutput ? (
          <OutputTerminal
            outTerminalCssId="output-terminal"
            language={`${codeOutput.language} (${codeOutput.version})`}
            outputObj={codeOutput.run}
          />
        ) : (
          false
        )}
      </div>
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
