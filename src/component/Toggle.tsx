import React from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { switchTheme } from "../redux/features/themeSlice";
import moon from "@/public/img/moon.png";
import sun from "@/public/img/sun.png";
import Image from "next/image";

const ToggleWrapper = styled.button<{ mode: string }>`
  background-color: ${(props) =>
    props.mode === "dark" ? "#000048" : "#fffff"};
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border: 2px;
  border-radius: 50%;
  box-shadow: ${(props) =>
    props.mode === "dark"
      ? "0px 5px 10px rgba(40, 40, 40, 1), 0px 2px 4px rgba(40, 40, 40, 1)"
      : "0 5px 10px rgba(100, 100, 100, 0.15), 0 2px 4px rgba(100, 100, 100, 0.15)"};
  &:hover {
    cursor: pointer;
  }
`;

export default function Toggle() {
  const mode = useAppSelector((state) => state.theme.mode);
  const dispatch = useAppDispatch();
  const toggleHandler = () => {
    dispatch(switchTheme());
  };

  return (
    <ToggleWrapper onClick={toggleHandler} mode={mode}>
      {mode === "dark" ? (
        <Image src={moon} alt={"logo"} width={36} />
      ) : (
        <Image src={sun} alt={"logo"} width={36} />
      )}
    </ToggleWrapper>
  );
}
