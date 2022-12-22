import React, { useState, useEffect } from "react";

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
    const newUser = {
      id: new Date().getTime(),
      ...signUpData,
    };

    axios
      .get(`${BASIC_DB_URL}/search?email=${signUpData.email}`)
      .then((res) => {
        if (res.data.length > 0) {
          setErrors("Email already exist");
        } else {
          axios.post(BASIC_DB_URL, newUser).then((res) => {
            if (res.status === 201) {
              localStorage.setItem("currentUser", signUpData?.email);
              navigate("/main/");
              setErrors(null);
              setSignUpData(null);
            } else {
              setErrors("Something went wrong.Try again later");
            }
          });
        }
      });
  };

  useEffect(() => {
    const isLogged = localStorage.getItem("currentUser");
    isLogged && navigate("/main/integrations");
  }, []);

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
            <Typography.Title style={{ color: "#fff" }}>
              Sign Up
            </Typography.Title>
            <Box width="280px" m="10px auto">
              <Input
                name="email"
                placeholder="email"
                status={errors ? "error" : null}
                size="large"
                onChange={inputHandler}
              />
            </Box>
            <Box width="280px" m="10px auto">
              <Input.Password
                name="password"
                placeholder="password"
                size="large"
                status={errors ? "error" : null}
                onChange={inputHandler}
              />
            </Box>
            <Box width="280px" m="0 auto">
              <Button
                onClick={handleSignUp}
                disabled={
                  !signUpData?.email.match(MAIL_REGEXP) || !signUpData?.password
                }
                size="large"
                block
              >
                Login
              </Button>
            </Box>
            <Box width="180px" m="10px auto" style={{ textAlign: "center" }}>
              {errors && (
                <Typography.Text type="danger" style={{ fontSize: 10 }}>
                  {errors}
                </Typography.Text>
              )}
            </Box>
          </LoginArea>
        </Content>
      </LoginWrapper>
    </>
  );
};
