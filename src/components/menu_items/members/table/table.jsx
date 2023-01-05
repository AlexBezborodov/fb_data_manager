import React from "react";

import { Table } from "antd";
import PropTypes from "prop-types";

export const CustomTable = ({
  data,
  searchQuery,
  columns,
  filterQuery,
  selectedRowKeys,
  setSelectedRowKeys,
}) => {
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
    if (filterQuery === "all") {
      return searchQuery.length
        ? items.filter(
            (item) =>
              item.name.includes(searchQuery) ||
              item.q1.includes(searchQuery) ||
              item.q2.includes(searchQuery) ||
              item.q3.includes(searchQuery) ||
              item.details.includes(searchQuery)
          )
        : items;
    } else {
      return searchQuery.length
        ? items.filter((item) =>
            item[filterQuery].toLowerCase().includes(searchQuery.toLowerCase())
          )
        : items;
    }
  };
  return (
    <div
      style={{
        height: 580,
        width: "100%",
        margin: "0 auto",
      }}
    >
      {columns.length ? (
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredData(data)}
          pagination={false}
          scroll={{ x: "calc(700px + 50%)", y: 500 }}
        />
      ) : (
        <div>Empty table</div>
      )}
    </div>
  );
};

CustomTable.propTypes = {
  data: PropTypes.array,
  searchQuery: PropTypes.string,
  columns: PropTypes.array,
  filterQuery: PropTypes.string,
  selectedRowKeys: PropTypes.array,
  setSelectedRowKeys: PropTypes.func.isRequired,
};
