"use client";

import TodoTableComp from "@/src/component/TodoTableComp";
import { useAppSelector } from "@/src/redux/hooks";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";
import SpeechToTextComp from "@/src/component/SpeechToTextComp";
import { BiSolidDownArrow } from "react-icons/bi";
import { BiSolidUpArrow } from "react-icons/bi";

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

const Table = styled.table<{ theme: string }>`
  background-color: ${(props) =>
    props.theme === "light" ? "#f5f5f5" : "#555555"};
  border-radius: 15px;
  margin-top: 1vh;
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

const FilteringMenu = styled.div<{ theme: string }>`
  position: absolute;
  width: 50px;
  border-radius: 10px;
  div:nth-child(1) {
    border-radius: 10px 10px 0 0;
  }
  div:nth-child(3) {
    border-radius: 0 0 10px 10px;
  }
  div {
    width: 70px;
    height: 30px;
    padding: 5px;
    border: 1px solid grey;
    background-color: ${(props) =>
      props.theme === "light" ? "#f4f4f4" : "#636363"};
    &:hover {
      background-color: ${(props) =>
        props.theme === "light" ? "#e8e8e8" : "#898989"};
      cursor: pointer;
    }
  }
`;

export type Todo = {
  id: string;
  title: string;
  is_done: boolean;
  created_at: string;
};
const Clickable = styled.span`
  &:hover {
    cursor: pointer;
  }
`;

export type FilteringOption = "no-option" | "done" | "ongoing";

export default function todo() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteringOption, setFilteringOption] =
    useState<FilteringOption>("no-option");
  const [isFilteringMenuOpen, setIsFilteringMenuOpen] =
    useState<boolean>(false);
  const uid = useAppSelector((state) => state.auth.uid);
  const theme = useAppSelector((state) => state.theme.mode);

  async function fetchTodoApiCall(title: string) {
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

  const handleSubmitTodo = async (title: string) => {
    fetchTodoApiCall(title).then((res) => {
      setTodos((prev) => [...prev, res.data]);
    });
  };

  return (
    <>
      <TodoWrapper>
        <Todo theme={theme}>
          <h1>TODOS</h1>
          <SpeechToTextComp
            mode="create"
            theme={theme}
            handleSubmitTodo={handleSubmitTodo}
          />
          <div
            style={{
              position: "relative",
              alignSelf: "flex-end",
              marginTop: "1vh",
              marginRight: "13%",
            }}
            onClick={() => setIsFilteringMenuOpen((prev) => !prev)}
          >
            <Clickable>
              {isFilteringMenuOpen ? <BiSolidUpArrow /> : <BiSolidDownArrow />}
            </Clickable>
            &nbsp;필터
            {isFilteringMenuOpen && (
              <FilteringMenu theme={theme}>
                <div onClick={() => setFilteringOption("no-option")}>모두</div>
                <div onClick={() => setFilteringOption("done")}>완료</div>
                <div onClick={() => setFilteringOption("ongoing")}>미완료</div>
              </FilteringMenu>
            )}
          </div>
          <Table theme={theme}>
            <thead>
              <tr style={{ paddingTop: "1vh" }}>
                <th>&nbsp;생성일</th>
                <th>&nbsp;내용</th>
                <th>&nbsp;완료</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <TodoTableComp
              todos={todos}
              setTodos={setTodos}
              theme={theme}
              filteringOption={filteringOption}
            />
          </Table>
        </Todo>
      </TodoWrapper>
    </>
  );
}
