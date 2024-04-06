"use client";

import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { FaMicrophone } from "react-icons/fa";

const Form = styled.form`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-top: 2vh;
  svg {
    width: 5%;
    &:hover {
      cursor: pointer;
    }
  }
`;
const Input = styled.input<{ theme: string }>`
  width: 63%;
  height: 50px;
  border: ${(props) => (props.theme === "light" ? 1 : 0)}px solid black;
  border-radius: 10px;
  padding: 0 1%;
  background-color: ${(props) =>
    props.theme === "light" ? "white" : "#555555"};
  color: ${(props) => (props.theme === "light" ? "#000000" : "#ffffff")};
`;
const SubmitBtn = styled.button<{ theme: string }>`
  width: 11%;
  height: 50px;
  font-size: medium;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  margin-left: 1%;
  background-color: ${(props) =>
    props.theme === "light" ? "#e2e2e2" : "#555555"};
  color: ${(props) => (props.theme === "light" ? "#000000" : "#ffffff")};
  &:hover {
    cursor: pointer;
  }
`;

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

export default function SpeechToTextComp({
  theme,
  handleSubmitTodo,
}: {
  theme: string;
  handleSubmitTodo: any;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);

  const recognitionRef = useRef<any>(null);

  const startRecording = () => {
    setIsRecording(true);
    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onresult = (event: any) => {
      console.log(event.results);
      const { transcript } = event.results[event.results.length - 1][0];
      if (inputRef.current) inputRef.current.value = transcript;
    };

    recognitionRef.current.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setRecordingComplete(true);
    }
  };

  const handleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleSubmitTodo(inputRef.current?.value ?? "");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <Form style={{ width: "100%" }} onSubmit={handleSubmit}>
      <Input ref={inputRef} theme={theme} placeholder=" 새로운 할 일"></Input>
      <FaMicrophone
        size={24}
        onClick={handleRecording}
        color={isRecording ? "red" : "black"}
      />
      <SubmitBtn theme={theme} type="submit">
        추가
      </SubmitBtn>
    </Form>
  );
}
