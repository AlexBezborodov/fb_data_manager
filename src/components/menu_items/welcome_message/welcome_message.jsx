import React, { useState, useContext, useEffect } from "react";

import { Button, message } from "antd";
import { Input, Typography, Checkbox } from "antd";
import axios from "axios";

import { Box } from "../../../global_styles/global_styles";
import { CurrentUserContext } from "../../../providers/current_user";
import { BASIC_DB_URL, GROUPS, CONFIG } from "../../../variables";
import { BasicSelect } from "../../basic_components";
import {
  ContentContainer,
  Container,
  ActionsContainer,
  Wrapper,
} from "../integrations/styles";

export const WelcomeMessage = () => {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

  const [data, setdata] = useState();
  const [activeGroup, setActiveGroup] = useState(GROUPS[0].value);

  const inputHandler = (e) => {
    setdata((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const onChange = (e) => {
    setdata((prev) => ({ ...prev, isSendMessages: e.target.checked }));
  };

  const modifyGroups = () => {
    if (currentUser?.fbGroups) {
      return [
        ...GROUPS,
        ...currentUser.fbGroups.map((group) => ({
          value: group.groupId,
          label: group.groupName,
        })),
      ];
    } else {
      return GROUPS;
    }
  };

  const groupsSelectProps = {
    size: "large",
    options: modifyGroups(),
    setValue: setActiveGroup,
    styles: { width: "100%" },
  };

  const updateMessage = () => {
    const userId = localStorage.getItem("userId");
    let updatedData = null;
    if (activeGroup == "all") {
      updatedData = currentUser?.fbGroups.map((group) => {
        return { ...group, welcomeMessage: data.wMessage };
      });
    } else {
      updatedData = currentUser?.fbGroups.map((group) => {
        if (group.groupId === activeGroup) {
          return { ...group, welcomeMessage: data.wMessage };
        } else {
          return group;
        }
      });
    }
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
          message.success("Message succefully updated!");
          setdata(null);
        } else {
          message.error("Something went wrong. Try again later");
        }
      });
  };

  const setMessage = () => {
    if (activeGroup == "all") {
      setdata((prev) => ({
        ...prev,
        wMessage: "default welcome message for all groups",
      }));
    } else {
      const msg = currentUser?.fbGroups?.filter(
        (group) => group.groupId === activeGroup
      );
      console.log("msg", msg);
      setdata((prev) => ({ ...prev, wMessage: msg[0].welcomeMessage }));
    }
  };

  useEffect(() => {
    setMessage();
  }, [activeGroup]);

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
          <Button
            type="primary"
            disabled={!data?.wMessage || ""}
            onClick={updateMessage}
          >
            Save
          </Button>
        </ActionsContainer>
      </Wrapper>
    </Container>
  );
};
