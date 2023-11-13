import React from "react";
import PropTypes from "prop-types";
import {
  Button,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import ProfessorPracticeDetailsModal from "./ProfessorPracticeDetailsModal.js";

const labelData = {
  FINISHED: {
    labelText: "Terminada",
    labelColor: "green",
  },
  STARTED: {
    labelText: "Empezada",
    labelColor: "orange",
  },
  STARTED_EXPIRED: {
    labelText: "Empezada",
    labelColor: "red",
  },
  READY_TO_START: {
    labelText: "Agendada",
    labelColor: "blue",
  },
  SCHEDULE_EXPIRED: {
    labelText: "Agendada",
    labelColor: "red",
  },
  READY_TO_SCHEDULE: {
    labelText: "Por agendar",
    labelColor: "blue",
  },
  NO_LONGER_AVAILABLE: {
    labelText: "Expirada",
    labelColor: "red",
  },
  NOT_YET_AVAILABLE: {
    labelText: "No disponible",
  },
};

function ProfessorPageTable({ groupId, practiceId }) {
  const [studentsPracticeInfo, setStudentsPracticeInfo] = React.useState("");
  const [dataStatus, setDataStatus] = React.useState("");

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [scheduleInfo, setScheduleInfo] = React.useState("");

  const handleOpenModal = (info) => {
    const { timestamp, timeFrame, log } = info;
    setScheduleInfo({ timestamp, timeFrame, log });
    openModal();
  };

  React.useEffect(() => {
    setDataStatus("loading");

    const subjectId = groupId.split("_")[1];
    const groupNumber = groupId.split("_")[2];

    fetch(
      `/api/students?subjectId=${subjectId}&groupNumber=${groupNumber}&practiceId=${practiceId}`,
      { method: "GET" }
    )
      .then((response) => response.json())
      .then((fetchedStudents) => {
        setStudentsPracticeInfo(fetchedStudents);
        setDataStatus("");
      });
  }, [groupId, practiceId]);

  return (
    <>
      <TableContainer
        component={Paper}
        elevation={0}
        variant="outlined"
        sx={{ width: 1 }}
      >
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell>No. Cuenta</TableCell>
              <TableCell align="left">Nombre</TableCell>
              <TableCell align="right">Estado</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataStatus === "loading" ? (
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : studentsPracticeInfo ? (
              studentsPracticeInfo.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: labelData[row.status]?.labelColor,
                      fontWeight: "bold",
                    }}
                  >
                    {labelData[row.status]?.labelText}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      sx={{
                        minHeight: 0,
                        minWidth: 0,
                        padding: 0,
                        textTransform: "none",
                      }}
                      color="secondary"
                      fontWeight="bold"
                      onClick={() => handleOpenModal(row)}
                    >
                      Detalles
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  Sin datos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {isModalOpen && (
        <ProfessorPracticeDetailsModal
          timestamp={scheduleInfo?.timestamp}
          timeFrame={scheduleInfo?.timeFrame}
          log={scheduleInfo?.log}
          open={isModalOpen}
          closeModal={closeModal}
        />
      )}
    </>
  );
}

ProfessorPageTable.propTypes = {
  groupId: PropTypes.string.isRequired,
  practiceId: PropTypes.string.isRequired,
};

export default ProfessorPageTable;
