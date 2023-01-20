import React, { useContext } from "react";

import { Input, Button } from "antd";
import { message } from "antd";
import axios from "axios";
import PropTypes from "prop-types";

import { Box } from "../../../../global_styles/global_styles";
import { CurrentUserContext } from "../../../../providers/current_user";
import { BASIC_DB_URL, CONFIG } from "../../../../variables";
import { BasicModal } from "../../../basic_components";
export const EditNoteModal = ({
  noteModalOpen,
  setNoteModalOpen,
  currentNote,
  setCurrentNote,
}) => {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const userId = localStorage.getItem("userId");

  const removeNote = () => {
    const index = currentUser?.scrappedData.findIndex(
      (item) => item.id === currentNote.currentItemId
    );
    currentUser.scrappedData[index].note = "";
    const updatedData = currentUser;
    axios
      .patch(
        `${BASIC_DB_URL}/users/user${userId}.json`,
        { ...updatedData },
        CONFIG
      )
      .then((res) => {
        if (res.status === 200) {
          setCurrentUser(res.data);
          setNoteModalOpen(false);
          setCurrentNote({ newNote: "", currentItemId: null });
          message.error("Note Removed");
        } else {
          message.error("Something went wrong. Try again later");
        }
      });
  };

  const saveNote = () => {
    const index = currentUser?.scrappedData.findIndex(
      (item) => item.id === currentNote.currentItemId
    );
    currentUser.scrappedData[index].note = currentNote.newNote;
    const updatedData = currentUser;
    axios
      .patch(
        `${BASIC_DB_URL}/users/user${userId}.json`,
        { ...updatedData },
        CONFIG
      )
      .then((res) => {
        if (res.status === 200) {
          setCurrentUser(res.data);
          setNoteModalOpen(false);
          setCurrentNote({ newNote: "", currentItemId: null });
          message.success("Note added successfully");
        } else {
          message.error("Something went wrong. Try again later");
        }
      });
  };

  return (
    <BasicModal
      open={noteModalOpen}
      closeModal={setNoteModalOpen}
      title="Edit Note"
    >
      <Box m="10px auto">
        <Input.TextArea
          rows={4}
          name="newNote"
          placeholder="Note"
          size="large"
          value={currentNote.newNote || ""}
          onChange={(e) =>
            setCurrentNote((prev) => ({
              ...prev,
              newNote: e.target.value,
            }))
          }
        />
      </Box>
      <Box m="16px" style={{ display: "flex", justifyContent: "flex-end" }}>
        {currentNote?.newNote && (
          <Box m="0 10px">
            <Button type="primary" onClick={removeNote} danger>
              Remove Note
            </Button>
          </Box>
        )}
        <Button
          type="primary"
          onClick={saveNote}
          disabled={!currentNote.newNote}
        >
          Save Note
        </Button>
      </Box>
    </BasicModal>
  );
};

EditNoteModal.propTypes = {
  noteModalOpen: PropTypes.bool,
  setNoteModalOpen: PropTypes.func.isRequired,
  setCurrentNote: PropTypes.func.isRequired,
  currentNote: PropTypes.object,
};
