import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { Button, Form, Container, Row, Col } from "react-bootstrap";

const CodeEditor = () => {
  // Move getDefaultComment to the top
  const getDefaultComment = (lang) => {
    switch (lang) {
      case "python":
        return "# Start coding...";
      case "javascript":
        return "// Start coding...";
      case "java":
        return "// Start coding...";
      case "c++":
        return "// Start coding...";
      case "c":
        return "// Start coding...";
      default:
        return "// Start coding...";
    }
  };

  const [code, setCode] = useState(getDefaultComment("javascript"));
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
    setCode(getDefaultComment(language));
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
      runtimes.map((runtime) => runtime.language.toLowerCase())
    );
    return Array.from(languageSet).filter((lang) =>
      ["javascript", "c", "c++", "python", "java"].includes(lang)
    );
  };

  return (
    <Container className="mt-5 p-4">
      <h2 className="mb-4 text-primary">Online Code Editor</h2>
      <Row>
        <Col md={8}>
          <Row className="mb-4 align-items-center">
            <Col md={4}>
              <Form.Group controlId="language">
                <Form.Label className="font-weight-bold">Language</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    as="select"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="border-primary pr-5"
                  >
                    {getUniqueLanguages().map((lang) => (
                      <option key={lang} value={lang}>
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </option>
                    ))}
                  </Form.Control>
                </div>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="version">
                <Form.Label className="font-weight-bold">Version</Form.Label>
                <Form.Control
                  type="text"
                  value={version}
                  readOnly
                  className="border-primary"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Button
                style={{ float: "right" }}
                onClick={runCode}
                variant="primary"
                size="lg"
                className="mt-4 shadow-lg hover-shadow"
              >
                Run Code
              </Button>
            </Col>
          </Row>
          <div className="mb-4">
            <Editor
              height="60vh"
              language={language === "c++" ? "cpp" : language} // Use "cpp" for Monaco
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value)}
              className="border rounded"
            />
          </div>
        </Col>

        <Col md={4} className="mt-5">
          <h3 className="mb-3 text-secondary">Output:</h3>
          <div
            className="p-3 border rounded bg-white shadow-sm"
            style={{ height: "60vh", overflowY: "auto" }}
          >
            <pre className="text-break">{output || "Your Output Here:"}</pre>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CodeEditor;
