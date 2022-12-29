import styled from "styled-components";

export const Container = styled.div`
  padding: 1rem;
  margin: 2rem auto;
  max-width: 650px;
  border-radius: 1rem;
  border: 1px solid grey;
`;
export const ContentContainer = styled.div`
  height: 400px;
  background: lightgrey;
  border-radius: 1rem;
  margin: 1rem;
  padding: 1rem;
`;

export const ActionsContainer = styled.div`
  margin: 0 1rem;
  display: flex;
  justify-content: flex-end;
`;
export const Wrapper = styled.div`
  margin: 0 auto;
  width: 95%;
  overflow-y: auto;
`;
export const StepWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
`;
