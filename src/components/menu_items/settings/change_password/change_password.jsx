import React, { useState, useContext } from "react";

import { Button, message } from "antd";
import { Input, Typography } from "antd";
import axios from "axios";

import { Box } from "../../../../global_styles/global_styles";
import { CurrentUserContext } from "../../../../providers/current_user";
import { BASIC_DB_URL, CONFIG } from "../../../../variables";
import { ContentContainer, ActionsContainer } from "../styles";

export const PasswordBlock = () => {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

  const [data, setdata] = useState({});

  const userId = localStorage.getItem("userId");
  const inputHandler = (e) => {
    setdata((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const updatePassword = () => {
    if (
      data?.password === data?.confirmPassword &&
      data?.currentPassword === currentUser.ipd
    ) {
      axios
        .patch(
          `${BASIC_DB_URL}/users/user${userId}.json`,
          { ...currentUser, ipd: data?.password },
          CONFIG
        )
        .then((res) => {
          if (res.status === 200) {
            setCurrentUser(res.data);
            message.success("Password successfully updated!");
            setdata(null);
          } else {
            message.error("Something went wrong. Try again later");
          }
        });
    } else {
      message.error(
        data?.password !== data?.confirmPassword
          ? "Passwords do not match"
          : "Incorrect current password"
      );
    }
  };

  return (
    <ContentContainer>
      <Typography.Title
        style={{
          textAlign: "center",
          background: "#1677ff",
          borderRadius: "1rem",
          padding: 10,
          color: "#fff",
        }}
        level={3}
      >
        Change Password
      </Typography.Title>

      <Box width="90%" m="10px auto">
        <Input.Password
          name="currentPassword"
          placeholder="Current password"
          size="large"
          value={data?.currentPassword || ""}
          onChange={inputHandler}
        />
      </Box>

      <Box width="90%" m="10px auto">
        <Input.Password
          name="password"
          placeholder="password"
          size="large"
          value={data?.password || ""}
          onChange={inputHandler}
        />
      </Box>
      <Box width="90%" m="10px auto">
        <Input.Password
          name="confirmPassword"
          placeholder="confirmPassword"
          size="large"
          value={data?.confirmPassword || ""}
          onChange={inputHandler}
        />
      </Box>
      <ActionsContainer>
        <Button
          type="primary"
          disabled={
            !data?.currentPassword || !data?.password || !data?.confirmPassword
          }
          onClick={updatePassword}
        >
          Save
        </Button>
      </ActionsContainer>
    </ContentContainer>
  );
};
