import React, { useState } from "react";

import { SettingOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { Checkbox } from "antd";

import { Box } from "../../../global_styles/global_styles";
import { BasicModal } from "./basic_modal/basic_modal";
import { BasicSearch } from "./basic_search/basic_search";
import { BasicSelect } from "./basic_select";
import { Container, Wrapper, ContentContainer } from "./styles";
import { CustomTable } from "./table";

export const Members = () => {
  const [activeFilter, setActiveFilter] = useState(filters[0].value);
  const [activeMainFilter, setActiveMainFilter] = useState(groups[0].value);
  const [searchValue, setSearchValue] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [visibleColumns, setVisibleColumns] = useState(columns);

  const onChange = (e, index) => {
    visibleColumns[index].visible = e.target.checked;
    setVisibleColumns([...visibleColumns]);
  };

  const selectProps = {
    size: "large",
    options: filters,
    setValue: setActiveFilter,
    styles: { width: 120 },
  };
  const groupsSelectProps = {
    size: "large",
    options: groups,
    setValue: setActiveMainFilter,
    styles: { width: "100%" },
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
              searchQuery={searchValue}
              columns={columns.filter((item) => item.visible)}
            />
          </ContentContainer>
        </Wrapper>
      </Container>
      <BasicModal open={modalOpen} closeModal={setModalOpen}>
        <Checkbox
          name="profile"
          checked={visibleColumns[7].visible}
          onChange={(e) => onChange(e, 7)}
        >
          Profile link
        </Checkbox>
        <Checkbox
          name="a3"
          checked={visibleColumns[6].visible}
          onChange={(e) => onChange(e, 6)}
        >
          Answer3
        </Checkbox>
        <Checkbox
          name="q3"
          checked={visibleColumns[5].visible}
          onChange={(e) => onChange(e, 5)}
        >
          Q3
        </Checkbox>
        <Checkbox
          name="a2"
          checked={visibleColumns[4].visible}
          onChange={(e) => onChange(e, 4)}
        >
          Answer 2
        </Checkbox>
        <Checkbox
          name="q2"
          checked={visibleColumns[3].visible}
          onChange={(e) => onChange(e, 3)}
        >
          Q2
        </Checkbox>
        <Checkbox
          name="a1"
          checked={visibleColumns[2].visible}
          onChange={(e) => onChange(e, 2)}
        >
          Answer 1
        </Checkbox>
        <Checkbox
          name="q1"
          checked={visibleColumns[1].visible}
          onChange={(e) => onChange(e, 1)}
        >
          Q1
        </Checkbox>
        <Checkbox
          name="fullName"
          checked={visibleColumns[0].visible}
          onChange={(e) => onChange(e, 0)}
        >
          Full name
        </Checkbox>
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
    value: "study",
    label: "Study at",
  },
  {
    value: "location",
    label: "Living in ",
  },
  {
    value: "work",
    label: "Work At",
  },
  {
    value: "join",
    label: "Join FB",
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
    visible: true,
  },
  {
    title: "Answer3",
    dataIndex: "a3",
    sorter: (a, b) => a.a3.localeCompare(b.a3),
    visible: true,
  },
  {
    title: "Profile Link",
    dataIndex: "profileLink",
    visible: true,
  },
];
