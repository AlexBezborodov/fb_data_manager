import React, { useState, useContext, useEffect } from "react";

import { Button, message } from "antd";
import { Input, Typography } from "antd";
import axios from "axios";

import { Box } from "../../../../global_styles/global_styles";
import { CurrentUserContext } from "../../../../providers/current_user";
import { getUserKey } from "../../../../utils/utils";
import { BASIC_DB_URL, MAIL_REGEXP, CONFIG } from "../../../../variables";
import { ContentContainer, ActionsContainer } from "../styles";

export const EmailBlock = () => {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const userId = localStorage.getItem("userId");

  const [data, setData] = useState({
    email: currentUser?.email,
    name: currentUser?.name,
  });
  const [isEdit, setIsEdit] = useState(false);

  const inputHandler = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const updateEmail = () => {
    if (data?.email.match(MAIL_REGEXP)) {
      axios
        .get(
          `${BASIC_DB_URL}/users.json?orderBy="email"&equalTo="${data?.email}"`
        )
        .then((res) => {
          const resultId = res.data[getUserKey(res.data)].id;
          if (resultId !== userId) {
            message.error("Email already used by another user");
          } else {
            axios
              .patch(
                `${BASIC_DB_URL}/users/user${userId}.json`,
                { ...currentUser, email: data?.email, name: data?.name },
                CONFIG
              )
              .then((res) => {
                if (res.status === 200) {
                  setCurrentUser(res.data);
                  message.success("Account details successfully updated!");
                  setIsEdit(false);
                } else {
                  message.error("Something went wrong. Try again later");
                }
              });
          }
        });
    } else {
      message.error("Email not valid");
    }
  };

  const cancelEditing = () => {
    setIsEdit(false);
    setData({
      email: currentUser?.email,
      name: currentUser?.name,
    });
  };
  useEffect(() => {
    setData({
      email: currentUser?.email,
      name: currentUser?.name,
    });
  }, [currentUser]);

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
        Account details
      </Typography.Title>

      <Box width="90%" m="20px auto 10px">
        {!isEdit && <Typography.Text>Email: {data?.email}</Typography.Text>}
        {isEdit && (
          <Input
            name="email"
            size="large"
            value={data?.email || ""}
            onChange={inputHandler}
          />
        )}
      </Box>
      <Box width="90%" m="20px auto 10px">
        {!isEdit && <Typography.Text>Name: {data?.name}</Typography.Text>}
        {isEdit && (
          <Input
            name="name"
            size="large"
            value={data?.name || ""}
            onChange={inputHandler}
          />
        )}
      </Box>
      <ActionsContainer>
        {isEdit && (
          <Button
            style={{ margin: "0 10px" }}
            type="primary"
            disabled={!data?.email}
            onClick={() => cancelEditing()}
            danger
          >
            Cancel
          </Button>
        )}
        <Button
          type="primary"
          disabled={!data?.email}
          onClick={() => (isEdit ? updateEmail() : setIsEdit(true))}
        >
          {isEdit ? "Save" : " Edit"}
        </Button>
      </ActionsContainer>
    </ContentContainer>
  );
};
