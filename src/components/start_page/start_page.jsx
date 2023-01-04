import React, { useEffect } from "react";

import { Spin } from "antd";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

export const StartPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLogged = localStorage.getItem("currentUser");
    setTimeout(() => {
      navigate(isLogged ? "/main/integrations" : "/login");
    }, 2000);
  }, []);
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
  width: 100vh;
  height: 100vh;
`;
