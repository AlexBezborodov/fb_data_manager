import React from "react";

import { Spin } from "antd";
import styled from "styled-components";

export const BasicLoader = () => {
  return (
    <StartPageWrapper>
      <Spin size="large" />
    </StartPageWrapper>
  );
};

export const StartPageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;
