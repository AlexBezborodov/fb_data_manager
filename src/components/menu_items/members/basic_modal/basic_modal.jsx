import React from "react";

import { Modal } from "antd";
import PropTypes from "prop-types";
export const BasicModal = ({ children, title, open, closeModal }) => {
  return (
    <Modal
      title={title}
      open={open}
      onCancel={() => closeModal(false)}
      cancelButtonProps={{ style: { display: "none" } }}
      okButtonProps={{ style: { display: "none" } }}
    >
      {children}
    </Modal>
  );
};

BasicModal.propTypes = {
  children: PropTypes.any,
  title: PropTypes.string,
  open: PropTypes.bool,
  closeModal: PropTypes.func.isRequired,
};
