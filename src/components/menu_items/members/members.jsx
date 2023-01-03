import React from "react";

import { Container, Wrapper, ContentContainer } from "./styles";
import { Table } from "./table";

export const Members = () => {
  return (
    <Container>
      <Wrapper>
        <ContentContainer>
          <Table />
        </ContentContainer>
      </Wrapper>
    </Container>
  );
};
