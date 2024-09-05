import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { Button, Form, Container, Row, Col } from "react-bootstrap";

const CodeEditor = () => {
  const [code, setCode] = useState("// Start coding...");
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
    <Container className="my-5 p-4">
      <h2 className="mb-4 text-primary">Online Code Editor</h2>
      <Row className="mb-4 align-items-center">
        <Col md={4}>
          <Form.Group controlId="language">
            <Form.Label className="font-weight-bold">Language</Form.Label>
            <Form.Control
              as="select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border-primary"
            >
              {getUniqueLanguages().map((lang) => (
                <option key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </Form.Control>
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
      </Row>
      <div className="mb-4">
        <Editor
          height="60vh"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value)}
          className="border rounded"
        />
      </div>
      <Button
        onClick={runCode}
        variant="primary"
        size="lg"
        className="mb-4 shadow-lg hover-shadow"
      >
        Run Code
      </Button>
      <h3 className="mb-3 text-secondary">Output:</h3>
      <div className="p-3 border rounded bg-white shadow-sm">
        <pre className="text-break">{output}</pre>
      </div>
    </Container>
  );
};

export default CodeEditor;
