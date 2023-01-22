import React, { useState, useContext } from "react";

import { Button, message } from "antd";
import { Input, Typography } from "antd";
import axios from "axios";

import { Box } from "../../../global_styles/global_styles";
import { CurrentUserContext } from "../../../providers/current_user";
import { BASIC_DB_URL, CONFIG } from "../../../variables";
import {
  ContentContainer,
  Container,
  ActionsContainer,
  Wrapper,
} from "../integrations/styles";

export const Emails = () => {
  const variable = `{{message}}`;
  const { Paragraph } = Typography;
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

  const [data, setdata] = useState(currentUser?.emailSettings || {});

  const inputHandler = (e) => {
    setdata((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const updateMessage = () => {
    const userId = localStorage.getItem("userId");
    let updatedData = null;
    updatedData = {
      serviceId: data?.serviceId,
      templateId: data?.templateId,
      publicKey: data?.publicKey,
    };

    axios
      .patch(
        `${BASIC_DB_URL}/users/user${userId}.json`,
        { ...currentUser, emailSettings: updatedData },
        CONFIG
      )
      .then((res) => {
        if (res.status === 200) {
          setCurrentUser(res.data);
          message.success("Message successfully updated!");
          setdata(null);
        } else {
          message.error("Something went wrong. Try again later");
        }
      });
  };

  return (
    <Container>
      <Wrapper>
        <ContentContainer>
          <Typography.Title style={{ textAlign: "center" }} level={3}>
            Welcome to Email service settings
          </Typography.Title>
          <Box width="70%" m="10px auto">
            <Paragraph>
              1. Visit service{" "}
              <a
                href="https://www.emailjs.com"
                target="_blank"
                rel="noreferrer"
              >
                EmailJS
              </a>{" "}
              and create account
            </Paragraph>
            <Paragraph>
              2. Create a{" "}
              <a
                href="https://www.emailjs.com/docs/tutorial/creating-email-template/"
                target="_blank"
                rel="noreferrer"
              >
                template
              </a>
              , using variable {variable}
            </Paragraph>
            <Paragraph>3. Add information from EmailJS to inputs</Paragraph>
          </Box>

          <Box width="70%" m="10px auto">
            <Input
              name="serviceId"
              placeholder="service Id"
              size="large"
              value={data?.serviceId || ""}
              onChange={inputHandler}
            />
          </Box>
          <Box width="70%" m="10px auto">
            <Input
              name="templateId"
              placeholder="template Id"
              size="large"
              value={data?.templateId || ""}
              onChange={inputHandler}
            />
          </Box>
          <Box width="70%" m="10px auto">
            <Input
              name="publicKey"
              placeholder="user Id (public key)"
              size="large"
              value={data?.publicKey || ""}
              onChange={inputHandler}
            />
          </Box>
        </ContentContainer>
        <ActionsContainer>
          <Button
            type="primary"
            disabled={!data?.serviceId || !data?.templateId || !data?.publicKey}
            onClick={updateMessage}
          >
            Save
          </Button>
        </ActionsContainer>
      </Wrapper>
    </Container>
  );
};
