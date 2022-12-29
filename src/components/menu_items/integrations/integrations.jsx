import React, { useState } from "react";

import { Button, message, Steps } from "antd";

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
  const [current, setCurrent] = useState(0);
  const [data, setdata] = useState();

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

  const complete = () => {
    message.success("Integration succefully completed!");
    setCurrent(0);
    setdata(null);
  };
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));
  return (
    <Container>
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
    </Container>
  );
};
