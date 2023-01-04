import React from "react";

import { Input } from "antd";
import PropTypes from "prop-types";

export const BasicSearch = ({ value, setValue, styles, size = "large" }) => {
  const handleChange = (e) => setValue(e.target.value);
  return (
    <Input.Search
      placeholder="Search"
      onChange={handleChange}
      style={{ width: "100%", ...styles }}
      value={value || ""}
      size={size}
    />
  );
};

BasicSearch.propTypes = {
  size: PropTypes.oneOf(["large", "middle", "small"]),
  value: PropTypes.string,
  setValue: PropTypes.func.isRequired,
  styles: PropTypes.object,
};
