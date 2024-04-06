import { useAppSelector } from "@/src/redux/hooks";
import styled from "styled-components";

const ThemeProvider = styled.div<{ theme: string }>`
  background-color: ${(props) =>
    props.theme === "light" ? "#fffff" : "#272727"};
  color: ${(props) => (props.theme === "light" ? "#000000" : "#ffffff")};
`;

export default function ThemeWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useAppSelector((state) => state.theme.mode);

  return (
    <>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </>
  );
}
