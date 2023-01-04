import React from "react";

import { Typography } from "antd";
import PropTypes from "prop-types";

import { Box } from "../../../../global_styles/global_styles";
import { StepWrapper } from "../styles";

export const ThirdStep = ({ data }) => {
  const { Paragraph } = Typography;
  return (
    <StepWrapper>
      <Box width="300px" style={{ textAlign: "center" }}>
        <Typography.Title level={2}>Congratulations</Typography.Title>
        <Paragraph>
          You almost finished <b>{data?.fbName}</b> to your groups list. Click
          "Done" to finish final step.
        </Paragraph>
      </Box>
    </StepWrapper>
  );
};

ThirdStep.propTypes = {
  data: PropTypes.object,
};
