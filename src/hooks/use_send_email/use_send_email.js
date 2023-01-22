import React, { useCallback } from "react";

import axios from "axios";

import { registerData } from "../../emailkey";

export const useSendEmail = () => {
  const post = useCallback((data, message = "") => {
    const regData = registerData;
    if (message) {
      regData.template_params = {
        ...registerData.template_params,
        user_name: data.name,
        message,
        new_user: data.email,
      };
    } else {
      regData.template_params = {
        ...registerData.template_params,
        user_name: data.name,
        message,
        message_line1: `Thank you for registration in our service.`,
        message_line2: `Login: ${data.email}`,
        message_line3: `Temporary Password: ${data.tempPasword}`,
        message_line4: `We recommend change temporary password after first login in settings.`,
        new_user: data.email,
      };
    }

    axios
      .post(`https://api.emailjs.com/api/v1.0/email/send`, registerData)
      .then((res) => {
        if (res.status === 200) {
          console.log(`message sent`);
        }
      });
  }, []);
  return [post];
};
