"use client";

import React, { FormEvent, useEffect, useRef, useState } from "react";
import { useAppSelector } from "../redux/hooks";
import styled from "styled-components";
import { Todo } from "@/pages/todo";
import Image from "next/image";
import Check from "@/public/img/check.png";
import Pin from "@/public/img/pin.png";
import { SlOptionsVertical } from "react-icons/sl";

const TableBody = styled.tbody`
  td {
    height: 30px;
    text-align: left;
  }
  td:nth-child(1),
  td:nth-child(2) {
    padding-left: 10px;
    margin-right: 2vw;
  }
  td:nth-child(1) {
    width: 30%;
  }
  td:nth-child(2) {
    width: 50%;
  }
  td:nth-child(3) {
    width: 10%;
    img {
      &:hover {
        cursor: pointer;
      }
    }
  }
  td:nth-child(4) {
    width: 10%;
  }
`;
const Clickable = styled.span`
  display: flex;
  justify-content: center;
  &:hover {
  }
`;
const Dropdown = styled.span<{ theme: string }>`
  display: flex;
  justify-content: center;
  div {
    position: absolute;
    visibility: hidden;
    padding: 1vh 1vw;
    border-radius: 10px;
    background-color: ${(props) =>
      props.theme === "light" ? "#dedede" : "#878787"};
    z-index: 1;
    transform: translateX(70%);
  }
  span {
    letter-spacing: 2px;
    display: inline-block;
    padding: 0 1vw;
    border-radius: 5px;
    &:hover {
      cursor: pointer;
      background-color: ${(props) =>
        props.theme === "light" ? "#c0c0c0" : "#a0a0a0"};
    }
  }
  &:hover {
    cursor: pointer;
    div {
      visibility: visible;
    }
  }
`;
const ModalWrapper = styled.div<{ isModalOpen: boolean }>`
  visibility: ${(props) => (props.isModalOpen ? "visible" : "hidden")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #555555b2;
`;
const TodoEditModal = styled.div<{ theme: string }>`
  position: absolute;
  width: 500px;
  height: 200px;
  padding: 2vh 2vw;
  border-radius: 15px;
  background-color: ${(props) =>
    props.theme === "light" ? "#ececec" : "#242424"};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  button:nth-child(1) {
    color: ${(props) => (props.theme === "light" ? "#000000" : "#ffffff")};
    align-self: flex-end;
    position: relative;
    border: none;
    padding: 5px;
    font-size: large;
    background: none;
    &:hover {
      cursor: pointer;
    }
  }
  form {
    margin-top: 2vh;
    height: 50px;
    font-size: medium;
    button {
      background-color: ${(props) =>
        props.theme === "light" ? "#cccccc" : "#dddddd"};
      width: 20%;
      height: 100%;
      border: none;
      border-radius: 0 10px 10px 0;
      font-weight: bold;
      &:hover {
        cursor: pointer;
      }
    }
  }
  input {
    border: none;
    border-radius: 10px 0 0 10px;
    width: 80%;
    height: 100%;
    padding: 1vh 1vw;
  }
`;

export default function TodoTableComp({
  theme,
  todos,
  setTodos,
}: {
  theme: string;
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}) {
  const uid = useAppSelector((state) => state.auth.uid);

  async function fetchTodosApiCall() {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/todos-get/${uid}`
    );
    return response.json();
  }
  useEffect(() => {
    fetchTodosApiCall().then((res) => {
      setTodos(res.data);
    });
  }, []);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentTodo, setCurrentTodo] = useState<Todo>({
    created_at: "",
    id: "",
    is_done: false,
    title: "",
  });
  const inputTitleRef = useRef<HTMLInputElement>(null);
  const handleUpdateModal = (todo: Todo) => {
    setIsModalOpen(true);
    setCurrentTodo(todo);
    if (inputTitleRef.current) {
      inputTitleRef.current.value = todo.title ?? "";
    }
  };

  const updateTodo = async (todo: string, prevTodo: Todo) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/todo-update/${uid}/${prevTodo?.id}`,
      {
        method: "put",
        body: todo,
        cache: "no-store",
      }
    );
    fetchTodosApiCall().then((res) => {
      setTodos(res.data);
    });
  };
  const updatedTotoSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const updatedTodo = JSON.stringify({
      title: inputTitleRef.current?.value,
      is_done: currentTodo?.is_done,
    });
    updateTodo(updatedTodo, currentTodo);

    setIsModalOpen(false);
  };

  const switchTodoState = (todo: Todo) => {
    setCurrentTodo(todo);
    const updatedTodo = JSON.stringify({ ...todo, is_done: !todo.is_done });
    updateTodo(updatedTodo, todo);
  };

  const handleTodoDelete = async (todo: Todo) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/todo-delete/${uid}/${todo.id}`
    ).then((res) => {
      console.log(res);
    });
    fetchTodosApiCall().then((res) => {
      setTodos(res.data);
    });
  };

  return (
    <>
      <ModalWrapper isModalOpen={isModalOpen}>
        <TodoEditModal theme={theme}>
          <button
            onClick={() => {
              setIsModalOpen(false);
            }}
          >
            X
          </button>
          <form onSubmit={updatedTotoSubmit}>
            <input ref={inputTitleRef} type="text"></input>
            <button type="submit">수정</button>
          </form>
        </TodoEditModal>
      </ModalWrapper>

      <TableBody style={{ textAlign: "center" }}>
        {todos.map((todo: Todo) => {
          return (
            <tr style={{ marginTop: "1vh" }} key={todo.id} accessKey={todo.id}>
              <td>{todo.created_at.slice(0, 10)}</td>
              <td>{todo.title}</td>
              <td>
                <Clickable>
                  <span onClick={() => switchTodoState(todo)}>
                    {todo.is_done ? (
                      <Image src={Check} alt="check" width={20} />
                    ) : (
                      <Image src={Pin} alt="pin" width={20} />
                    )}
                  </span>
                </Clickable>
              </td>
              <td>
                <Dropdown theme={theme}>
                  <SlOptionsVertical />
                  <div>
                    <span onClick={() => handleUpdateModal(todo)}>수정</span>
                    <br />
                    <span onClick={() => handleTodoDelete(todo)}>삭제</span>
                  </div>
                </Dropdown>
              </td>
            </tr>
          );
        })}
      </TableBody>
    </>
  );
}
