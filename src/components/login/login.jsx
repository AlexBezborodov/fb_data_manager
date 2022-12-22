import React, { useState, useEffect } from "react";

import { Button, Input, Typography } from "antd";
import axios from "axios";
import { gapi } from "gapi-script";
import FacebookLogin from "react-facebook-login";
import { GoogleLogin } from "react-google-login";
import { useNavigate } from "react-router";

import { BASIC_DB_URL, CLIENTID, MAIL_REGEXP } from "../../variables";
import { LoginWrapper, Box, Header, LoginArea, Content } from "./style";

export const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLogindata] = useState();
  const [errors, setErrors] = useState("");

  const inputHandler = (e) => {
    setLogindata((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const goToRegister = () => navigate("/sign-up");

  const handleLogin = () => {
    axios
      .get(
        `${BASIC_DB_URL}/search?email=${loginData?.email}&password=${loginData?.password}`
      )
      .then((res) => {
        if (
          res.data[0]?.email === loginData.email &&
          res.data[0]?.password === loginData.password
        ) {
          navigate("/main");
          setErrors(null);
          localStorage.setItem("currentUser", loginData.email);
        } else {
          setErrors("Wrong email or password. Try again");
        }
      });
  };

  const onSuccess = async (resp) => {
    axios
      .get(`${BASIC_DB_URL}/search?email=${resp.profileObj.email}`)
      .then((res) => {
        if (res.data.length > 0) {
          navigate("/main");
          setErrors(null);
          localStorage.setItem("currentUser", resp.profileObj.email);
        } else {
          axios
            .post(BASIC_DB_URL, {
              id: resp.profileObj?.googleId,
              email: resp.profileObj?.email,
              userData: resp?.profileObj,
            })
            .then((res) => {
              if (res.status === 201) {
                localStorage.setItem("currentUser", resp.profileObj.email);
                navigate("/main");
                setErrors(null);
              } else {
                setErrors("Can`t login with google.Try again later");
              }
            });
        }
      });
  };

  const onFailure = (err) => {
    setErrors("Can`t login with google.Try again later");
  };

  const responseFacebook = (response) => {
    console.log(response);
  };
  useEffect(() => {
    const isLogged = localStorage.getItem("currentUser");
    isLogged && navigate("/main/integrations");
    const initClient = () => {
      gapi.client.init({
        clientId: CLIENTID,
        scope: "",
      });
    };
    gapi.load("client:auth2", initClient);
  });

  return (
    <>
      <LoginWrapper>
        <Header>
          <span>FB GROUP@</span>
          <Button onClick={goToRegister} type="primary">
            Sign Up
          </Button>
        </Header>
        <Content>
          <LoginArea>
            <Typography.Title style={{ color: "#fff" }}>Login</Typography.Title>
            <Box width="280px" m="10px auto">
              <Input
                name="email"
                placeholder="email"
                size="large"
                onChange={inputHandler}
              />
            </Box>
            <Box width="280px" m="10px auto">
              <Input.Password
                name="password"
                placeholder="password"
                size="large"
                onChange={inputHandler}
              />
            </Box>
            <Box width="280px" m="0 auto">
              <Button
                onClick={handleLogin}
                disabled={
                  !loginData?.email.match(MAIL_REGEXP) || !loginData?.password
                }
                type="primary"
                size="large"
                block
              >
                Login
              </Button>
            </Box>
            <Box width="190px" m="10px auto" br="16px">
              <GoogleLogin
                clientId={CLIENTID}
                buttonText="Sign in with Google"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy="single_host_origin"
              />
            </Box>
            <Box width="190px" m="10px auto">
              <FacebookLogin
                appId="5843615565719699"
                autoLoad={true}
                fields="name,email,picture"
                callback={responseFacebook}
                size="small"
              />
            </Box>
            <Box width="280px" m="10px auto">
              {errors && (
                <Typography.Text type="danger" style={{ fontSize: 14 }}>
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
