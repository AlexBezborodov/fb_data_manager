import React from "react";

import { Card, Typography, Tag, List } from "antd";
import PropTypes from "prop-types";

export const PlanCardInfo = ({ plan, setPlan = () => {}, activeId }) => {
  return (
    <div
      style={{
        transform: `scale(${activeId === plan.id ? 1.1 : 1})`,
        transition: "0.5s ease-in",
      }}
      onClick={() => setPlan(plan)}
    >
      <Card
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {plan.name?.toUpperCase()}{" "}
            <Tag
              style={{
                fontSize: 28,
                padding: 5,
                width: 80,
                textAlign: "center",
                margin: "0 5px",
              }}
              color="#2db7f5"
            >
              {plan.price}$
            </Tag>
          </div>
        }
        bordered={false}
        style={{
          width: 220,
          height: 300,
          background: activeId === plan.id ? "gold" : "#fff",
          transition: "0.5s ease-in",
        }}
      >
        <Typography.Title level={3} style={{ textAlign: "center" }} strong>
          {" "}
          Details
        </Typography.Title>
        <List>
          <List.Item>
            <List.Item.Meta title="Scrapped users:" />
            <div style={{ marginBottom: "-14px" }}>
              <span>{plan.usersAmount}</span>
            </div>
          </List.Item>
          <List.Item>
            <List.Item.Meta title="Added fb groups" />
            <div style={{ marginBottom: "-14px" }}>
              <span>{plan.groupsAmount}</span>
            </div>
          </List.Item>
          <List.Item>
            <List.Item.Meta title="Welcome messages:" />
            <div style={{ marginBottom: "-14px" }}>
              <span>{plan.wMessages}</span>
            </div>
          </List.Item>
        </List>
      </Card>
    </div>
  );
};

PlanCardInfo.propTypes = {
  plan: PropTypes.object,
  setPlan: PropTypes.func.isRequired,
  activeId: PropTypes.number,
};
