import React from "react";

import { Checkbox } from "antd";
import PropTypes from "prop-types";

import { Box } from "../../../../global_styles/global_styles";

export const ColumnsPreferences = ({ columns, setSColumnStatus }) => {
  const onChange = (e, index) => {
    columns[index].visible = e.target.checked;
    setSColumnStatus([...columns]);
  };
  return (
    <Box style={{ display: "flex", justifyContent: "center" }}>
      <Box
        m="15px"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          width: "30%",
        }}
      >
        <Checkbox
          name="avatar"
          checked={columns[0].visible}
          onChange={(e) => onChange(e, 0)}
        >
          Profile photo
        </Checkbox>
        <Checkbox
          name="fullName"
          checked={columns[1].visible}
          onChange={(e) => onChange(e, 1)}
        >
          Full name
        </Checkbox>
        <Checkbox
          name="q1"
          checked={columns[2].visible}
          onChange={(e) => onChange(e, 2)}
        >
          Q1
        </Checkbox>
        <Checkbox
          name="a1"
          checked={columns[3].visible}
          onChange={(e) => onChange(e, 3)}
        >
          Answer 1
        </Checkbox>
        <Checkbox
          name="q2"
          checked={columns[4].visible}
          onChange={(e) => onChange(e, 4)}
        >
          Q2
        </Checkbox>
      </Box>
      <Box
        m="15px"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          width: "30%",
        }}
      >
        <Checkbox
          name="a2"
          checked={columns[5].visible}
          onChange={(e) => onChange(e, 5)}
        >
          Answer 2
        </Checkbox>
        <Checkbox
          name="q3"
          checked={columns[6].visible}
          onChange={(e) => onChange(e, 6)}
        >
          Q3
        </Checkbox>
        <Checkbox
          name="a3"
          checked={columns[7].visible}
          onChange={(e) => onChange(e, 7)}
        >
          Answer3
        </Checkbox>
        <Checkbox
          name="profile"
          checked={columns[8].visible}
          onChange={(e) => onChange(e, 8)}
        >
          Profile link
        </Checkbox>
        <Checkbox
          name="details"
          checked={columns[9].visible}
          onChange={(e) => onChange(e, 9)}
        >
          Details
        </Checkbox>
        <Checkbox
          name="actions"
          checked={columns[10].visible}
          onChange={(e) => onChange(e, 10)}
        >
          Actions
        </Checkbox>
      </Box>
    </Box>
  );
};

ColumnsPreferences.propTypes = {
  columns: PropTypes.array,
  setSColumnStatus: PropTypes.func.isRequired,
};
