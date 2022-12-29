import React, { useState } from "react";

import { Button, message, Steps } from "antd";

import { ContentContainer, Box, ActionsContainer, Wrapper } from "./styles";
const steps = [
  {
    title: "First",
    content: "First-content",
  },
  {
    title: "Second",
    content: "Second-content",
  },
  {
    title: "Last",
    content: "Last-content",
  },
];
export const Integrations = () => {
  const [current, setCurrent] = useState(0);
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };

  const complete = () => {
    message.success("Processing complete!");
    setCurrent(0);
  };
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));
  return (
    <Box>
      <Steps current={current} items={items} />
      <Wrapper>
        <ContentContainer>{steps[current].content}</ContentContainer>
        <ActionsContainer>
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => next()}>
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" onClick={complete}>
              Done
            </Button>
          )}
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
        </ActionsContainer>
      </Wrapper>
    </Box>
  );
};
