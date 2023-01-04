import React, { useState } from "react";

import { Table } from "antd";
import PropTypes from "prop-types";

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
  });
}
export const CustomTable = ({ searchQuery, columns }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
  };

  const filteredData = (items) => {
    return searchQuery.length
      ? items.filter((item) => item.name.includes(searchQuery))
      : items;
  };
  return (
    <div
      style={{
        height: 580,
        width: "100%",
        margin: "0 auto",
      }}
    >
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={filteredData(data)}
        pagination={false}
        scroll={{ x: "calc(700px + 50%)", y: 500 }}
      />
    </div>
  );
};

CustomTable.propTypes = {
  searchQuery: PropTypes.string,
  columns: PropTypes.array,
};
