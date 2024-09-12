import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import SplitPane from "react-split-pane";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

const CodeEditor = () => {
  const router = useRouter();
  const { id } = router.query;

  const fetchData = async (id) => {
    if (id) {
      const response = await axios.get(
        `${process.env.GLOBAL_API}/asses-ques/${id}/`
      );
      return response.data.data;
    }
  };

  // React Query for fetching the question data
  const {
    data: que,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["queData", id], // Include id in queryKey to refetch when id changes
    queryFn: () => fetchData(id),
    enabled: !!id, // Ensures query only runs when id is defined
    retry: 0,
  });

  console.log(que);

  const getDefaultProgram = (lang) => {
    const defaultCode = {
      javascript: `// Start coding in JavaScript here\nfunction myFunction() {\n  // Your code goes here\n}`,
      python: `# Start coding in Python here\ndef my_function():\n    # Your code goes here\n    pass`,
      java: `// Start coding in Java here\npublic class Solution {\n  public static void main(String[] args) {\n    // Your code goes here\n  }\n}`,
      "c++": `// Start coding in C++ here\n#include <iostream>\nusing namespace std;\nint main() {\n  // Your code goes here\n  return 0;\n}`,
      c: `// Start coding in C here\n#include <stdio.h>\nint main() {\n  // Your code goes here\n  return 0;\n}`,
    };

    return defaultCode[lang] || `// Start coding in ${lang} here`;
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
      <h2 className="mb-4 text-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="35"
          height="35"
          fill="currentColor"
          className="bi bi-code-slash"
          viewBox="0 0 16 16"
        >
          <path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0m6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0" />
        </svg>{" "}
        Problem
      </h2>
      <div className="row" style={{ height: "160vh" }}>
        <SplitPane
          split="vertical"
          minSize={400}
          maxSize={750}
          defaultSize={"40%"}
          allowResize={true}
        >
          <div style={{ height: "160vh", overflow: "auto" }}>
            <div className="me-3 p-3 border rounded bg-light">
              <h5 className="mb-3">Que. {que?.name}</h5>
              <p>
                <strong>Difficulty:</strong> {que?.difficulty}
              </p>
              <p className="my-3" style={{ fontSize: "18px" }}>
                {que?.description}
              </p>

              {que?.example?.map((ex, index) => (
                <div key={index} className="my-4 p-3 border rounded bg-white">
                  <p>
                    <strong>Example {index + 1}:</strong>
                  </p>
                  <p>
                    <strong>Input:</strong> {ex.input}
                  </p>
                  <p>
                    <strong>Output:</strong> {ex.output}
                  </p>
                  <p>
                    <strong>Explanation:</strong> {ex.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <SplitPane
            split="horizontal"
            minSize={400}
            maxSize={680}
            defaultSize={"50%"}
            allowResize={true}
          >
            <div className="p-3" style={{ width: "100%" }}>
              <div className="row mb-4 align-items-center">
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="language" className="font-weight-bold">
                      Language
                    </label>
                    <select
                      id="language"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="form-control border-primary"
                    >
                      {getUniqueLanguages()?.map((lang) => (
                        <option key={lang} value={lang}>
                          {lang.charAt(0).toUpperCase() + lang.slice(1)}
                        </option>
                      ))}
                    </select>
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
                  <div style={{ float: "right" }}>
                    <button
                      onClick={runCode}
                      className="btn btn-secondary btn-md mt-4 me-3 shadow-lg hover-shadow"
                    >
                      Compile & Run
                    </button>
                    <button
                      onClick={runCode}
                      className="btn btn-success btn-md mt-4 shadow-lg hover-shadow"
                    >
                      Submit
                    </button>
                  </div>
                </div>
                <div className="col-md-12 mt-3">
                  <Editor
                    height="75vh"
                    language={language === "c++" ? "cpp" : language} // Use "cpp" for Monaco
                    theme="vs-dark"
                    value={code}
                    onChange={(value) => setCode(value)}
                    className="border rounded"
                  />
                </div>
              </div>
            </div>

            <pre
              className="border rounded bg-white shadow-sm mx-3 mt-3 p-3"
              style={{ height: "65vh", overflow: "auto" }}
            >
              {output || "Click on run button to see output"}
            </pre>
          </SplitPane>
        </SplitPane>
      </div>
    </div>
  );
};

export default CodeEditor;
