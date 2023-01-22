import React, { useState, useEffect } from "react";

import { Button, Input, Typography } from "antd";
import axios from "axios";
import moment from "moment";
import { useNavigate } from "react-router";

import { Box } from "../../global_styles/global_styles";
import { useSendEmail } from "../../hooks/use_send_email";
import { getUserKey } from "../../utils/utils";
import { BASIC_DB_URL, MAIL_REGEXP } from "../../variables";
import { LoginWrapper, Header, LoginArea, Content } from "../login/style";

export const SignUp = () => {
  const [post] = useSendEmail();
  const navigate = useNavigate();

  const [signUpData, setSignUpData] = useState({});
  const [errors, setErrors] = useState();

  const inputHandler = (e) => {
    setSignUpData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const errorHandler = (err) => {
    setErrors((prev) => ({ ...prev, ...err }));
  };

  const goToLogin = () => navigate("/login");

  const handleSignUp = () => {
    const id = Math.floor(Math.random() * 1000000);
    const emailData = {
      id,
      email: signUpData?.email,
      name: signUpData?.userName,
      tempPasword: signUpData?.password,
    };
    const config = {
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    };

    const newUser = {
      [`user${id}`]: {
        id,
        email: signUpData?.email,
        name: signUpData?.userName,
        ipd: signUpData?.password,
        userPlan: "free",
        fbGroups: "",
        scrappedData: "",
        sentMessages: 0,
        planInfo: {
          registerData: moment(),
          userPlan: "free",
          scrapCounter: 0,
          expiredData: moment().add(1, "M"),
          sentMessages: 0,
          updatedData: moment(),
        },
      },
    };

    if (signUpData?.email.match(MAIL_REGEXP)) {
      setErrors(null);
      axios
        .get(
          `${BASIC_DB_URL}/users.json?orderBy="email"&equalTo="${signUpData?.email}"`
        )
        .then((res) => {
          if (getUserKey(res.data)) {
            errorHandler({ email: "Email already exist" });
          } else {
            axios
              .patch(`${BASIC_DB_URL}/users.json`, newUser, config)
              .then((res) => {
                if (res.status === 200) {
                  const key = getUserKey(res.data);
                  setErrors(null);
                  post(
                    emailData,
                    `Your login: ${emailData.email}, password: ${emailData.tempPasword}`
                  );
                  localStorage.setItem("currentUser", res.data[key].email);
                  localStorage.setItem("userId", res.data[key].id);
                  navigate("/main");
                  setSignUpData(null);
                } else {
                  errorHandler({
                    general: "Something went wrong.Try again later",
                  });
                }
              });
          }
        });
    } else {
      errorHandler({ email: "Email not valid" });
    }
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
                name="userName"
                placeholder="user name"
                status={errors ? "error" : null}
                size="large"
                value={signUpData?.userName || ""}
                onChange={inputHandler}
              />
            </Box>
            <Box width="280px" m="10px auto">
              <Input
                name="email"
                placeholder="email"
                status={errors ? "error" : null}
                size="large"
                value={signUpData?.email || ""}
                onChange={inputHandler}
              />
            </Box>
            <Box width="280px" m="10px auto">
              <Input.Password
                name="password"
                placeholder="password"
                size="large"
                status={errors ? "error" : null}
                value={signUpData?.password || ""}
                onChange={inputHandler}
              />
            </Box>
            <Box width="280px" m="0 auto">
              <Button
                onClick={handleSignUp}
                disabled={
                  !signUpData?.userName ||
                  !signUpData?.password ||
                  !signUpData?.email
                }
                size="large"
                block
              >
                Register
              </Button>
            </Box>
            <Box width="180px" m="10px auto" style={{ textAlign: "center" }}>
              {errors && !errors?.email && (
                <Typography.Text type="danger" style={{ fontSize: 10 }}>
                  {errors[getUserKey(errors)]}
                </Typography.Text>
              )}
              {errors?.email && (
                <Typography.Text type="danger" style={{ fontSize: 10 }}>
                  {errors[getUserKey(errors)]}
                </Typography.Text>
              )}
            </Box>
          </LoginArea>
        </Content>
      </LoginWrapper>
    </>
  );
};
