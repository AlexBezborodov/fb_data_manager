import React from "react";

import { Typography } from "antd";

import { Box } from "../../global_styles/global_styles";
import {
  Wrapper,
  Container,
  ContentContainer,
} from "../menu_items/integrations/styles";

export const Plug = () => {
  return (
    <Container>
      <Wrapper>
        <ContentContainer>
          <Box style={{ display: "flex", alignItems: "center" }}>
            <Typography.Title
              style={{
                textAlign: "center",
              }}
              level={2}
            >
              This functionality will be available soon...
            </Typography.Title>
          </Box>
        </ContentContainer>
      </Wrapper>
    </Container>
  );
};
