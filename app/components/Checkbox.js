import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import { withStyles } from "@material-ui/core/styles";
import { blueGrey } from "@material-ui/core/colors";

const CustomCheckbox = withStyles({
  root: {
    "&$checked": {
      color: blueGrey[600]
    }
  },
  checked: {}
})(props => <Checkbox color="default" {...props} />);

export default CustomCheckbox;
