import React, { useState, useContext } from "react";

import { Button, message } from "antd";
import { Input, Typography, Checkbox } from "antd";
import axios from "axios";

import { Box } from "../../../global_styles/global_styles";
import { CurrentUserContext } from "../../../providers/current_user";
import { BASIC_DB_URL, CONFIG, GROUPS } from "../../../variables";
import { BasicSelect } from "../../basic_components";
import {
  ContentContainer,
  Container,
  ActionsContainer,
  Wrapper,
} from "../integrations/styles";

export const WelcomeMessage = () => {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

  const [current, setCurrent] = useState(0);
  const [data, setdata] = useState();
  const [activeMainFilter, setActiveMainFilter] = useState(GROUPS[0].value);

  const inputHandler = (e) => {
    setdata((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const onChange = (e) => {
    setdata((prev) => ({ ...prev, isSendMessages: e.target.checked }));
  };

  const groupsSelectProps = {
    size: "large",
    options: GROUPS,
    setValue: setActiveMainFilter,
    styles: { width: "100%" },
  };

  const checkDisabled = () => {
    switch (current) {
      case 0:
        return !data?.fbName || !data?.fbLink;
      case 1:
        return !data?.gsheetLink;
      default:
        return false;
    }
  };

  const saveIntegration = () => {
    const userId = localStorage.getItem("userId");
    const group = {
      id: Math.floor(Math.random() * 1000000),
      groupName: data.fbName,
      groupLink: data.fbLink,
      groupId: data.fbLink.replace(/\D/g, ""),
      spreadsheetLink: data.gsheetLink,
    };
    const updatedData = currentUser?.fbGroups
      ? [...currentUser.fbGroups, group]
      : [group];

    axios
      .patch(
        `${BASIC_DB_URL}/users/user${userId}.json`,
        { ...currentUser, fbGroups: updatedData },
        CONFIG
      )
      .then((res) => {
        console.log("res", res);
        if (res.status === 200) {
          setCurrentUser(res.data);
          message.success("Integration succefully completed!");
          setCurrent(0);
          setdata(null);
        } else {
          message.error("Something went wrong. Try again later");
        }
      });
  };
  const complete = () => {
    saveIntegration();
  };

  return (
    <Container>
      <Wrapper>
        <BasicSelect {...groupsSelectProps} />
        <ContentContainer>
          <Typography.Title style={{ textAlign: "center" }} level={3}>
            Welcome message FaceBook Messanger
          </Typography.Title>

          <Box width="70%" m="0 auto">
            <Input.TextArea
              rows={6}
              name="wMessage"
              placeholder="Here is your message"
              size="large"
              value={data?.wMessage || ""}
              onChange={inputHandler}
            />
          </Box>
          <Box width="70%" m="20px auto">
            <Checkbox
              name="avatar"
              checked={data?.isSendMessages || false}
              onChange={onChange}
            >
              Send Welcome message
            </Checkbox>
          </Box>
          <Box width="85%" m="70px auto 0">
            <Typography.Text>
              * use [name] to send personal message
            </Typography.Text>
          </Box>
        </ContentContainer>
        <ActionsContainer>
          <Button type="primary" disabled={!data?.wMessage} onClick={complete}>
            Save
          </Button>
        </ActionsContainer>
      </Wrapper>
    </Container>
  );
};
