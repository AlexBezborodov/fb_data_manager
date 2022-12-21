import React, { useState } from "react";

import { Button, Input, Typography } from "antd";
import axios from "axios";
import { useNavigate } from "react-router";

import { BASIC_DB_URL, MAIL_REGEXP } from "../../variables";
import { LoginWrapper, Box, Header, LoginArea, Content } from "../login/style";

export const SignUp = () => {
  const navigate = useNavigate();
  const [signUpData, setSignUpData] = useState();
  const [errors, setErrors] = useState("");

  const inputHandler = (e) => {
    setSignUpData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const goToLogin = () => navigate("/login");

  const handleSignUp = () => {
    axios
      .post(BASIC_DB_URL, signUpData)
      .then((res) => {
        if (res.data?.created) {
          navigate("/main");
          setErrors(null);
        } else {
          setErrors(" Something went wrong. Try again");
        }
        setErrors(null);
      })
      .catch((err) => setErrors(" Wrong email or password. Try again"));
  };

  return (
    <>
      <LoginWrapper>
        <Header>
          <span>FB GROUP@</span>
          <Button onClick={goToLogin} type="link">
            Login
          </Button>
        </Header>
        <Content>
          <LoginArea>
            <Box width="180px" m="10px auto">
              <Input
                name="email"
                placeholder="email"
                status={errors ? "error" : null}
                size="large"
                onChange={inputHandler}
              />
            </Box>
            <Box width="180px" m="10px auto">
              <Input.Password
                name="password"
                placeholder="password"
                size="large"
                status={errors ? "error" : null}
                onChange={inputHandler}
              />
              {errors && (
                <Typography.Text type="danger" style={{ fontSize: 10 }}>
                  {errors}
                </Typography.Text>
              )}
            </Box>
            <Box width="180px" m="0 auto">
              <Button
                onClick={handleSignUp}
                disabled={
                  !signUpData?.email.match(MAIL_REGEXP) || !signUpData?.password
                }
                block
              >
                Login
              </Button>
            </Box>
          </LoginArea>
        </Content>
      </LoginWrapper>
    </>
  );
};
