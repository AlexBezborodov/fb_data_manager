import React, { useContext } from "react";

import { Input, Button } from "antd";
import { message, Typography } from "antd";
import axios from "axios";
import PropTypes from "prop-types";

import { Box } from "../../../../global_styles/global_styles";
import { CurrentUserContext } from "../../../../providers/current_user";
import { BASIC_DB_URL, CONFIG } from "../../../../variables";
import { BasicModal } from "../../../basic_components";
export const EditMemberModal = ({
  editModalOpen,
  setEditModalOpen,
  editData,
  setEditData,
  inputHandler,
}) => {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const userId = localStorage.getItem("userId");

  const updateMember = () => {
    const index = currentUser?.scrappedData.findIndex(
      (item) => item.id === editData.id
    );

    currentUser.scrappedData[index].avatarUrl = editData?.avatarUrl;
    currentUser.scrappedData[index].user = editData?.user;
    currentUser.scrappedData[index].profileLink = editData?.profileLink;
    currentUser.scrappedData[index].basicInfo = editData?.basicInfo;
    axios
      .patch(
        `${BASIC_DB_URL}/users/user${userId}.json`,
        { ...currentUser },
        CONFIG
      )
      .then((res) => {
        if (res.status === 200) {
          setCurrentUser(res.data);
          message.success("Member updated!");
          setEditModalOpen(false);
          setEditData(null);
        } else {
          message.error("Something went wrong. Try again later");
        }
      });
  };

  return (
    <BasicModal
      title="Edit Member"
      open={editModalOpen}
      closeModal={setEditModalOpen}
    >
      <Typography.Text>Edit member Avatar link</Typography.Text>
      <Box m="10px auto">
        <Input
          name="avatarUrl"
          placeholder="Avatar link"
          size="large"
          value={editData?.avatarUrl || ""}
          onChange={inputHandler}
        />
      </Box>
      <Typography.Text>Edit member full name</Typography.Text>
      <Box m="10px auto">
        <Input
          name="user"
          placeholder="Full name"
          size="large"
          value={editData?.user || ""}
          onChange={inputHandler}
        />
      </Box>
      <Typography.Text>Edit spreadsheet link</Typography.Text>
      <Box m="10px auto">
        <Input
          name="profileLink"
          placeholder="Profile link"
          size="large"
          value={editData?.profileLink || ""}
          onChange={inputHandler}
        />
      </Box>
      <Typography.Text>Edit Details</Typography.Text>
      {editData?.basicInfo.map((item, i) => (
        <Box m="5px auto" key={i}>
          <Input
            placeholder="details"
            size="large"
            value={editData?.basicInfo[i] || ""}
            onChange={(e) => inputHandler(e, i)}
          />
        </Box>
      ))}
      <Box m="16px" style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button type="primary" onClick={updateMember}>
          Update
        </Button>
      </Box>
    </BasicModal>
  );
};

EditMemberModal.propTypes = {
  editModalOpen: PropTypes.bool,
  setEditModalOpen: PropTypes.func.isRequired,
  editData: PropTypes.func.isRequired,
  setEditData: PropTypes.object,
  inputHandler: PropTypes.func.isRequired,
};
