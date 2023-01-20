import React, { useState, useContext, useEffect } from "react";

import {
  SettingOutlined,
  DeleteOutlined,
  ReloadOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Button, message, Typography, Input, Avatar } from "antd";
import axios from "axios";
import moment from "moment";

import { Box } from "../../../global_styles/global_styles";
import { CurrentUserContext } from "../../../providers/current_user";
import { BASIC_DB_URL, CONFIG, FILTERS, GROUPS } from "../../../variables";
import { BasicModal, BasicSearch, BasicSelect } from "../../basic_components";
import { CustomTable } from "../../basic_components/table";
import { ColumnsPreferences } from "./columns_preferences/columns_preferences";
import { Container, Wrapper, ContentContainer } from "./styles";

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
      title: "Notes",
      dataIndex: "notes",
      visible: true,
      width: 200,
      render: (index, item) => (
        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>{item.note}</Box>
          <Box m="0 10px">
            <Button
              type="ghost"
              shape="circle"
              icon={<EditOutlined />}
              size="small"
              onClick={() => editMemberNote(item.key)}
            />
          </Box>
        </Box>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      visible: true,
      render: (index, item) => (
        <Box style={{ display: "flex", justifyContent: "center" }}>
          <Box m="0 5px">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              size="small"
              onClick={() => editMember(item.key)}
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

  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const [tableData, setTableData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [activeFilter, setActiveFilter] = useState(FILTERS[0].value);

  const [activeMainFilter, setActiveMainFilter] = useState(GROUPS[0].value);
  const [activeGroup, setActiveGroup] = useState();
  const [searchValue, setSearchValue] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modaListlOpen, setListModalOpen] = useState(false);

  const [visibleColumns, setVisibleColumns] = useState(columns);
  const [listName, setListName] = useState("");

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState();

  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState({
    newNote: "",
    currentItemId: null,
  });

  const userId = localStorage.getItem("userId");

  const modifyGroups = () => {
    if (currentUser?.fbGroups) {
      return [
        ...GROUPS,
        ...currentUser.fbGroups.map((group) => ({
          value: group.groupId,
          label: group.groupName,
        })),
      ];
    } else {
      return GROUPS;
    }
  };
  const selectProps = {
    size: "large",
    options: FILTERS,
    setValue: setActiveFilter,
    styles: { width: 150 },
  };
  const groupsSelectProps = {
    size: "large",
    options: modifyGroups(),
    setValue: setActiveMainFilter,
    styles: { width: "100%" },
  };

  //const listsOptions = modifyGroups().filter((item) => item.value !== "all");
  // const listSelectProps = {
  //   size: "large",
  //   options: listsOptions,
  //   setValue: setActiveGroup,
  //   styles: { width: "100%" },
  //   defaultValue:
  //     activeMainFilter !== "all"
  //       ? modifyGroups().filter((item) => item.value !== "activeMainFilter")[0]
  //           ?.value
  //       : listsOptions[0]?.value,
  // };

  const inputHandler = (e, index) => {
    if (index) {
      const updBasicInfo = editData.basicInfo;
      updBasicInfo[index] = e.target.value;
      setEditData((prev) => ({ ...prev, basicInfo: updBasicInfo }));
    } else {
      setEditData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const editMemberNote = (id) => {
    setNoteModalOpen(true);
    const currentItem = currentUser?.scrappedData.filter(
      (item) => item.id === id
    );
    setCurrentNote({
      currentItemId: id,
      newNote: currentItem[0]?.note || "",
    });
  };

  function transformData(userData) {
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
          fbUserId: item?.profileId,
          details: item?.basicInfo ? item.basicInfo?.toString() : "",
          note: item?.note || "",
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
      groupId: activeGroup,
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
          message.success("List successfully created!");
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

  const editMember = (id) => {
    const index = currentUser?.scrappedData.findIndex((item) => item.id === id);
    setEditModalOpen(true);
    const editableUser = currentUser?.scrappedData[index];
    setEditData({
      avatarUrl: editableUser.avatarUrl,
      user: editableUser.user,
      profileLink: editableUser.profileLink,
      basicInfo: editableUser.basicInfo,
      id,
    });
  };

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

  const filteredByGroup = (items) => {
    if (activeMainFilter === "all") {
      setSelectedRowKeys([]);
      return items;
    } else {
      setSelectedRowKeys([]);
      return items.filter((item) => item.groupId === activeMainFilter);
    }
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
          message.success("Name changed successfully");
        } else {
          message.error("Something went wrong. Try again later");
        }
      });
  };

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
          message.success("Name changed successfully");
        } else {
          message.error("Something went wrong. Try again later");
        }
      });
  };

  useEffect(() => {
    transformData(filteredByGroup(currentUser?.scrappedData));
  }, [currentUser, activeMainFilter, visibleColumns]);

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
              columns={visibleColumns.filter((item) => item.visible)}
              filterQuery={activeFilter}
              selectedRowKeys={selectedRowKeys}
              setSelectedRowKeys={setSelectedRowKeys}
            />
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
        {/* <Typography.Text>Choose group</Typography.Text> */}
        {/* <Box m="15px 0" style={{ display: "none" }}>
          <BasicSelect {...listSelectProps} />
        </Box> */}
        <Box m="16px" style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="primary" onClick={saveList} disabled={!listName.length}>
            Save list
          </Button>
        </Box>
      </BasicModal>

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
        <Box m="5px auto">
          <Input
            placeholder="details"
            size="large"
            value={editData?.basicInfo[0] || ""}
            onChange={(e) => inputHandler(e, 0)}
          />
        </Box>
        <Box m="5px auto">
          <Input
            placeholder="Details"
            size="large"
            value={editData?.basicInfo[1] || ""}
            onChange={(e) => inputHandler(e, 1)}
          />
        </Box>
        <Box m="5px auto">
          <Input
            placeholder="Details"
            size="large"
            value={editData?.basicInfo[2] || ""}
            onChange={(e) => inputHandler(e, 2)}
          />
        </Box>
        <Box m="5px auto">
          <Input
            placeholder="Details"
            size="large"
            value={editData?.basicInfo[3] || ""}
            onChange={(e) => inputHandler(e, 3)}
          />
        </Box>
        <Box m="16px" style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="primary" onClick={updateMember}>
            Update
          </Button>
        </Box>
      </BasicModal>

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
    </>
  );
};
