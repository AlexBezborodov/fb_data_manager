import React from "react";

import { Select } from "antd";
import PropTypes from "prop-types";

export const BasicSelect = ({
  size = "small",
  defaultValue,
  options,
  setValue,
  styles,
}) => {
  const handleChange = (value) => setValue(value);
  return (
    <Select
      size={size}
      defaultValue={defaultValue || options[0].value}
      style={{ ...styles }}
      onChange={handleChange}
      options={options}
    />
  );
};

BasicSelect.propTypes = {
  size: PropTypes.oneOf(["large", "middle", "small"]),
  defaultValue: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  setValue: PropTypes.func.isRequired,
  styles: PropTypes.object,
};
