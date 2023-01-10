import React, { useState, useContext, useEffect } from "react";

import {
  DeleteOutlined,
  EditOutlined,
  ReloadOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Button, message, Typography, Tag, Avatar, Input } from "antd";
import axios from "axios";
import moment from "moment";

import { Box } from "../../../global_styles/global_styles";
import { CurrentUserContext } from "../../../providers/current_user";
import { BASIC_DB_URL, CONFIG, GROUPS } from "../../../variables";
import { BasicModal, BasicSearch, BasicSelect } from "../../basic_components";
import { CustomTable } from "../../basic_components/table";
import { Container, Wrapper, ContentContainer } from "./styles";
import { CustomTags } from "./tags";

export const Lists = () => {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const columns = [
    {
      title: "List name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      width: 300,
      render: (index, item) => (
        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>{item.name}</Box>
          <Box m="0 10px">
            <Button
              type="ghost"
              shape="circle"
              icon={<EditOutlined />}
              size="small"
              onClick={() => editItemListName(item.key)}
            />
          </Box>
        </Box>
      ),
    },
    {
      title: "Total members",
      dataIndex: "totalMembers",
      sorter: (a, b) => a.totalMembers - b.totalMembers,
      Width: 50,
      render: (index, item) => (
        <Box style={{ display: "flex", justifyContent: "center" }}>
          <Box m="0 10px">
            <Tag color="cyan">{item.totalMembers}</Tag>
          </Box>
          <Button
            type="ghost"
            shape="circle"
            icon={<UnorderedListOutlined />}
            size="small"
            onClick={() => showMembersList(item)}
          />
        </Box>
      ),
    },
    {
      title: "Tags",
      dataIndex: "tags",
      Width: 300,
      render: (_index, item) => (
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box>
            {item?.tags?.map((tag, i) => {
              let color = i % 2 ? "geekblue" : "green";
              return (
                <Tag color={color} key={tag} style={{ margin: 3 }}>
                  {tag.toUpperCase()}
                </Tag>
              );
            })}
          </Box>
          <Box m="0 10px">
            <Button
              type="ghost"
              shape="circle"
              icon={<EditOutlined />}
              size="small"
              onClick={() => editTag(item.key)}
            />
          </Box>
        </Box>
      ),
    },
    {
      title: "Last update",
      dataIndex: "updateDate",
      sorter: (a, b) => moment(a.updateDate) - moment(b.updateDate),

      Width: 150,
    },
    {
      title: "Created date",
      dataIndex: "createDate",
      sorter: (a, b) => moment(a.updateDate) - moment(b.updateDate),

      Width: 150,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      visible: true,
      width: 100,
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

  const [tableData, setTableData] = useState([]);
  const [activeMainFilter, setActiveMainFilter] = useState(GROUPS[0].value);
  const [searchValue, setSearchValue] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [membersOpenModal, setMembersOpenModal] = useState(false);
  const [editNameModal, setEditNameModal] = useState(false);

  const [currentMembersList, setMCUrrentMembersList] = useState([]);
  const [tags, setCurrentTags] = useState({ tags: [], currentItemId: null });
  const [currentListName, setCurrentListName] = useState({
    newName: "",
    currentItemId: null,
  });

  const userId = localStorage.getItem("userId");
  const actions = {
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
          onClick={() => removeUserFromList(item.key)}
        />
      </Box>
    ),
  };

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

  const groupsSelectProps = {
    size: "large",
    options: modifyGroups(),
    setValue: setActiveMainFilter,
    styles: { width: "100%" },
  };

  function transformData(listsData) {
    if (listsData) {
      setTableData(
        listsData.map((item, i) => ({
          key: item.id,
          name: item.listName,
          totalMembers: item?.data?.length || 0,
          tags: item?.tags || [],
          updateDate: item?.updatedDate,
          createDate: item?.createdDate,
          data: item.data,
        }))
      );
    } else {
      setTableData([]);
    }
  }

  const removeItem = (id) => {
    const updatedData = currentUser?.lists.filter((item) => item.id !== id);
    axios
      .patch(
        `${BASIC_DB_URL}/users/user${userId}.json`,
        { ...currentUser, lists: updatedData },
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
  const removeUserFromList = (key) => {
    const updatedList = currentMembersList.data.filter(
      (item) => item.key !== key
    );
    const index = currentUser?.lists.findIndex(
      (i) => i.id === currentMembersList.listId
    );
    currentUser.lists[index].data = updatedList;

    axios
      .patch(
        `${BASIC_DB_URL}/users/user${userId}.json`,
        { ...currentUser },
        CONFIG
      )
      .then((res) => {
        if (res.status === 200) {
          setCurrentUser(res.data);
          message.success("Item removed!");
          setMCUrrentMembersList((prev) => ({ ...prev, data: updatedList }));
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
      return items;
    } else {
      return items.filter((item) => item.groupId === activeMainFilter);
    }
  };

  const editTag = (id) => {
    setModalOpen(true);
    const currentItem = currentUser?.lists.filter((item) => item.id === id);
    setCurrentTags({
      currentItemId: id,
      tags: currentItem[0]?.tags,
    });
  };

  const editItemListName = (id) => {
    setEditNameModal(true);
    const currentItem = currentUser?.lists.filter((item) => item.id === id);
    setCurrentListName({
      currentItemId: id,
      newName: currentItem[0].listName,
    });
  };

  const saveTags = () => {
    const index = currentUser?.lists.findIndex(
      (item) => item.id === tags.currentItemId
    );
    currentUser.lists[index].updatedDate = moment().format("DD/MM/YYYY HH:mm");
    currentUser.lists[index].tags = [...tags.tags];
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
          setModalOpen(false);
          setCurrentTags({ tags: [], currentItemId: null });
          message.success("Tag added successfully");
        } else {
          message.error("Something went wrong. Try again later");
        }
      });
  };

  const saveListName = () => {
    const index = currentUser?.lists.findIndex(
      (item) => item.id === currentListName.currentItemId
    );
    currentUser.lists[index].updatedDate = moment().format("DD/MM/YYYY HH:mm");
    currentUser.lists[index].listName = currentListName.newName;
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
          setEditNameModal(false);
          setCurrentListName({ newName: "", currentItemId: null });
          message.success("Name changed successfully");
        } else {
          message.error("Something went wrong. Try again later");
        }
      });
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentTags({ tags: [], currentItemId: null });
  };
  const closeEditModal = () => {
    setEditNameModal(false);
    setCurrentListName({ newName: "", currentItemId: null });
  };
  const showMembersList = (item) => {
    setMCUrrentMembersList({ data: item.data, listId: item.key });
    setMembersOpenModal(true);
  };

  useEffect(() => {
    const filteredByGroupData = filteredByGroup(currentUser?.lists);
    if (searchValue) {
      const filteredData = filteredByGroupData.filter(
        (item) =>
          item?.listName?.toLowerCase().includes(searchValue.toLowerCase()) ||
          item?.tags?.includes(searchValue)
      );
      transformData(filteredData);
    } else {
      transformData(filteredByGroupData);
    }
  }, [currentUser?.lists, searchValue, activeMainFilter]);

  return (
    <>
      <Container>
        <Wrapper>
          <ContentContainer>
            <Box
              style={{ display: "flex", margin: "10px auto", maxWidth: 800 }}
            >
              <BasicSelect {...groupsSelectProps} />
            </Box>
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
      <BasicModal open={modalOpen} closeModal={closeModal}>
        <Typography.Title level={2}>Keywords</Typography.Title>
        <Box>
          <CustomTags incomeTags={tags?.tags} updateTags={setCurrentTags} />
        </Box>
        <Box m="16px" style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="primary" onClick={saveTags}>
            Save Tags
          </Button>
        </Box>
      </BasicModal>

      <BasicModal
        open={membersOpenModal}
        closeModal={() => setMembersOpenModal(false)}
        width="auto"
      >
        <Typography.Title level={2}>Saved Members</Typography.Title>
        <CustomTable
          data={currentMembersList.data}
          columns={[...membersColumns, actions]}
        />
      </BasicModal>

      <BasicModal
        open={editNameModal}
        closeModal={closeEditModal}
        title="Edit Group"
      >
        <Typography.Text>Edit group name</Typography.Text>
        <Box m="10px auto">
          <Input
            name="name"
            placeholder="Group name"
            size="large"
            value={currentListName.newName || ""}
            onChange={(e) =>
              setCurrentListName((prev) => ({
                ...prev,
                newName: e.target.value,
              }))
            }
          />
        </Box>
        <Box m="16px" style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="primary"
            onClick={saveListName}
            disabled={!currentListName}
          >
            Save list
          </Button>
        </Box>
      </BasicModal>
    </>
  );
};

const membersColumns = [
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
    width: 150,
  },
  {
    title: "Q1",
    dataIndex: "q1",
    sorter: (a, b) => a.q1.localeCompare(b.q1),
    Width: 150,
  },
  {
    title: "Answer1",
    dataIndex: "a1",
    sorter: (a, b) => a.a1.localeCompare(b.a1),

    Width: 150,
  },
  {
    title: "Q2",
    dataIndex: "q2",
    sorter: (a, b) => a.q2.localeCompare(b.q2),
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
    width: 400,
  },
];
