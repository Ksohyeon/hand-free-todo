"use client";

import TodoTableComp from "@/src/component/TodoTableComp";
import { useAppSelector } from "@/src/redux/hooks";
import React, { useRef, useState } from "react";
import styled from "styled-components";
import { FaMicrophone } from "react-icons/fa";

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
  thead {
    width: 100%;
    padding: 1vh 1vw;
    background-color: ${(props) =>
      props.theme === "light" ? "#ffffff" : "#3e3e3e"};
    border: none;
    border-radius: 10px;
  }
  thead th:nth-child(1) {
    width: 30%;
    border-radius: 10px 0 0 10px;
  }
  thead th:nth-child(2) {
    width: 50%;
  }
  thead th:nth-child(3) {
    width: 10%;
  }
  thead th:nth-child(4) {
    width: 10%;
    border-radius: 0 10px 10px 0;
  }
`;

const Form = styled.form`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-top: 2vh;
  svg {
    width: 5%;
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

const Table = styled.table<{ theme: string }>`
  background-color: ${(props) =>
    props.theme === "light" ? "#f5f5f5" : "#555555"};
  border-radius: 15px;
  margin-top: 2vh;
  border-collapse: separate;
  border-spacing: 0 7px;
  width: 80%;
  padding: 2vh 1vw;
  text-align: left;
  th,
  td {
    padding: 1vh 0;
  }
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
            <FaMicrophone size={24} />
            <SubmitBtn theme={theme} type="submit">
              추가
            </SubmitBtn>
          </Form>

          <Table theme={theme}>
            <thead>
              <tr style={{ paddingTop: "1vh" }}>
                <th>&nbsp;생성일</th>
                <th>&nbsp;내용</th>
                <th>&nbsp;완료</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <TodoTableComp todos={todos} setTodos={setTodos} theme={theme} />
          </Table>
        </Todo>
      </TodoWrapper>
    </>
  );
}
