import { useAppSelector } from "@/src/redux/hooks";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import styled from "styled-components";

const MainPage = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 180px);
`;

const Content = styled.div`
  position: relative;
  right: 15vw;
  bottom: 3vh;
  padding: 2vh 2vw;
  display: flex;
  flex-direction: column;
  justify-content: left;
`;

const MainButton = styled.button`
  width: fit-content;
  border: 0;
  border-radius: 15px;
  padding: 1.5vh 3vw;
  margin-top: 4vh;
  font-size: xx-large;
  font-weight: bold;
  background-color: #ffc400;
  &:hover {
    cursor: pointer;
    color: white;
    transform: translateY(-0.5vh);
    transition: 0.2s ease-in-out;
  }
`;

const Canvas = styled.div`
  position: absolute;
`;

const CanvasComp = dynamic(
  () => import("@/src/component/CanvasComp/CanvasComp"),
  {
    ssr: false,
  }
);

export default function Home() {
  const router = useRouter();
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  return (
    <MainPage>
      <Canvas>
        <CanvasComp />
      </Canvas>
      <Content>
        <h1>
          Make it easy to plan a day's schedule
          <br /> by speaking out .
        </h1>
        <MainButton
          onClick={() => {
            if (isLoggedIn) router.push("/todo");
            else alert("로그인 필요");
          }}
        >
          Get Started
        </MainButton>
      </Content>
    </MainPage>
  );
}
