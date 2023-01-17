import styled from "styled-components";

export const Container = styled.div`
  padding: 1rem;
  margin: 2rem auto;
  border-radius: 1rem;
  border: 1px solid grey;
  display: flex;
  justify-content: center,
  align-items: center,
`;
export const ContentContainer = styled.div`
  background: lightgrey;
  border-radius: 1rem;
  margin: 1rem auto;
  max-width: 1000px;
  min-width: 250px;
  min-height: 300px;
`;

export const ActionsContainer = styled.div`
  margin: 0 1rem;
  display: flex;
  justify-content: center;
  padding: 1rem;
  min-height: 150px;
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
