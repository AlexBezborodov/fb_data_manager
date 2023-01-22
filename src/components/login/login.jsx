import React, { useState, useEffect } from "react";

import { Button, Input, Typography, Modal } from "antd";
import axios from "axios";
import { gapi } from "gapi-script";
import moment from "moment";
import FacebookLogin from "react-facebook-login";
import { GoogleLogin } from "react-google-login";
import { useNavigate } from "react-router";

import { Box } from "../../global_styles/global_styles";
import { useSendEmail } from "../../hooks/use_send_email";
import { getUserKey } from "../../utils/utils";
import { BASIC_DB_URL, CLIENTID, MAIL_REGEXP, CONFIG } from "../../variables";
import { LoginWrapper, Header, LoginArea, Content } from "./style";

export const Login = () => {
  const [post] = useSendEmail();
  const navigate = useNavigate();
  const [loginData, setLogindata] = useState();
  const [fbUser, setFbUser] = useState();
  const [errors, setErrors] = useState("");
  const [tempPasword] = useState(`user${Math.floor(Math.random() * 1000)}`);
  const [loginKeys, setLoginKeys] = useState();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
    navigate("/main");
    localStorage.setItem("currentUser", loginKeys.email);
    localStorage.setItem("userId", loginKeys.id);
  };

  const inputHandler = (e) => {
    setLogindata((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const goToRegister = () => navigate("/sign-up");

  const checkUser = (user, currentEmail, oauth = false) => {
    if (oauth) {
      const key = getUserKey(user);
      return !!(user[key]?.email === currentEmail);
    } else {
      if (getUserKey(user)) {
        const key = getUserKey(user);
        if (
          user[key].email === loginData.email &&
          user[key].ipd === loginData.password
        ) {
          setErrors(null);
          localStorage.setItem("currentUser", loginData.email);
          localStorage.setItem("userId", user[key].id);
          navigate("/main");
          setLogindata(null);
          return true;
        } else {
          setErrors("Wrong email or password. Try again");
          return false;
        }
      } else {
        setErrors("User not registered");
        return false;
      }
    }
  };

  const handleLogin = () => {
    axios
      .get(
        `${BASIC_DB_URL}/users.json?orderBy="email"&equalTo="${loginData.email}"`
      )
      .then((res) => {
        checkUser(res.data, loginData.email);
      });
  };

  const oauthLogin = async (respData) => {
    const { id, email, name } = respData;
    const emailData = {
      id,
      email,
      name,
      tempPasword,
    };
    const newUser = {
      [`user${id}`]: {
        id,
        email,
        name,
        ipd: tempPasword,
        userPlan: "free",
        scrappedData: "",
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
    await axios
      .get(`${BASIC_DB_URL}/users.json?orderBy="email"&equalTo="${email}"`)
      .then((res) => {
        const key = getUserKey(res.data);
        if (checkUser(res.data, email, true)) {
          setErrors(null);
          localStorage.setItem("currentUser", res.data[key].email);
          localStorage.setItem("userId", res.data[key].id);
          navigate("/main");
        } else {
          axios
            .patch(`${BASIC_DB_URL}/users.json`, newUser, CONFIG)
            .then((res) => {
              if (res.status === 200) {
                const key = getUserKey(res.data);
                setErrors(null);
                setLoginKeys({
                  email: res.data[key].email,
                  id: res.data[key].id,
                });
                showModal();
                post(emailData);
              } else {
                setErrors("Can`t login with google.Try again later");
              }
            });
        }
      });
  };

  const onSuccess = async (resp) => {
    const respData = {
      id: resp.profileObj?.googleId,
      email: resp.profileObj?.email,
      name: resp?.profileObj.name,
    };
    oauthLogin(respData);
  };

  const onFailure = (err) => {
    setErrors("Can`t login with google.Try again later");
  };

  const responseFacebook = (response) => {
    const respData = {
      id: response.id,
      email: response.email,
      name: response.name,
    };
    setFbUser(respData);
  };

  const fbLogin = () => {
    oauthLogin(fbUser);
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
                onClick={fbLogin}
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
      <Modal
        title="Temporary Password"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleOk}
      >
        <p>
          Your temporary password <bold>{tempPasword}</bold>
        </p>
        <span>Please change password after login in profile setting</span>
      </Modal>
    </>
  );
};
