import React, { useState, useContext, useEffect } from "react";

import {
  DeleteOutlined,
  ReloadOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Button, message, Typography, Input } from "antd";
import axios from "axios";

import { Box } from "../../../global_styles/global_styles";
import { CurrentUserContext } from "../../../providers/current_user";
import { BASIC_DB_URL, CONFIG } from "../../../variables";
import { BasicSearch, BasicModal } from "../../basic_components";
import { CustomTable } from "../../basic_components/table";
import { Container, Wrapper, ContentContainer } from "./styles";

export const Groups = () => {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const [modalOpen, setModalOpen] = useState(false);
  const columns = [
    {
      title: "Group name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Link to fb group",
      dataIndex: "fbLink",
      Width: 150,
      render: (text) => (
        <a href={text} target="_blank" rel="noreferrer">
          {text}
        </a>
      ),
    },
    {
      title: "Spreadsheet link",
      dataIndex: "slink",
      Width: 150,
      render: (text) => (
        <a href={text} target="_blank" rel="noreferrer">
          {text}
        </a>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      visible: true,
      width: 90,
      render: (index, item) => (
        <Box style={{ display: "flex", justifyContent: "center" }}>
          <Box m="0 10px">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              size="small"
              onClick={() => editItem(item.key)}
            />
          </Box>
          <Button
            type="primary"
            shape="circle"
            icon={<DeleteOutlined />}
            size="small"
            danger
            onClick={() => removeItem(item.key)}
          />
        </Box>
      ),
    },
  ];

  const [tableData, setTableData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [editData, setEditData] = useState();

  const userId = localStorage.getItem("userId");

  const inputHandler = (e) => {
    setEditData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  function transformData(listsData) {
    console.log("listsData", listsData);
    if (listsData) {
      setTableData(
        listsData.map((item, i) => ({
          key: item.id,
          name: item.groupName,
          fbLink: item.groupLink,
          slink: item.spreadsheetLink,
          isSend: false,
        }))
      );
    } else {
      setTableData([]);
    }
  }

  const editItem = (id) => {
    const index = currentUser?.fbGroups.findIndex((item) => item.id === id);
    setModalOpen(true);
    setEditData({
      name: currentUser?.fbGroups[index].groupName,
      link: currentUser?.fbGroups[index].spreadsheetLink,
      fbLink: currentUser?.fbGroups[index].groupLink,
      id,
    });
  };
  const updateItem = () => {
    const index = currentUser?.fbGroups.findIndex(
      (item) => item.id === editData.id
    );

    currentUser.fbGroups[index].groupName = editData?.name;
    currentUser.fbGroups[index].spreadsheetLink = editData?.link;
    currentUser.fbGroups[index].spreadsheetLink = editData?.fbLink;
    axios
      .patch(
        `${BASIC_DB_URL}/users/user${userId}.json`,
        { ...currentUser },
        CONFIG
      )
      .then((res) => {
        if (res.status === 200) {
          setCurrentUser(res.data);
          message.success("Group updated!");
          setModalOpen(false);
          setEditData(null);
        } else {
          message.error("Something went wrong. Try again later");
        }
      });
  };

  const removeItem = (id) => {
    const updatedData = currentUser?.fbGroups.filter((item) => item.id !== id);
    axios
      .patch(
        `${BASIC_DB_URL}/users/user${userId}.json`,
        { ...currentUser, fbGroups: updatedData },
        CONFIG
      )
      .then((res) => {
        if (res.status === 200) {
          setCurrentUser(res.data);
          message.success("Item removed!");
        } else {
          message.error("Something went wrong. Try again later");
        }
      });
  };

  const refresh = () => {
    axios.get(`${BASIC_DB_URL}/users/user${userId}.json`).then((res) => {
      if (res.status === 200) {
        setCurrentUser(res.data);
        message.success("Data updated");
      } else {
        message.error("Something went wrong. Try again later");
      }
    });
  };

  useEffect(() => {
    if (searchValue) {
      const filteredData = currentUser?.fbGroups.filter((item) =>
        item?.groupName?.toLowerCase().includes(searchValue.toLowerCase())
      );
      transformData(filteredData);
    } else {
      transformData(currentUser?.fbGroups);
    }
  }, [currentUser?.fbGroups, searchValue]);

  return (
    <>
      <Container>
        <Wrapper>
          <ContentContainer>
            <Typography.Title variant={2}>Group list</Typography.Title>
            <Box
              style={{ display: "flex", margin: "10px auto", maxWidth: 800 }}
            >
              <BasicSearch value={searchValue} setValue={setSearchValue} />
            </Box>
            <CustomTable data={tableData} columns={columns} />
            <Button
              type="primary"
              shape="circle"
              icon={<ReloadOutlined />}
              size="medium"
              style={{
                position: "absolute",
                top: 8,
                right: 8,
              }}
              onClick={refresh}
            />
          </ContentContainer>
        </Wrapper>
      </Container>
      <BasicModal
        open={modalOpen}
        closeModal={() => setModalOpen(false)}
        title="Edit Group"
      >
        <Typography.Text>Edit group name</Typography.Text>
        <Box m="10px auto">
          <Input
            name="name"
            placeholder="Group name"
            size="large"
            value={editData?.name || ""}
            onChange={inputHandler}
          />
        </Box>
        <Typography.Text>Edit fb group link</Typography.Text>
        <Box m="10px auto">
          <Input
            name="fblink"
            placeholder="fb group link"
            size="large"
            value={editData?.fbLink || ""}
            onChange={inputHandler}
          />
        </Box>
        <Typography.Text>Edit spreadsheet link</Typography.Text>
        <Box m="10px auto">
          <Input
            name="link"
            placeholder="Link"
            size="large"
            value={editData?.link || ""}
            onChange={inputHandler}
          />
        </Box>
        <Box m="16px" style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="primary"
            onClick={updateItem}
            disabled={!editData?.name || !editData?.link || !editData?.fbLink}
          >
            Update Group
          </Button>
        </Box>
      </BasicModal>
    </>
  );
};
