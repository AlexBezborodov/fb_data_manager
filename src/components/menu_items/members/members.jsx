import React, { useState, useContext, useEffect } from "react";

import { SettingOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, message, Typography, Input, Avatar } from "antd";
import axios from "axios";
import moment from "moment";

import { Box } from "../../../global_styles/global_styles";
import { CurrentUserContext } from "../../../providers/current_user";
import { BASIC_DB_URL, CONFIG, FILTERS, GROUPS } from "../../../variables";
import { BasicModal, BasicSearch, BasicSelect } from "../../basic_components";
import { ColumnsPreferences } from "./columns_preferences/columns_preferences";
import { Container, Wrapper, ContentContainer } from "./styles";
import { CustomTable } from "./table";

export const Members = () => {
  const columns = [
    {
      title: "Profile photo",
      dataIndex: "avatar",
      render: (url) => <Avatar size={70} src={url} />,
      visible: true,
      width: 100,
    },
    {
      title: "Full Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      visible: true,
      width: 150,
    },
    {
      title: "Q1",
      dataIndex: "q1",
      sorter: (a, b) => a.q1.localeCompare(b.q1),
      visible: true,
      Width: 150,
    },
    {
      title: "Answer1",
      dataIndex: "a1",
      sorter: (a, b) => a.a1.localeCompare(b.a1),
      visible: true,
      Width: 150,
    },
    {
      title: "Q2",
      dataIndex: "q2",
      sorter: (a, b) => a.q2.localeCompare(b.q2),
      visible: true,
      Width: 150,
    },
    {
      title: "Answer2",
      dataIndex: "a2",
      sorter: (a, b) => a.a2.localeCompare(b.a2),
      visible: true,
      Width: 150,
    },
    {
      title: "Q3",
      dataIndex: "q3",
      sorter: (a, b) => a.q3.localeCompare(b.q3),
      visible: false,
      Width: 150,
    },
    {
      title: "Answer3",
      dataIndex: "a3",
      sorter: (a, b) => a.a3.localeCompare(b.a3),
      visible: false,
      Width: 150,
    },
    {
      title: "Profile Link",
      dataIndex: "profileLink",
      render: (text) => (
        <a href={text} target="_blank" rel="noreferrer">
          {text}
        </a>
      ),
      visible: true,
      width: 200,
    },
    {
      title: "Details",
      dataIndex: "details",
      sorter: (a, b) => a.details.localeCompare(b.details),
      visible: true,
      width: 400,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      visible: true,
      render: (index, item) => (
        <Box style={{ display: "flex", justifyContent: "center" }}>
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

  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const [tableData, setTableData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [activeFilter, setActiveFilter] = useState(FILTERS[0].value);

  const [activeMainFilter, setActiveMainFilter] = useState(GROUPS[0].value);
  const [searchValue, setSearchValue] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modaListlOpen, setListModalOpen] = useState(false);

  const [visibleColumns, setVisibleColumns] = useState(columns);
  const [listName, setListName] = useState("");

  const userId = localStorage.getItem("userId");

  const selectProps = {
    size: "large",
    options: FILTERS,
    setValue: setActiveFilter,
    styles: { width: 150 },
  };
  const groupsSelectProps = {
    size: "large",
    options: GROUPS,
    setValue: setActiveMainFilter,
    styles: { width: "100%" },
  };

  function transformData(userData) {
    console.log("userData", userData);
    if (userData) {
      setTableData(
        userData.map((item, i) => ({
          key: item.id,
          avatar: item.avatarUrl,
          name: item.user,
          q1: item?.questions[0]?.question,
          a1: item?.questions[0]?.answer,
          q2: item?.questions[1]?.question,
          a2: item?.questions[1]?.answer,
          q3: item?.questions[2]?.question,
          a3: item?.questions[2]?.answer,
          profileLink: item.profileLink,
          details: item?.basicInfo ? item.basicInfo?.toString() : "",
        }))
      );
    } else {
      setTableData([]);
    }
  }

  const saveList = () => {
    const checkedData = selectedRowKeys.map((ind) => {
      const idx = tableData.findIndex((item) => item.key === ind);
      return tableData[idx];
    });
    const list = {
      id: Math.floor(Math.random() * 1000000),
      listName,
      createdDate: moment().format("DD/MM/YYYY HH:mm"),
      updatedDate: moment().format("DD/MM/YYYY HH:mm"),
      data: checkedData,
    };
    const updatedData = currentUser?.lists
      ? [...currentUser.lists, list]
      : [list];

    axios
      .patch(
        `${BASIC_DB_URL}/users/user${userId}.json`,
        { ...currentUser, lists: updatedData },
        CONFIG
      )
      .then((res) => {
        if (res.status === 200) {
          setCurrentUser(res.data);
          setListModalOpen(false);
          setListName("");
          setSelectedRowKeys([]);
          message.success("List succefully created!");
        } else {
          message.error("Something went wrong. Try again later");
        }
      });
  };

  const removeItem = (id) => {
    const updatedData = currentUser?.scrappedData.filter(
      (item) => item.id !== id
    );
    axios
      .patch(
        `${BASIC_DB_URL}/users/user${userId}.json`,
        { ...currentUser, scrappedData: updatedData },
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

  useEffect(() => {
    transformData(currentUser?.scrappedData);
  }, [currentUser?.scrappedData]);

  return (
    <>
      <Container>
        <Wrapper>
          <ContentContainer>
            <Box
              style={{ display: "flex", margin: "10px auto", maxWidth: 800 }}
            >
              <BasicSelect {...groupsSelectProps} />
              <Box m="0 0 0 15px">
                <Button
                  type="primary"
                  shape="circle"
                  icon={<SettingOutlined />}
                  size="large"
                  onClick={() => setModalOpen(true)}
                />
              </Box>
            </Box>
            <Box
              style={{ display: "flex", margin: "20px auto", maxWidth: 800 }}
            >
              <Box m="0 15px 0 0">
                <BasicSelect {...selectProps} />
              </Box>
              <BasicSearch value={searchValue} setValue={setSearchValue} />
            </Box>
            <CustomTable
              data={tableData}
              searchQuery={searchValue}
              columns={columns.filter((item) => item.visible)}
              filterQuery={activeFilter}
              selectedRowKeys={selectedRowKeys}
              setSelectedRowKeys={setSelectedRowKeys}
            />
          </ContentContainer>
          <Box m="16px" style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="primary"
              onClick={() => setListModalOpen(true)}
              disabled={!selectedRowKeys.length}
            >
              Create list
            </Button>
          </Box>
        </Wrapper>
      </Container>
      <BasicModal title="Customize" open={modalOpen} closeModal={setModalOpen}>
        <ColumnsPreferences
          columns={visibleColumns}
          setSColumnStatus={setVisibleColumns}
        />
      </BasicModal>
      <BasicModal open={modaListlOpen} closeModal={setListModalOpen}>
        <Typography.Title level={2}>
          Count {selectedRowKeys.length} members
        </Typography.Title>
        <Box>
          <Input
            name="listName"
            placeholder="list name"
            size="large"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
          />
        </Box>
        <Box m="16px" style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="primary"
            onClick={saveList}
            disabled={!selectedRowKeys.length}
          >
            Save list
          </Button>
        </Box>
      </BasicModal>
    </>
  );
};
