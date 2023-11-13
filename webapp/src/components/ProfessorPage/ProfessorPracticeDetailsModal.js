import React from "react";
import { Box, IconButton, Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getFullReservationDate } from "../../utils/reservationUtils.js";

function ProfessorPracticeDetailsModal(props) {
  const { timestamp, timeFrame, log, open, closeModal } = props;

  const styleModal = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 2,
    p: 4,
  };

  const styleCloseButton = {
    position: "absolute",
    top: "0%",
    right: "0%",
  };

  let scheduleDateString;

  if (timestamp) {
    const fullReservationString = getFullReservationDate(timestamp, timeFrame);
    scheduleDateString = `${fullReservationString[0]} de las ${fullReservationString[1]} a las ${fullReservationString[2]}.`;
  } else {
    scheduleDateString = "el alumno no ha reservado ningún horario.";
  }

  function getDateString(date) {
    return `${date.getFullYear().toString().padStart(4, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")} ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;
  }

  return (
    <Modal
      open={open}
      onClose={closeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={styleModal} width={{ md: "50%", sm: "70%", xs: "95%" }}>
        <IconButton sx={styleCloseButton} onClick={closeModal} color="primary">
          <CloseIcon />
        </IconButton>
        <Typography mb={2}>
          <strong>Horario reservado: </strong>
          {scheduleDateString}
        </Typography>
        <Typography mb={1} fontWeight="bold">
          El registro de actividades es el siguiente:
        </Typography>
        {log.length > 0 ? (
          log.map(({ date, message }) => (
            <Typography key={date}>
              <strong>{getDateString(new Date(date))}</strong>: {message}
            </Typography>
          ))
        ) : (
          <Typography>No existe registro.</Typography>
        )}
      </Box>
    </Modal>
  );
}

export default ProfessorPracticeDetailsModal;
