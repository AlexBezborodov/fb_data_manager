import React from "react";

import { Button, Input, Typography } from "antd";
import PropTypes from "prop-types";

import { Box } from "../../../login/style";
import { StepWrapper } from "../styles";

export const FirstStep = ({ data, inputHandler }) => {
  return (
    <StepWrapper>
      <Box width="350px">
        <Typography.Title level={4}>Name FB group</Typography.Title>
        <Input
          name="fbName"
          placeholder="Name FB group"
          size="large"
          value={data?.fbName || ""}
          onChange={inputHandler}
        />
      </Box>
      <Box width="350px">
        <Typography.Title level={4}>link to FB group</Typography.Title>
        <Input
          name="fbLink"
          placeholder="link to FB group"
          size="large"
          value={data?.fbLink || ""}
          onChange={inputHandler}
        />
      </Box>
    </StepWrapper>
  );
};

FirstStep.propTypes = {
  data: PropTypes.object,
  inputHandler: PropTypes.func.isRequired,
};
