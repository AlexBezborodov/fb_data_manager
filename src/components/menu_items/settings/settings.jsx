import React from "react";

import { Box } from "../../../global_styles/global_styles";
import { EmailBlock } from "./change_email";
import { PasswordBlock } from "./change_password/change_password";
import { CurrentPlanBlock } from "./current_plan/current_plan_block";
import { PaymentHistory } from "./payment_history";
import { Container, Wrapper } from "./styles";

export const Settings = () => {
  return (
    <Container>
      <Wrapper>
        <Box width="500px">
          <EmailBlock />
          <PasswordBlock />
        </Box>
        <Box width="500px">
          <CurrentPlanBlock />
          <PaymentHistory />
        </Box>
      </Wrapper>
    </Container>
  );
};
