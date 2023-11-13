import React from "react";
import PracticeAction from "/src/components/PracticePage/PracticeAction";
import {
  Box,
  Stack,
  Divider,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";

function PracticeStep({
  index,
  instructions,
  data,
  actions,
  videos,
  sendCommand,
  logCommand,
}) {
  return (
    <div>
      <Typography variant="h4">{`Paso ${index}`}</Typography>
      <ul>
        {instructions.map((text, index) => {
          return (
            <li key={index}>
              <Typography>{text}</Typography>
            </li>
          );
        })}
      </ul>
      <Divider sx={{ mt: 4, mb: 4 }} />
      {actions && (
        <Stack spacing={2} alignItems="flex-start">
          {actions.map((action, index) => {
            return (
              <PracticeAction
                key={index}
                action={action}
                logCommand={logCommand}
                sendCommand={sendCommand}
              />
            );
          })}
        </Stack>
      )}
      <Box sx={{ mt: 2, mb: 2 }} />
      {videos &&
        videos.map((video) => {
          const { id, name, url, width } = video;
          return (
            <div key={id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={`Video de ${name}`}
                width={width || "100%" || width}
                src={url}
              />
            </div>
          );
        })}
      <Box sx={{ mb: 2 }} />
      {true && (
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              {data.map((dataItem) => (
                <TableRow hover key={dataItem.id}>
                  <TableCell component="th" scope="row" width="200px">
                    {dataItem.name}
                  </TableCell>
                  <TableCell align="left">
                    {dataItem.labels
                      ? dataItem.labels[dataItem.value]
                      : dataItem.value}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}

export default PracticeStep;
