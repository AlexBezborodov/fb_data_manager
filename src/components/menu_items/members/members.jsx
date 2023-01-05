import React, { useState, useContext } from "react";

import { SettingOutlined } from "@ant-design/icons";
import { Button, message, Typography, Input } from "antd";
import axios from "axios";
import moment from "moment";

import { Box } from "../../../global_styles/global_styles";
import { CurrentUserContext } from "../../../providers/current_user";
import { BASIC_DB_URL, CONFIG } from "../../../variables";
import { BasicModal } from "./basic_modal/basic_modal";
import { BasicSearch } from "./basic_search/basic_search";
import { BasicSelect } from "./basic_select";
import { ColumnsPreferences } from "./columns_preferences/columns_preferences";
import { Container, Wrapper, ContentContainer } from "./styles";
import { CustomTable } from "./table";

export const Members = () => {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [activeFilter, setActiveFilter] = useState(filters[0].value);

  const [activeMainFilter, setActiveMainFilter] = useState(groups[0].value);
  const [searchValue, setSearchValue] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modaListlOpen, setListModalOpen] = useState(false);

  const [visibleColumns, setVisibleColumns] = useState(columns);
  const [listName, setListName] = useState("");

  const selectProps = {
    size: "large",
    options: filters,
    setValue: setActiveFilter,
    styles: { width: 150 },
  };
  const groupsSelectProps = {
    size: "large",
    options: groups,
    setValue: setActiveMainFilter,
    styles: { width: "100%" },
  };

  const saveList = () => {
    const userId = localStorage.getItem("userId");
    const checkedData = selectedRowKeys.map((index) => data[index]);
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
              data={data}
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

const filters = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "q1",
    label: "Question 1",
  },
  {
    value: "q2",
    label: "Question 2",
  },
  {
    value: "q3",
    label: "Question 3",
  },
  {
    value: "details",
    label: "Details",
  },
];
const groups = [
  {
    value: "group",
    label: "FB group",
  },
];

const columns = [
  {
    title: "Profile photo",
    dataIndex: "avatar",
    visible: false,
  },
  {
    title: "Full Name",
    dataIndex: "name",
    sorter: (a, b) => a.name.localeCompare(b.name),
    visible: true,
  },
  {
    title: "Q1",
    dataIndex: "q1",
    sorter: (a, b) => a.q1.localeCompare(b.q1),
    visible: true,
  },
  {
    title: "Answer1",
    dataIndex: "a1",
    sorter: (a, b) => a.a1.localeCompare(b.a1),
    visible: true,
  },
  {
    title: "Q2",
    dataIndex: "q2",
    sorter: (a, b) => a.q2.localeCompare(b.q2),
    visible: true,
  },
  {
    title: "Answer2",
    dataIndex: "a2",
    sorter: (a, b) => a.a2.localeCompare(b.a2),
    visible: true,
  },
  {
    title: "Q3",
    dataIndex: "q3",
    sorter: (a, b) => a.q3.localeCompare(b.q3),
    visible: false,
  },
  {
    title: "Answer3",
    dataIndex: "a3",
    sorter: (a, b) => a.a3.localeCompare(b.a3),
    visible: false,
  },
  {
    title: "Profile Link",
    dataIndex: "profileLink",
    visible: true,
  },
  {
    title: "Details",
    dataIndex: "details",
    sorter: (a, b) => a.details.localeCompare(b.details),
    visible: true,
  },
];

const data = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    name: `Edward King ${i}`,
    q1: `question ${i + 1}`,
    a1: `answer ${i + 1}`,
    q2: `question 22${i + 1}`,
    a2: `answer 22${i + 1}`,
    q3: `question 33${i + 1}`,
    a3: `answer 33${i + 1}`,
    profileLink: `www.facebook.com/${i + 1}`,
    details: `detail ${1100 - i}`,
  });
}
