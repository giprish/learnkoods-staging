// components/CodeEditor.js

import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";

const CodeEditor = () => {
  const [code, setCode] = useState("// Start coding...");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("javascript");

  const runCode = async () => {
    try {
      const response = await axios.post(
        "https://emkc.org/api/v2/piston/execute",
        {
          language: language,
          source: code,
        }
      );

      const { stdout, stderr } = response.data.run;
      setOutput(stdout || stderr);
    } catch (error) {
      console.error(error);
      setOutput("Error executing code.");
    }
  };

  return (
    <div>
      <h2>Online Code Editor</h2>
      <div>
        <label htmlFor="language">Language: </label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="javascript">JavaScript</option>
          <option value="python3">Python 3</option>
          <option value="java">Java</option>
          <option value="c">C</option>
          <option value="cpp">C++</option>
        </select>
      </div>
      <Editor
        height="50vh"
        language={language}
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value)}
      />
      <button onClick={runCode}>Run Code</button>
      <h3>Output:</h3>
      <pre>{output}</pre>
    </div>
  );
};

export default CodeEditor;
