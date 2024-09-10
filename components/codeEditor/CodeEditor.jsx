import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import SplitPane from "react-split-pane";
// import "react-split-pane/lib/index.css";

const CodeEditor = () => {
  // Move getDefaultProgram to the top
  const getDefaultProgram = (lang) => {
    switch (lang) {
      case "python":
        return `print("Hello, World!")`;
      case "javascript":
        return `console.log('Hello, World!');`;
      case "java":
        return `public class HelloWorld {
    public static void main(String[] args) {
      System.out.println("Hello, World!");
    }
  }`;
      case "c++":
        return `#include <iostream>
  using namespace std;
  
  int main() {
      cout << "Hello, World!" << endl;
      return 0;
  }`;
      case "c":
        return `#include <stdio.h>
  
  int main() {
      printf("Hello, World!\\n");
      return 0;
  }`;
      default:
        return `// Hello, World!`;
    }
  };

  const [code, setCode] = useState(getDefaultProgram("javascript"));
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [version, setVersion] = useState("latest");
  const [runtimes, setRuntimes] = useState([]);

  const getRuntimes = async () => {
    try {
      const response = await axios.get(
        "https://emkc.org/api/v2/piston/runtimes"
      );
      const availableRuntimes = response.data;

      const desiredLanguages = ["javascript", "c", "c++", "python", "java"];
      const filteredRuntimes = availableRuntimes.filter((runtime) =>
        desiredLanguages.includes(runtime.language.toLowerCase())
      );

      setRuntimes(filteredRuntimes);

      const defaultRuntime = filteredRuntimes.find(
        (runtime) => runtime.language === language
      );
      if (defaultRuntime) {
        setVersion(defaultRuntime.version || "latest");
      }
    } catch (error) {
      console.error("Error fetching runtimes:", error);
    }
  };

  useEffect(() => {
    getRuntimes();
  }, []);

  useEffect(() => {
    const selectedRuntime = runtimes.find(
      (runtime) => runtime.language === language
    );
    if (selectedRuntime) {
      setVersion(selectedRuntime.version || "latest");
    }
    setCode(getDefaultProgram(language));
  }, [language, runtimes]);

  const runCode = async () => {
    try {
      const response = await axios.post(
        "https://emkc.org/api/v2/piston/execute",
        {
          language: language,
          version: version,
          files: [
            {
              name: `main.${languageExtension(language)}`,
              content: code,
            },
          ],
        }
      );

      const { stdout, stderr } = response.data.run;
      setOutput(stdout || stderr);
    } catch (error) {
      console.error(error);
      setOutput("Error executing code.");
    }
  };

  const languageExtension = (lang) => {
    switch (lang) {
      case "python":
        return "py";
      case "javascript":
        return "js";
      case "java":
        return "java";
      case "c++":
        return "cpp";
      case "c":
        return "c";
      default:
        return "txt";
    }
  };

  const getUniqueLanguages = () => {
    const languageSet = new Set(
      runtimes?.map((runtime) => runtime.language.toLowerCase())
    );
    return Array.from(languageSet).filter((lang) =>
      ["javascript", "c", "c++", "python", "java"].includes(lang)
    );
  };

  return (
    <div className="mt-5 p-4">
      <h2 className="mb-4 text-primary">Online Code Editor</h2>
      <div className="row">
        <div className="col-md-8">
          <div className="row mb-4 align-items-center">
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="language" className="font-weight-bold">
                  Language
                </label>
                <div className="position-relative">
                  <select
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="form-control border-primary pr-5"
                  >
                    {getUniqueLanguages()?.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="version" className="font-weight-bold">
                  Version
                </label>
                <input
                  type="text"
                  id="version"
                  value={version}
                  readOnly
                  className="form-control border-primary"
                />
              </div>
            </div>
            <div className="col-md-4">
              <button
                style={{ float: "right" }}
                onClick={runCode}
                className="btn btn-primary btn-lg mt-4 shadow-lg hover-shadow"
              >
                Run Code
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row" style={{ height: "55vh" }}>
        <SplitPane
          split="vertical"
          minSize={100}
          maxSize={-100}
          defaultSize={"60%"}
          allowResize={true}
        >
          <div className="">
            <div className="mb-4">
              <Editor
                height="100vh"
                language={language === "c++" ? "cpp" : language} // Use "cpp" for Monaco
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value)}
                className="border rounded"
              />
            </div>
          </div>
          <div className="">
            <h3 className="text-secondary"></h3>
            <div
              className="p-3 border rounded bg-white shadow-sm"
              style={{ height: "60vh", overflowY: "auto" }}
            >
              <pre className="text-break">
                {output || "Click on run button to see output"}
              </pre>
            </div>
          </div>
        </SplitPane>
      </div>
    </div>
  );
};

export default CodeEditor;
