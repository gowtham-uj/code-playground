import { useState, useEffect } from "react";
import { Terminal } from "xterm";
import "./outputTerminal.css";
import chalk from "chalk";

export default function OutputTerminal(props) {
  let [terminalInstance, setterminalInstance] = useState(null);
  useEffect(() => {
    // focus on the output div every time the code ran by user
    let outputDiv = document.getElementById(props.outTerminalCssId);
    outputDiv.scrollIntoView({ behavior: "smooth" });
  });
  return (
    <div className={`out-wrapper-div-xyz`} id={`${props.outTerminalCssId}`}>
      <div className="output-terminal-header">
        <span className="output-header-text">Output Panel</span>
        <div className="output-language-text-wrapper">
          Language :{" "}
          <span className="output-language-text">
            {props.language}
            {/* {chalk.hex("#72f0ff").bold("hello")} */}
          </span>
        </div>
      </div>
      <div className="output-code-text-wrapper">
        {!!props.outputObj.stdout ? (
          <div className="output-code-text-success">
            {props.outputObj.output}
          </div>
        ) : (
          false
        )}

        {!!props.outputObj.stderr ? (
          <div class="output-code-text-error">{props.outputObj.output}</div>
        ) : (
          false
        )}
      </div>
    </div>
  );
}
