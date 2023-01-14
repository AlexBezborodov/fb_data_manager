import React, { useContext, useState } from "react";

import { Button } from "antd";
import { List, Typography } from "antd";
import moment from "moment";

import { Box } from "../../../../global_styles/global_styles";
import { CurrentUserContext } from "../../../../providers/current_user";
import { BasicModal } from "../../../basic_components";
import { UpdatePlan } from "../../../update_plan";
import { ContentContainer, ActionsContainer } from "../styles";

export const CurrentPlanBlock = () => {
  const { currentUser } = useContext(CurrentUserContext);

  const [modalOpen, setModalOpen] = useState(false);

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
          Account details
        </Typography.Title>

        <Box width="90%" m="20px auto 10px">
          <List size="small">
            <List.Item>
              <List.Item.Meta title="Current plan" />
              <div>{currentUser?.planInfo?.userPlan}</div>
            </List.Item>
            <List.Item>
              <List.Item.Meta title="Renewal date" />
              <div>
                {moment(currentUser?.planInfo?.updatedData).format(
                  "DD/MM/YYYY HH:mm"
                ) || "-"}
              </div>
            </List.Item>
            <List.Item>
              <List.Item.Meta title="Expires date" />
              <div>
                {moment(currentUser?.planInfo?.expiredData).format(
                  "DD/MM/YYYY HH:mm"
                ) || "-"}
              </div>
            </List.Item>
            <List.Item>
              <List.Item.Meta title="Payment method" />
              <div>paypal</div>
            </List.Item>
          </List>
        </Box>

        <ActionsContainer>
          <Button type="primary" onClick={() => setModalOpen(true)}>
            Update plan
          </Button>
        </ActionsContainer>
      </ContentContainer>
      <BasicModal
        open={modalOpen}
        closeModal={() => setModalOpen(false)}
        title="Update current plan"
        width={1100}
      >
        <UpdatePlan setModal={setModalOpen} />
      </BasicModal>
    </>
  );
};
