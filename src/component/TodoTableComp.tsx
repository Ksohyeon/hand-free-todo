"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector } from "../redux/hooks";
import styled from "styled-components";
import { Todo } from "@/pages/todo";

const TableBody = styled.tbody`
  tr {
    height: 30px;
    text-align: left;
  }
  td {
    padding-left: 10px;
    border-radius: 10px;
  }
  td:not(:nth-child(3)) {
    margin-right: 2vw;
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

  return (
    <TableBody style={{ textAlign: "center" }}>
      <tr>
        <td style={{ width: "30%" }}>a</td>
        <td style={{ width: "50%" }}>b</td>
        <td style={{ width: "10%" }}>c</td>
        <td style={{ width: "10%" }}></td>
      </tr>

      {todos.map((todo: Todo) => {
        return (
          <tr style={{ marginTop: "1vh" }}>
            <td>{todo.created_at.slice(0, 10)}</td>
            <td>{todo.title}</td>
            <td>{todo.is_done ? "완료" : "미완료"}</td>
            <td></td>
          </tr>
        );
      })}
    </TableBody>
  );
}
