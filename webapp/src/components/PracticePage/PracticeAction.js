import React from "react";
import {
  Box,
  Button,
  Slider,
  Switch,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormGroup,
  FormControl,
  FormControlLabel,
  InputLabel,
} from "@mui/material";

function PracticeAction({ action, logCommand, sendCommand }) {
  const { type, id, name } = action;

  if (!type || type === "button") {
    return (
      <Button
        size="small"
        variant="outlined"
        onClick={() => {
          logCommand(name);
          sendCommand(id);
        }}
        sx={{ ml: 0, mr: 2 }}
      >
        {name}
      </Button>
    );
  }

  if (type === "toggle") {
    return (
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              defaultChecked
              onChange={(event) => {
                logCommand(name);
                sendCommand(id, event.target.checked);
              }}
            />
          }
          label={name}
        />
      </FormGroup>
    );
  }

  if (type === "slider") {
    const { minValue, maxValue, step } = action;
    return (
      <Paper variant="outlined">
        <Box
          sx={{
            display: "block",
            alignItems: "center",
            px: 2,
            pt: 1,
            minWidth: "300px",
          }}
        >
          <Typography>{name}</Typography>
          <Slider
            defaultValue={minValue}
            valueLabelDisplay="auto"
            step={step}
            min={minValue}
            max={maxValue}
            onChange={(e) => {
              sendCommand(id, e.target.value);
            }}
          />
        </Box>
      </Paper>
    );
  }

  if (type === "selector") {
    const { values } = action;
    return (
      <FormControl sx={{ width: 400 }}>
        <InputLabel id="select-group-label">{name}</InputLabel>
        <Select
          labelId="select-group-label"
          id="select-group"
          label={name}
          onChange={(e) => {
            logCommand(name);
            sendCommand(id, e.target.value);
          }}
          defaultValue=""
        >
          {Object.keys(values).map((valueId) => {
            return (
              <MenuItem key={valueId} value={valueId}>
                {values[valueId]}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    );
  }

  return (
    <Paper variant="outlined">
      <Typography>Tipo de sensor no soportado</Typography>
    </Paper>
  );
}

export default PracticeAction;
