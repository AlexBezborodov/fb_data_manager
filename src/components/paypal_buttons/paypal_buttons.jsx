import React, { useEffect } from "react";

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import PropTypes from "prop-types";

const style = { layout: "vertical" };

export const PayPalButtonsWrapper = ({
  currency = "USD",
  showSpinner = false,
  price = 0,
  successPayment,
}) => {
  const [{ options, isPending }, dispatch] = usePayPalScriptReducer();
  console.log("price", price);

  const onCreateOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: price,
          },
        },
      ],
    });
  };

  const onApproveOrder = (data, actions) => {
    return actions.order.capture().then((details) => {
      if (details.status === "COMPLETED") {
        successPayment(details);
      }
    });
  };

  useEffect(() => {
    dispatch({
      type: "resetOptions",
      value: {
        ...options,
        currency: currency,
      },
    });
  }, [currency, showSpinner, price]);

  return (
    <div style={{ width: "450px", minHeight: "150px" }}>
      {showSpinner && isPending && <div className="spinner" />}
      <PayPalButtons
        style={style}
        createOrder={(data, actions) => onCreateOrder(data, actions)}
        onApprove={(data, actions) => onApproveOrder(data, actions)}
      />
    </div>
  );
};

PayPalButtonsWrapper.propTypes = {
  currency: PropTypes.string,
  showSpinner: PropTypes.any,
  price: PropTypes.number,
  successPayment: PropTypes.func.isRequired,
};
