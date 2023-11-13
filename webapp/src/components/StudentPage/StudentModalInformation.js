import React from "react";
import { Box, Button, Typography } from "@mui/material";
import convertDateToSpanishString from "../../utils/timeUtils";

function StudentModalInformation(props) {
  const { practice, state, changeModalState } = props;

  const startDate = practice.startDate;
  const currentStudentScheduleTimestamp =
    practice?.currentStudentSchedule?.timestamp;

  // Days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
  const reserveTime = 7 * 24 * 60 * 60 * 1000;

  const scheduleString = convertDateToSpanishString(
    currentStudentScheduleTimestamp
  );
  const schedulingDate = convertDateToSpanishString(startDate - reserveTime);
  const initialDate = convertDateToSpanishString(practice.startDate);
  const finalDate = convertDateToSpanishString(practice.endDate);

  let text;

  switch (state) {
    case "FINISHED":
    case "READY_TO_START":
    case "SCHEDULE_EXPIRED":
      text = `Fue agendada para el ${scheduleString[0]} a las ${scheduleString[1]}.`;
      break;
    case "STARTED":
      text = `Fue agendada para el ${scheduleString[0]} a las ${scheduleString[1]}. No ha sido terminada.`;
      break;
    case "STARTED_EXPIRED":
      text = `Fue agendada para el ${scheduleString[0]} a las ${scheduleString[1]}. No se terminó en el tiempo especificado.`;
      break;
    case "READY_TO_SCHEDULE":
      text = "Aún no ha sido agendada.";
      break;
    case "NO_LONGER_AVAILABLE":
      text = "No fue agendada. Ya no está disponible";
      break;
    case "NOT_YET_AVAILABLE":
      text = `Estará disponible para agendar a partir del ${schedulingDate[0]} a las ${schedulingDate[1]}.`;
      break;
    default:
      break;
  }

  const enableRescheduleButton = [
    "STARTED_EXPIRED",
    "SCHEDULE_EXPIRED",
    "READY_TO_START",
    "READY_TO_SCHEDULE",
  ].includes(state);

  return (
    <>
      <Typography id="modal-modal-title" variant="h6" component="h2" mb={2}>
        Información sobre la práctica
      </Typography>
      <Typography variant="inherit">
        Duración: {practice.timeFrame} minutos.
      </Typography>
      <Typography variant="inherit">
        Fecha de inicio: {initialDate[0]} a las {initialDate[1]}.
      </Typography>
      <Typography variant="inherit">
        Fecha final: {finalDate[0]} a las {finalDate[1]}.
      </Typography>
      <Typography variant="inherit" mb={2} fontWeight="bold">
        {text}
      </Typography>
      {enableRescheduleButton && (
        <Box textAlign="center">
          <Button
            variant="contained"
            onClick={() => {
              changeModalState();
            }}
          >
            {state === "READY_TO_SCHEDULE" ? "Agendar" : "Reagendar"}
          </Button>
        </Box>
      )}
    </>
  );
}

export default StudentModalInformation;
