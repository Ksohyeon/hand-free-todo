"use client";

import styled from "styled-components";
import Logo from "@/public/logo.svg";
import Info from "@/public/img/information.png";
import GoogleIcon from "@/public/img/google.png";
import Image from "next/image";
import React, { useState } from "react";
import Toggle from "./Toggle";
import { useRouter } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "@/data/firestore";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setUserInfo, setIsLoggedIn } from "../redux/features/authSlice";

const Header_div = styled.div`
  display: flex;
  align-items: center;
  height: 80px;
  padding: 9px 20px 5px;
  box-shadow: 0 2px 0.4em grey;
`;
const LogoWrapper = styled.span`
  &:hover {
    cursor: pointer;
  }
`;
const RightElement = styled.span`
  position: absolute;
  right: 2vw;
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const InfoButton = styled.span`
  margin-right: 0.7vw;
  position: relative;
  top: 3px;
  &:hover {
    cursor: pointer;
  }
`;
const Btn = styled.span`
  display: flex;
  align-items: center;
  margin-right: 1.2vw;
  word-spacing: 0.005em;
  font-weight: bold;
  &:hover {
    cursor: pointer;
  }
`;

const UserInfoToggle = styled.div<{ isToggleOpen: boolean }>`
  visibility: ${(props) => (props.isToggleOpen ? "visible" : "hidden")};
  position: absolute;
  width: 200px;
  height: 220px;
  border-radius: 15px;
  top: 85px;
  right: 5px;
  padding: 20px 10px;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 0 1em gray;
  background-color: #efefef;
  color: black;
  z-index: 1;
  transition: ease-in-out;
`;

const SignoutBtn = styled.div`
  border: 1px solid black;
  padding: 3px 8px;
  border-radius: 10px;
  background-color: white;
  &:hover {
    cursor: pointer;
  }
`;

export default function Header() {
  const [isToggleOpen, setIsToggleOpen] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const userName = useAppSelector((state) => state.auth.userName);
  const email = useAppSelector((state) => state.auth.email);
  const photoUrl = useAppSelector((state) => state.auth.photoUrl);

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential === null) return;
        const token = credential.accessToken;
        console.log(token);
        const user = result.user;
        console.log("user: ", result.user);
        dispatch(
          setUserInfo({
            uid: user.uid,
            userName: user.displayName,
            email: user.email,
            photoUrl: user.photoURL,
          })
        );
        dispatch(setIsLoggedIn(true));
        alert("로그인 되었습니다.");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  };
  const googleSignOut = async () => {
    signOut(auth)
      .then(() => {
        dispatch(setIsLoggedIn(false));
        alert("로그아웃 되었습니다.");
      })
      .catch((error) => {});
  };
  const handleSignIn = () => {
    googleSignIn();
  };
  const handleSignOut = () => {
    googleSignOut();
  };

  return (
    <Header_div>
      <LogoWrapper>
        <Image
          onClick={() => router.push("/")}
          src={Logo}
          alt={"logo"}
          width={52}
        />
      </LogoWrapper>
      <h2 style={{ display: "inline-block", marginLeft: "1vw" }}>
        Hand Free Todo
      </h2>
      <RightElement>
        {isLoggedIn ? (
          <>
            <UserInfoToggle isToggleOpen={isToggleOpen}>
              <Image
                src={GoogleIcon}
                alt={"googleIcon"}
                width={60}
                height={60}
                unoptimized={true}
                style={{ borderRadius: "50%" }}
              />
              <div style={{ marginTop: "1px" }}>{userName}</div>
              <div style={{ fontSize: "small" }}>{email}</div>
              <SignoutBtn onClick={handleSignOut}>Log out</SignoutBtn>
            </UserInfoToggle>
            <Btn>
              <InfoButton>
                <Image src={Info} alt={"information"} width={38} />
              </InfoButton>
              <Image
                onClick={() => {
                  setIsToggleOpen((state) => !state);
                }}
                src={photoUrl}
                alt={"profile_img"}
                width={40}
                height={40}
                unoptimized={true}
                style={{ borderRadius: "50%" }}
              ></Image>
            </Btn>
          </>
        ) : (
          <>
            <Btn onClick={handleSignIn}>Log in</Btn>
            <InfoButton>
              <Image src={Info} alt={"information"} width={38} />
            </InfoButton>
          </>
        )}

        <Toggle />
      </RightElement>
    </Header_div>
  );
}
