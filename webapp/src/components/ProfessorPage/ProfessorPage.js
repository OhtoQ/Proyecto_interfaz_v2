import React from "react";
import { useSession } from "next-auth/react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
} from "@mui/material";
import ProfessorPageTable from "/src/components/ProfessorPage/ProfessorPageTable";
import Layout from "/src/components/Layout";
import useStoreContext from "/src/hooks/storeContext";
import convertDateToSpanishString from "../../utils/timeUtils";

function ProfessorPage() {
  const [selectedGroupId, setSelectedGroupId] = React.useState("");
  const [selectedPractice, setSelectedPractice] = React.useState("");
  const [currentState, currentDispatch] = useStoreContext();
  const { groups } = currentState;

  const handleGroupChange = (event) => {
    const groupId = event.target.value;
    if (groupId !== null) {
      setSelectedGroupId(groupId);
      setSelectedPractice("");
    }
  };

  let initialDate;
  let finalDate;

  const { status, data } = useSession({
    required: true,
  });

  const user = data?.user;
  const currDateString = convertDateToSpanishString(Date.now());

  React.useEffect(() => {
    if (!groups) {
      fetch("/api/groups")
        .then((response) => response.json())
        .then((fetchedGroups) => {
          currentDispatch({ type: "setGroups", groups: fetchedGroups });
        });
    }
  }, [groups, currentDispatch]);

  if (selectedPractice !== "") {
    initialDate = convertDateToSpanishString(selectedPractice.startDate);
    finalDate = convertDateToSpanishString(selectedPractice.endDate);
  }

  if (status !== "authenticated" || !groups) {
    return <Layout loading />;
  }

  return (
    <Layout>
      <Box my={4}>
        <Typography>
          Bienvenid@ profesor {user?.name}, hoy es {currDateString[0]} a las{" "}
          {currDateString[1]}.
        </Typography>
        <br />
        <Typography variant="h4" mb={2}>
          Grupos
        </Typography>
        <FormControl fullWidth sx={{ my: 1 }}>
          <InputLabel id="select-group-label">Selecciona un grupo</InputLabel>
          <Select
            labelId="select-group-label"
            id="select-group"
            value={selectedGroupId}
            label="Selecciona un grupo"
            onChange={handleGroupChange}
          >
            {groups.map((group) => {
              return (
                <MenuItem key={group.id} value={group.id}>
                  {group.name} {group.groupNumber}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ my: 1 }} disabled={!selectedGroupId}>
          <InputLabel id="select-practice-label">
            Selecciona una práctica
          </InputLabel>
          <Select
            labelId="select-practice-label"
            id="select-practice"
            value={selectedPractice}
            label="Selecciona una práctica"
            onChange={(event) => {
              setSelectedPractice(event.target.value);
            }}
          >
            {groups
              .find((group) => group.id === selectedGroupId)
              ?.practices.map((practice) => {
                return (
                  <MenuItem key={practice.id} value={practice}>
                    {practice.name}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
        {selectedPractice === "" ? (
          <Grid container sx={{ my: 1 }}>
            <Grid item xs={12} md={7} order={{ xs: 2, md: 1 }}>
              <Typography>
                Selecciona un grupo y una práctica para ver los detalles.
              </Typography>
            </Grid>
          </Grid>
        ) : (
          <Grid container sx={{ my: 1 }}>
            <Grid item xs={12} md={7} mb={2} order={{ xs: 2, md: 1 }}>
              <Typography variant="inherit">
                Duración: {selectedPractice.timeFrame} minutos.
              </Typography>
              <Typography variant="inherit">
                Fecha de inicio: {initialDate[0]} a las {initialDate[1]}.
              </Typography>
              <Typography variant="inherit">
                Fecha final: {finalDate[0]} a las {finalDate[1]}.
              </Typography>
            </Grid>
            <Grid item xs={12} md={7} order={{ xs: 2, md: 1 }}>
              <ProfessorPageTable
                groupId={selectedGroupId}
                practiceId={selectedPractice.id}
              />
            </Grid>
          </Grid>
        )}
      </Box>
    </Layout>
  );
}

export default ProfessorPage;
