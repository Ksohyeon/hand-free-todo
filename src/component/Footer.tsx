import styled from "styled-components";

const Footer_div = styled.div`
  background-color: #000000;
  height: 100px;
`;

const CopyRight = styled.div`
  text-align: center;
  font-weight: bold;
  color: white;
`;

export default function Footer() {
  return (
    <Footer_div>
      <br />
      <CopyRight>Copyright © HandFreeToDo. All rights reserved.</CopyRight>
      <br />
      <br />
    </Footer_div>
  );
}
