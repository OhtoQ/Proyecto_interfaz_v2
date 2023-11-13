import React from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import StudentScheduleLink from "/src/components/StudentPage/StudentScheduleLink.js";
import PropTypes from "prop-types";
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

function StudentGroupsTableRow({ group }) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {group.subjectId}
        </TableCell>
        <TableCell align="left">{group.name}</TableCell>
        <TableCell align="right">{group.groupNumber}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ padding: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 0 }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell width="5%">No.</TableCell>
                    <TableCell width="30%">Nombre</TableCell>
                    <TableCell width="65%">Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {group?.practices.map((practiceRow, idx) => (
                    <TableRow key={practiceRow.id}>
                      <TableCell component="th" scope="row">
                        {idx + 1}
                      </TableCell>
                      <TableCell>{practiceRow.name}</TableCell>
                      <TableCell>
                        <StudentScheduleLink
                          practice={practiceRow}
                          groupId={group.id}
                          subjectId={group.subjectId}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

StudentGroupsTableRow.propTypes = {
  group: PropTypes.shape({
    id: PropTypes.string.isRequired,
    subjectId: PropTypes.string.isRequired,
    groupNumber: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    practices: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        practiceNumber: PropTypes.number,
        name: PropTypes.string.isRequired,
        startDate: PropTypes.number.isRequired,
        endDate: PropTypes.number.isRequired,
        currentStudentSchedule: PropTypes.shape({
          practiceId: PropTypes.string.isRequired,
          status: PropTypes.string.isRequired,
          studentId: PropTypes.string.isRequired,
          subjectId: PropTypes.string.isRequired,
          timestamp: PropTypes.number.isRequired,
        }),
      })
    ).isRequired,
  }).isRequired,
};

export default StudentGroupsTableRow;
