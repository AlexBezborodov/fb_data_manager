import React, { useCallback } from "react";

export const useInputHandler = (update, payload = {}) => {
  const inputHandler = useCallback(
    ({ name, value }) => {
      update({ [name]: value, ...payload });
    },
    [update]
  );
};

export const useStateInputHandler = (update, e) => {
  const inputHandler = (e) => {
    update((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
};
