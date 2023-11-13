import React from "react";
import StudentGroupsTableRow from "./StudentGroupsTableRow";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

function StudentGroupsTable({ groups }) {
  return (
    <TableContainer component={Paper} sx={{ width: 1 }}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Clave</TableCell>
            <TableCell>Materia</TableCell>
            <TableCell align="right">Grupo</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {groups.map((group) => (
            <StudentGroupsTableRow key={group.id} group={group} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default StudentGroupsTable;
