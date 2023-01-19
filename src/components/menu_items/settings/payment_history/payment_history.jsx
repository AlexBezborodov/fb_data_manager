import React, { useContext, useState } from "react";

import { TransactionOutlined } from "@ant-design/icons";
import { List, Typography } from "antd";
import moment from "moment";

import { Box } from "../../../../global_styles/global_styles";
import { CurrentUserContext } from "../../../../providers/current_user";
import { ContentContainer } from "../styles";

export const PaymentHistory = () => {
  const { currentUser } = useContext(CurrentUserContext);
  const { paymentHistory } = currentUser;
  return (
    <>
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
          Payment History
        </Typography.Title>

        <Box
          width="90%"
          m="20px auto 10px"
          style={{ overflowY: "auto", maxHeight: 200 }}
        >
          <List size="small">
            {paymentHistory?.length &&
              paymentHistory.reverse().map((item) => (
                <List.Item key={item.id}>
                  <List.Item.Meta
                    title={`Payer: ${item.name}`}
                    description={`Transaction id: ${item.id}`}
                  />
                  <div>
                    <Typography.Text strong>
                      {item.purchase_units.value}
                      {item.purchase_units.currency_code}
                    </Typography.Text>

                    <div>
                      {moment(item.update_time).format("DD/MM/YYYY HH:mm")}
                    </div>
                  </div>
                </List.Item>
              ))}
            {!paymentHistory?.length && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: 200,
                }}
              >
                <TransactionOutlined
                  style={{ fontSize: "36px", color: "#08c" }}
                />
                <Typography.Text
                  style={{ fontSize: "28px", color: "#08c" }}
                  strong
                >
                  Payment history empty
                </Typography.Text>
              </div>
            )}
          </List>
        </Box>
      </ContentContainer>
    </>
  );
};
