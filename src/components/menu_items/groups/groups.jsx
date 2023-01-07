import React, { useState, useContext, useEffect } from "react";

import { DeleteOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, message, Typography } from "antd";
import axios from "axios";

import { Box } from "../../../global_styles/global_styles";
import { CurrentUserContext } from "../../../providers/current_user";
import { BASIC_DB_URL, CONFIG } from "../../../variables";
import { BasicSearch } from "../../basic_components";
import { CustomTable } from "../../basic_components/table";
import { Container, Wrapper, ContentContainer } from "./styles";

export const Groups = () => {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const columns = [
    {
      title: "List name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
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
      title: "Send email",
      dataIndex: "isSend",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      visible: true,
      width: 90,
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
  const [searchValue, setSearchValue] = useState("");

  const userId = localStorage.getItem("userId");

  function transformData(listsData) {
    if (listsData) {
      setTableData(
        listsData.map((item, i) => ({
          key: item.id,
          name: item.groupName,
          slink: item.spreadsheetLink,
          isSend: false,
        }))
      );
    } else {
      setTableData([]);
    }
  }

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
    </>
  );
};
