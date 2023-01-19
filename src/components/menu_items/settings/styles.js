import styled from "styled-components";

export const Container = styled.div`
  margin: 0.5rem auto;
  border-radius: 1rem;
  border: 1px solid grey;
  max-width: 1004px;
`;
export const ContentContainer = styled.div`
  background: lightgrey;
  border-radius: 1rem;
  margin: 0.5rem;
  max-width: 600px;
  min-width: 250px;
`;

export const ActionsContainer = styled.div`
  margin: 0 1rem;
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
`;
export const Wrapper = styled.div`
  margin: 0 auto;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;
export const StepWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
`;
