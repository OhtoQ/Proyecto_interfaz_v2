import React from "react";
import { useSession } from "next-auth/react";
import { Box, Button, Grid, Typography } from "@mui/material";
import Layout from "/src/components/Layout";
import useStoreContext from "/src/hooks/storeContext";
import convertDateToSpanishString from "/src/utils/timeUtils";
import StudentGroupsTable from "./StudentGroupsTable";
import { useRouter } from "next/router";
import { logScheduleAction, updateSchedule } from "/src/utils/practiceUtils.js";

function StudentPage() {
  const router = useRouter();

  const [state, dispatch] = useStoreContext();
  const { groups, nearestPractice } = state;

  const { status, data } = useSession({
    required: true,
  });

  const user = data?.user;

  React.useEffect(() => {
    if (groups) {
      dispatch({ type: "calculateNearestPractice" });
    }
  }, [groups, dispatch]);

  React.useEffect(() => {
    if (!groups) {
      fetch("/api/groups")
        .then((response) => response.json())
        .then((fetchedGroups) => {
          dispatch({ type: "setGroups", groups: fetchedGroups });
        });
    }
  }, [groups, dispatch]);

  const startNearestPractice = () => {
    const scheduleId = nearestPractice?.schedule?._id;
    updateSchedule(scheduleId, { status: "STARTED" });
    logScheduleAction(scheduleId, "Se inició la práctica");
    router.push(`/practica?schedule=${scheduleId}`);
  };

  const currDate = Date.now();
  const currDateString = convertDateToSpanishString(currDate);

  if (status !== "authenticated" || !groups) {
    return <Layout loading />;
  }

  return (
    <Layout>
      <Box my={4}>
        <Typography>
          Bienvenid@ {user?.name}, hoy es {currDateString[0]} a las{" "}
          {currDateString[1]}.
        </Typography>
        <br />
        <Typography variant="h4" mb={2}>
          Prácticas disponibles
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={7} order={{ xs: 2, md: 1 }}>
            <StudentGroupsTable groups={groups} />
          </Grid>
          <Grid item xs={12} md={5} order={{ xs: 1, md: 2 }}>
            <Typography variant="h6">Próxima práctica:</Typography>
            {nearestPractice &&
            nearestPractice?.schedule?.status !== "FINISHED" ? (
              <>
                <Typography variant="body1">
                  Práctica no. {nearestPractice.practiceNumber} &quot;
                  {nearestPractice.name}&quot; de {nearestPractice.subjectId} -{" "}
                  {nearestPractice.groupName}, el día{" "}
                  {nearestPractice.dateString[0]} a las{" "}
                  {nearestPractice.dateString[1]} horas.
                </Typography>
                <br />
                <Button variant="contained" onClick={startNearestPractice}>
                  Ir a la práctica
                </Button>
              </>
            ) : (
              <Typography variant="body1">
                No hay prácticas agendadas disponibles.
              </Typography>
            )}
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}

export default StudentPage;
