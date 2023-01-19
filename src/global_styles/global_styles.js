import styled from "styled-components";

export const Box = styled.div`
  padding: ${(props) => props.p};
  margin: ${(props) => props.m};
  width: ${(props) => props.width};
  ::-webkit-scrollbar {
    display: none;
  }
`;
