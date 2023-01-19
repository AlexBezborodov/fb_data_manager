import React, { useState, useContext, useEffect } from "react";

import { Button, message, Steps, Typography } from "antd";
import axios from "axios";

import { CurrentUserContext } from "../../../providers/current_user";
import { BASIC_DB_URL, CONFIG } from "../../../variables";
import { FirstStep } from "./first_step";
import { SecondStep } from "./second_step";
import {
  ContentContainer,
  Container,
  ActionsContainer,
  Wrapper,
} from "./styles";
import { ThirdStep } from "./third_step/third_step";

export const Integrations = () => {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

  const [current, setCurrent] = useState(0);
  const [data, setdata] = useState();
  const [isShow, setIsShow] = useState(true);

  const inputHandler = (e) => {
    setdata((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const steps = [
    {
      title: "Add FB group",
      content: <FirstStep {...{ data, inputHandler }} />,
    },
    {
      title: "Add your google sheet",
      content: <SecondStep {...{ data, inputHandler }} />,
    },
    {
      title: "Finish",
      content: <ThirdStep {...{ data }} />,
    },
  ];

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
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
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
        if (res.status === 200) {
          setCurrentUser(res.data);
          message.success("Integration successfully completed!");
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
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  useEffect(() => {
    const groupsLimit = JSON.parse(
      localStorage.getItem("currentPlan")
    )?.groupsAmount;
    if (groupsLimit && currentUser?.fbGroups?.length >= groupsLimit) {
      setIsShow(false);
    }
  }, [currentUser]);
  return (
    <Container>
      {isShow ? (
        <>
          <Steps current={current} items={items} />
          <Wrapper>
            <ContentContainer>{steps[current].content}</ContentContainer>
            <ActionsContainer>
              {current > 0 && (
                <Button
                  style={{
                    margin: "0 8px",
                  }}
                  onClick={() => prev()}
                >
                  Previous
                </Button>
              )}
              {current < steps.length - 1 && (
                <Button
                  type="primary"
                  onClick={() => next()}
                  disabled={checkDisabled()}
                >
                  Next
                </Button>
              )}
              {current === steps.length - 1 && (
                <Button type="primary" onClick={complete}>
                  Done
                </Button>
              )}
            </ActionsContainer>
          </Wrapper>
        </>
      ) : (
        <Wrapper>
          <Typography.Title level={4}>
            You already added max count of groups for your plan
          </Typography.Title>
        </Wrapper>
      )}
    </Container>
  );
};
