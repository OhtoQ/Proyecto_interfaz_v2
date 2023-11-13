import React from "react";
import { Box, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import PropTypes from "prop-types";
import InfoIcon from "@mui/icons-material/Info";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import StudentScheduleReservationModal from "./StudentScheduleReservationModal.js";
import { getScheduleImprovedStatus } from "/src/utils/scheduleUtils";

const labelData = {
  FINISHED: {
    labelText: "Terminada",
    labelColor: "green",
    warning: "",
  },
  STARTED: {
    labelText: "Empezada",
    labelColor: "orange",
    warning: "",
  },
  STARTED_EXPIRED: {
    labelText: "Empezada",
    labelColor: "red",
    warning: "¡Es necesario reagendar!",
  },
  READY_TO_START: {
    labelText: "Agendada",
    warning: "",
  },
  SCHEDULE_EXPIRED: {
    labelText: "Reagendar",
    labelColor: "red",
    warning: "¡Es necesario reagendar!",
  },
  READY_TO_SCHEDULE: {
    labelText: "Agendar",
    warning: "",
  },
  NO_LONGER_AVAILABLE: {
    labelText: "Expirada",
    labelColor: "red",
    warning: "Ya no es posible agendar.",
  },
  NOT_YET_AVAILABLE: {
    labelText: "No disponible",
    warning: "No es posible agendar.",
  },
};

function StudentScheduleLink(props) {
  const { practice, groupId, subjectId } = props;

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const improvedStatus = getScheduleImprovedStatus({
    practiceStartDate: practice?.startDate,
    practiceEndDate: practice?.endDate,
    practiceTimeframe: practice?.timeFrame && practice?.timeFrame * 60 * 1000,
    scheduleTimestamp: practice?.currentStudentSchedule?.timestamp,
    scheduleStatus: practice?.currentStudentSchedule?.status,
  });

  const { labelText, labelColor, warning } = labelData[improvedStatus];

  return (
    <>
      <Grid container direction="row" alignItems="center" spacing={0.5}>
        <Grid item>
          <Typography variant="inherit" color={labelColor} fontWeight="bold">
            {labelText}
          </Typography>
        </Grid>
        {warning && (
          <Grid item>
            <Tooltip
              title={warning}
              color="secondary"
              enterTouchDelay={50}
              style={{ marginTop: "40%", width: "15", height: "auto" }}
              disableFocusListener
              arrow
            >
              <InfoIcon fontSize="inherit" />
            </Tooltip>
          </Grid>
        )}
        <Grid item style={{ flexGrow: "1" }}>
          <Box display="flex" justifyContent="flex-end">
            <IconButton
              aria-label="info"
              color="secondary"
              size="small"
              onClick={openModal}
            >
              <MoreHorizIcon fontSize="inherit" />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
      <StudentScheduleReservationModal
        practice={practice}
        groupId={groupId}
        subjectId={subjectId}
        open={isModalOpen}
        closeModal={closeModal}
        state={improvedStatus}
      />
    </>
  );
}

StudentScheduleLink.propTypes = {
  practice: PropTypes.object.isRequired,
};

export default StudentScheduleLink;
