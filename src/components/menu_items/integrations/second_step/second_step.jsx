import React from "react";

import { Button, Input, Typography } from "antd";
import PropTypes from "prop-types";

import { Box } from "../../../login/style";
import { StepWrapper } from "../styles";

export const SecondStep = ({ data, inputHandler }) => {
  const { Paragraph } = Typography;
  return (
    <StepWrapper>
      <Box width="350px">
        <Paragraph>
          1. Open{" "}
          <a href="https://www.google.com" target="_blank" rel="noreferrer">
            googleSheet
          </a>
        </Paragraph>
        <Paragraph>2. Make a copy of your google sheet</Paragraph>
        <Paragraph>
          3. Change the settings of your google sheet to option edit by link
        </Paragraph>
        <Paragraph>4. Copy your google shit link and paste here</Paragraph>
      </Box>
      <Box width="350px" m="10px auto">
        <Input
          name="gsheetLink"
          placeholder="spread sheet link"
          size="large"
          value={data?.gsheetLink || ""}
          onChange={inputHandler}
        />
      </Box>
    </StepWrapper>
  );
};

SecondStep.propTypes = {
  data: PropTypes.object,
  inputHandler: PropTypes.func.isRequired,
};
