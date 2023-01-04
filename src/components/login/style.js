import styled from "styled-components";

export const LoginWrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100vh;
  background: rgb(255, 255, 255);
  background: linear-gradient(
    349deg,
    rgba(255, 255, 255, 1) 11%,
    rgba(0, 212, 255, 1) 43%,
    rgba(27, 116, 228, 1) 64%
  );
`;

export const Header = styled.div`
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-box-shadow: 0px 8px 11px -4px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 8px 11px -4px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 8px 11px -4px rgba(0, 0, 0, 0.75);
`;
export const LoginArea = styled.div`
  text-align: center;
  margin: 0 auto;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 16px;
  width: 350px;
  // -webkit-box-shadow: 0px 4px 6px 2px rgba(171, 168, 171, 1);
  // -moz-box-shadow: 0px 4px 6px 2px rgba(171, 168, 171, 1);
  // box-shadow: 0px 4px 6px 2px rgba(171, 168, 171, 1);
`;
export const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: calc(100% - 40px);
`;
