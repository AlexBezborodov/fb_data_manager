import React, { useState, useContext, useEffect } from "react";

import { Button, message } from "antd";
import { List, Typography } from "antd";
import axios from "axios";
import moment from "moment";

import { Box } from "../../../../global_styles/global_styles";
import { CurrentUserContext } from "../../../../providers/current_user";
import { getUserKey } from "../../../../utils/utils";
import { BASIC_DB_URL, MAIL_REGEXP, CONFIG } from "../../../../variables";
import { ContentContainer, ActionsContainer } from "../styles";

export const CurrentPlanBlock = () => {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const userId = localStorage.getItem("userId");

  const updateEmail = () => {};

  useEffect(() => {}, [currentUser]);

  return (
    <ContentContainer>
      <Typography.Title
        style={{
          textAlign: "center",
          background: "#1677ff",
          borderRadius: "1rem",
          padding: 10,
          color: "#fff",
        }}
        level={3}
      >
        Account details
      </Typography.Title>

      <Box width="90%" m="20px auto 10px">
        <List size="small">
          <List.Item>
            <List.Item.Meta title="Renewal date" />
            <div>
              {moment(currentUser?.renewalDate).format("DD/MM/YYYY HH:mm") ||
                "-"}
            </div>
          </List.Item>
          <List.Item>
            <List.Item.Meta title="Expires date" />
            <div>
              {moment(currentUser?.renewalDate).format("DD/MM/YYYY HH:mm") ||
                "-"}
            </div>
          </List.Item>
          <List.Item>
            <List.Item.Meta title="Payment method" />
            <div>paypal</div>
          </List.Item>
        </List>
      </Box>

      <ActionsContainer>
        <Button type="primary" onClick={() => {}}>
          Update plan
        </Button>
      </ActionsContainer>
    </ContentContainer>
  );
};
