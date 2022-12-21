import styled from "styled-components";

export const LoginWrapper = styled.div`
  box-sizing: border-box;
  border-radius: 1rem;
  border: 1px solid black;
  width: 100%;
  height: 100%;
`;

export const Box = styled.div`
  padding: ${(props) => props.p};
  margin: ${(props) => props.m};
  width: ${(props) => props.width};
`;
export const Header = styled.div`
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  -webkit-box-shadow: 0px 8px 11px -4px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 8px 11px -4px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 8px 11px -4px rgba(0, 0, 0, 0.75);
`;
export const LoginArea = styled.div`
  margin: 0 auto;
  padding: 1rem;
  background-color: #bbbcbd;
  border-radius: 16px;
  width: 250px;
  -webkit-box-shadow: 0px 4px 6px 2px rgba(171, 168, 171, 1);
  -moz-box-shadow: 0px 4px 6px 2px rgba(171, 168, 171, 1);
  box-shadow: 0px 4px 6px 2px rgba(171, 168, 171, 1);
`;
export const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: calc(100% - 40px);
`;
