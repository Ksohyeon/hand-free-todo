"use client";

import TodoTableComp from "@/src/component/TodoTableComp";
import { useAppSelector } from "@/src/redux/hooks";
import React, { useRef, useState } from "react";
import styled from "styled-components";

const TodoWrapper = styled.div`
  width: 100vw;
  padding: 5vh 5vw;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Todo = styled.div<{ theme: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 700px;
  min-height: 70vh;
  thead th:not(:nth-child(4)) {
    background-color: ${(props) =>
      props.theme === "light" ? "#ffffff" : "#3e3e3e"};
    padding: 1vh 0;
    margin: 0 2vw;
    border-radius: 10px;
  }
`;

const Form = styled.form`
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 2vh;
`;
const Input = styled.input<{ theme: string }>`
  width: 65%;
  height: 50px;
  border: ${(props) => (props.theme === "light" ? 1 : 0)}px solid black;
  border-radius: 10px;
  margin-right: 1%;
  background-color: ${(props) =>
    props.theme === "light" ? "white" : "#555555"};
  color: ${(props) => (props.theme === "light" ? "#000000" : "#ffffff")};
`;
const SubmitBtn = styled.button<{ theme: string }>`
  width: 14%;
  height: 50px;
  font-size: medium;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  background-color: ${(props) =>
    props.theme === "light" ? "#e2e2e2" : "#555555"};
  color: ${(props) => (props.theme === "light" ? "#000000" : "#ffffff")};
  &:hover {
    cursor: pointer;
  }
`;

const Table = styled.table<{ theme: string }>`
  background-color: ${(props) =>
    props.theme === "light" ? "#e2e2e2" : "#555555"};
  border-radius: 15px;
  margin-top: 2vh;
  border-collapse: separate;
  border-spacing: 10px 7px;
  width: 80%;
  padding: 2vh 1vw;
  text-align: left;
`;
export type Todo = {
  id: string;
  title: string;
  is_done: boolean;
  created_at: string;
};

export default function todo() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const uid = useAppSelector((state) => state.auth.uid);
  const inputRef = useRef<HTMLInputElement>(null);
  const theme = useAppSelector((state) => state.theme.mode);

  async function fetchTodoApiCall() {
    const title = inputRef.current?.value ?? "";
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/todo-post/${uid}`,
      {
        method: "post",
        body: JSON.stringify({ title: title }),
        cache: "no-store",
      }
    );
    return response.json();
  }

  const handleSubmitTodo = async (event: React.FormEvent) => {
    event.preventDefault();
    fetchTodoApiCall().then((res) => {
      console.log(res.data);
      setTodos((prev) => [...prev, res.data]);
    });
  };

  return (
    <>
      <TodoWrapper>
        <Todo theme={theme}>
          <h1>TODOS</h1>
          <Form style={{ width: "100%" }} onSubmit={handleSubmitTodo}>
            <Input
              ref={inputRef}
              theme={theme}
              placeholder=" 새로운 할 일"
            ></Input>
            <SubmitBtn theme={theme} type="submit">
              추가
            </SubmitBtn>
          </Form>

          <Table theme={theme}>
            <thead>
              <tr>
                <th style={{ width: "30%" }}>&nbsp;생성일</th>
                <th style={{ width: "50%" }}>&nbsp;내용</th>
                <th style={{ width: "10%" }}>&nbsp;완료</th>
                <th style={{ width: "10%" }}></th>
              </tr>
            </thead>
            <TodoTableComp todos={todos} setTodos={setTodos} theme={theme} />
          </Table>
        </Todo>
      </TodoWrapper>
    </>
  );
}
