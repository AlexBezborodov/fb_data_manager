import React, { useContext, useEffect, useState } from "react";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Button, Typography, message } from "antd";
import axios from "axios";
import moment from "moment";
import PropTypes from "prop-types";

import { Box } from "../../global_styles/global_styles";
import { CurrentUserContext } from "../../providers/current_user";
import { BASIC_DB_URL, CONFIG, INITIAL_OPTIONS } from "../../variables";
import { PayPalButtonsWrapper } from "../paypal_buttons";
import { PlanCardInfo } from "./card";
import { ContentContainer, ActionsContainer } from "./styles";

export const UpdatePlan = ({ setModal = () => {} }) => {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const currentPlan = JSON.parse(localStorage.getItem("currentPlan"));
  const userId = localStorage.getItem("userId");

  const [choise, setChoise] = useState(currentPlan);
  const [plans, setPlans] = useState(null);

  const fetchPlans = () => {
    axios
      .get(`${BASIC_DB_URL}/plans.json`)
      .then((res) => {
        if (res.data) {
          const valuesToArray = (obj) => {
            return Object.keys(obj).map((key) => {
              return obj[key];
            });
          };
          setPlans(valuesToArray(res.data).sort((a, b) => a.id - b.id));
        }
      })
      .catch((err) => {});
  };

  const updatePlan = () => {
    currentUser.planInfo.userPlan = choise.name;
    currentUser.userPlan = choise.name;
    currentUser.planInfo.expiredData = moment().add(1, "M");
    currentUser.planInfo.updatedData = moment();
    currentUser.planInfo.scrapCounter = 0;
    currentUser.planInfo.sentMessages = 0;
    axios
      .patch(
        `${BASIC_DB_URL}/users/user${userId}.json`,
        { ...currentUser },
        CONFIG
      )
      .then((res) => {
        if (res.status === 200) {
          setCurrentUser(res.data);
          localStorage.setItem("currentPlan", JSON.stringify(choise));
          setModal(false);
          message.success("Plan changed");
        } else {
          message.error("Something went wrong. Try again later");
        }
      });
  };

  const successPayment = (payment) => {
    console.log("payment", payment);
    const prevPaymets = currentUser?.paymentHistory || [];
    const lastPayment = {
      update_time: payment.update_time,
      purchase_units: payment.purchase_units[0].amount,
      id: payment.id,
      name: `${payment.payer.name.given_name} ${payment.payer.name.surname}`,
    };
    currentUser.paymentHistory = [...prevPaymets, lastPayment];
    updatePlan();
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <ContentContainer>
      <Typography.Title
        level={2}
        style={{ textAlign: "center", paddingTop: "1.5rem" }}
      >
        Choose your plan
      </Typography.Title>
      <Box
        m="10px"
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          minHeight: 300,
        }}
      >
        {plans &&
          plans?.map((plan) => (
            <Box key={plan.name} m="10px">
              <PlanCardInfo
                plan={plan}
                setPlan={setChoise}
                activeId={choise?.id}
              />
            </Box>
          ))}
      </Box>

      <ActionsContainer>
        {choise.name === "free" ? (
          <Button
            type="primary"
            size="large"
            style={{ width: 450 }}
            onClick={updatePlan}
            disabled={!choise}
          >
            "Get free"
          </Button>
        ) : (
          <PayPalScriptProvider options={INITIAL_OPTIONS}>
            <PayPalButtonsWrapper
              currency={INITIAL_OPTIONS.currency}
              showSpinner={false}
              price={choise.price}
              style={{ layout: "horizontal" }}
              successPayment={successPayment}
            />
          </PayPalScriptProvider>
        )}
      </ActionsContainer>
    </ContentContainer>
  );
};

UpdatePlan.propTypes = {
  setModal: PropTypes.func,
};
