import React, { useState, useContext, useEffect } from "react";

import { DeleteOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, message, Avatar } from "antd";
import axios from "axios";
import moment from "moment";

import { Box } from "../../../global_styles/global_styles";
import { CurrentUserContext } from "../../../providers/current_user";
import { BASIC_DB_URL, CONFIG, GROUPS } from "../../../variables";
import { BasicModal, BasicSearch, BasicSelect } from "../../basic_components";
import { CustomTable } from "../../basic_components/table";
import { Container, Wrapper, ContentContainer } from "./styles";

export const Lists = () => {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const columns = [
    {
      title: "List name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      width: 300,
    },
    {
      title: "Total members",
      dataIndex: "totalMembers",
      sorter: (a, b) => a.totalMembers - b.totalMembers,
      Width: 50,
    },
    {
      title: "Tags",
      dataIndex: "tags",
      Width: 300,
    },
    {
      title: "Last update",
      dataIndex: "updateDate",
      //need to add moment compare
      sorter: (a, b) => a.updateDate.localeCompare(b.updateDate),

      Width: 150,
    },
    {
      title: "Created date",
      dataIndex: "createDate",
      //need to add moment compare
      sorter: (a, b) => a.updateDate.localeCompare(b.updateDate),

      Width: 150,
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

  const [tableData, setTableData] = useState([]);
  console.log("tableData", tableData);
  const [activeMainFilter, setActiveMainFilter] = useState(GROUPS[0].value);
  const [searchValue, setSearchValue] = useState("");

  const [modalOpen, setModalOpen] = useState(false);

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

  const groupsSelectProps = {
    size: "large",
    options: modifyGroups(),
    setValue: setActiveMainFilter,
    styles: { width: "100%" },
  };

  function transformData(listsData) {
    console.log("listsData", listsData);
    if (listsData) {
      setTableData(
        listsData.map((item, i) => ({
          key: item.id,
          name: item.listName,
          totalMembers: item?.data?.length || 0,
          tags: item?.tags?.toString() || "no tags",
          updateDate: item?.updatedDate,
          createDate: item?.createdDate,
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
      const filteredData = currentUser?.lists.filter((item) =>
        item?.listName?.toLowerCase().includes(searchValue.toLowerCase())
      );
      console.log("filteredData", filteredData);
      transformData(filteredData);
    } else {
      transformData(currentUser?.lists);
    }
  }, [currentUser?.lists, searchValue]);

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
    </>
  );
};
