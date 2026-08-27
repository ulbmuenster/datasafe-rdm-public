import React from "react";

import { Icon, Label } from "semantic-ui-react";

const Pill = (props) => {
  const { value, removePill, type } = props;
  return (
    <Label className={`pill ${type}`} key={value}>
      <span className={"pill-text"}>{value}</span>
      <Icon aria-hidden="true" name="delete" tabIndex="0" onClick={() => removePill(value)}
            onKeyDown={(e) => e.key === "Enter" && removePill(value)} />
    </Label>
  );
};

export default Pill;
