import React from "react";

import { EmailBlock } from "./change_email";
import { PasswordBlock } from "./change_password/change_password";
import { CurrentPlanBlock } from "./current_plan/current_plan_block";
import { Container, Wrapper } from "./styles";

export const Settings = () => {
  return (
    <Container>
      <Wrapper>
        <EmailBlock />
        <PasswordBlock />
        <CurrentPlanBlock />
      </Wrapper>
    </Container>
  );
};
