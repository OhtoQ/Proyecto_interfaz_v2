import React from "react";
import { Collapse, Grid, IconButton } from "@mui/material";
import PropTypes from "prop-types";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

function StudentScheduleDetails(props) {
  const { header, details } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Grid container spacing={2} alignItems="center" mt={0} pt={0}>
        <Grid item sm={1} xs={2} style={{ paddingTop: 0 }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </Grid>
        <Grid item sm={11} xs={10} style={{ paddingTop: 0 }}>
          {header}
        </Grid>
      </Grid>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {details}
      </Collapse>
    </>
  );
}

StudentScheduleDetails.propTypes = {
  header: PropTypes.object.isRequired,
  details: PropTypes.element.isRequired,
};

export default StudentScheduleDetails;
