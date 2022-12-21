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
  const [fbUser, setFbUser] = useState();
  const [gUser, setGUser] = useState();
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
        console.log("login", res);
        if (
          res.data[0]?.email === loginData.email &&
          res.data[0]?.password === loginData.password
        ) {
          navigate("/main");
          setErrors(null);
        } else {
          setErrors("Wrong email or password. Try again");
        }
      });
  };

  const onSuccess = async (resp) => {
    console.log("RESP", resp);
    axios
      .get(`${BASIC_DB_URL}/search?email=${resp.profileObj.email}`)
      .then((res) => {
        if (res.data.length > 0) {
          navigate("/main");
          setErrors(null);
        } else {
          axios
            .post(BASIC_DB_URL, {
              id: resp.profileObj?.googleId,
              email: resp.profileObj?.email,
              userData: resp?.profileObj,
            })
            .then((res) => {
              console.log("NEW USER resp", res);
              if (res.status === 201) {
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

  const createNewUser = (data) => {
    const newUser = {
      id: data.googleId || data.id,
      email: data.email,
      password: null,
      userData: data,
    };
    axios.post(BASIC_DB_URL, newUser);
  };

  useEffect(() => {
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
          <Button onClick={goToRegister} type="link">
            Sign Up
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
            </Box>
            <Box width="180px" m="0 auto">
              <Button
                onClick={handleLogin}
                disabled={
                  !loginData?.email.match(MAIL_REGEXP) || !loginData?.password
                }
                block
              >
                Login
              </Button>
            </Box>
            <Box width="180px" m="10px auto" br="16px" height="20px">
              <GoogleLogin
                clientId={CLIENTID}
                buttonText="Sign in with Google"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy="single_host_origin"
              />
            </Box>
            <Box width="180px" m="10px auto">
              <FacebookLogin
                appId="5843615565719699"
                autoLoad={true}
                fields="name,email,picture"
                callback={responseFacebook}
                size="small"
              />
            </Box>
            <Box>
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
