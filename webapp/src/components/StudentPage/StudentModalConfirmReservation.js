import React from "react";
import { Box, Button, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

function StudentModalConfirmReservation(props) {
  const {
    reserveSchedule,
    newDateString,
    reservationSuccess,
    resetModal,
    closeModal,
  } = props;
  const [isLoading, setIsLoading] = React.useState(false);
  const [reservationState, changeReservationState] = React.useState("init");

  let action;

  React.useEffect(() => {
    if (reservationSuccess == true) {
      changeReservationState("success");

      const timer = setTimeout(() => {
        resetModal(0);
        closeModal();
      }, 1500);

      return () => clearTimeout(timer);
    } else if (reservationSuccess == false) {
      changeReservationState("fail");
    }
  }, [closeModal, reservationSuccess, resetModal]);

  if (reservationState === "init") {
    action = (
      <LoadingButton
        loading={isLoading}
        variant="contained"
        onClick={() => {
          setIsLoading(true);
          reserveSchedule();
        }}
      >
        Confirmar
      </LoadingButton>
    );
  } else if (reservationState === "success") {
    action = (
      <Button
        variant="contained"
        color="success"
        startIcon={<CheckIcon />}
        onClick={() => {
          resetModal(0);
          closeModal();
        }}
      >
        ¡Éxito!
      </Button>
    );
  } else if (reservationState === "fail") {
    action = (
      <>
        <Typography fontWeight="bold" color="red" mt={2} mb={1}>
          ¡Error!
        </Typography>
        <Typography mb={2}>
          No se pudo reservar el horario, inténtelo más tarde.
        </Typography>
        <Button
          variant="contained"
          startIcon={<CloseIcon />}
          onClick={() => {
            resetModal(0);
            closeModal();
          }}
        >
          Entendido
        </Button>
      </>
    );
  }

  return (
    <>
      <Typography id="modal-modal-title" variant="h6" component="h2" mb={2}>
        ¿Reservar el horario seleccionado?
      </Typography>
      <Typography id="modal-modal-description" mb={2}>
        Podrás cambiar el horario más adelante, siempre que queden horarios
        libres.
      </Typography>
      <Typography id="modal-modal-description" mb={3} fontStyle="italic">
        Horario seleccionado: {newDateString[0]} a las {newDateString[1]}.
      </Typography>
      <Box textAlign="center">{action}</Box>
    </>
  );
}

export default StudentModalConfirmReservation;
