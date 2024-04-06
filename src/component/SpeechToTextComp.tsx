"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { FaMicrophone } from "react-icons/fa";
import { Todo } from "@/pages/todo";

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

export default function SpeechToTextComp({
  mode,
  theme,
  currentTodo,
  handleSubmitTodo,
  updateTodo,
  setIsModalOpen,
}: {
  mode: "create" | "update";
  theme: string;
  currentTodo?: Todo;
  handleSubmitTodo?: any;
  updateTodo?: any;
  setIsModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);

  const recognitionRef = useRef<any>(null);

  const startRecording = () => {
    setIsRecording(true);
    recognitionRef.current = new webkitSpeechRecognition();
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

  const updatedTotoSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const updatedTodo = JSON.stringify({
      title: inputRef.current?.value,
      is_done: currentTodo?.is_done,
    });
    updateTodo(updatedTodo, currentTodo);

    if (setIsModalOpen) setIsModalOpen(false);
  };

  useEffect(() => {
    if (setIsModalOpen && inputRef.current)
      inputRef.current.value = currentTodo?.title ?? "";
    console.log("!!!!: ", currentTodo?.title ?? "");
    return () => {
      if (setIsModalOpen && inputRef.current) inputRef.current.value = "";
    };
  }, [currentTodo]);

  return (
    <Form
      style={{ width: "100%" }}
      onSubmit={(e) => {
        if (mode === "create") handleSubmit(e);
        else if (mode === "update") updatedTotoSubmit(e);
      }}
    >
      <Input ref={inputRef} theme={theme} placeholder=" 새로운 할 일"></Input>
      <FaMicrophone
        size={24}
        onClick={handleRecording}
        color={isRecording ? "red" : theme === "light" ? "black" : "white"}
      />
      <SubmitBtn theme={theme} type="submit">
        {mode === "create" ? "추가" : "수정"}
      </SubmitBtn>
    </Form>
  );
}
