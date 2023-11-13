import React from "react";
import PracticeStep from "./PracticeStep";
import useStoreContext from "/src/hooks/storeContext";
import { useRouter } from "next/router";
import { logScheduleAction } from "/src/utils/practiceUtils.js";
import {
  Box,
  Button,
  CircularProgress,
  Link,
  Typography,
  Stack,
} from "@mui/material";

function PracticePage({
  socket,
  metadata,
  practiceStatus,
  dataValues,
  queryPageIndex,
  scheduleId,
}) {
  const router = useRouter();
  const [, dispatch] = useStoreContext();

  const [pageIndex, setPageIndex] = React.useState(
    Number(queryPageIndex) > 0 ? Number(queryPageIndex) : 0
  );

  const sendCommand = (command, value) => {
    socket.emit("command", command, value);
  };

  const logCommand = (name) => {
    logScheduleAction(scheduleId, `Se mandó comando: ${name}`);
  };

  const onPreviousStepClick = () => {
    const newPageIndex = pageIndex - 1;
    setPageIndex(newPageIndex);
    router.push(
      {
        pathname: "/practica",
        query: { ...router.query, pageIndex: newPageIndex },
      },
      undefined,
      {
        shallow: true,
      }
    );
  };

  const onNextStepClick = () => {
    const newPageIndex = pageIndex + 1;
    logScheduleAction(scheduleId, `Se empezó el paso ${newPageIndex}`);
    setPageIndex(newPageIndex);
    router.push(
      {
        pathname: "/practica",
        query: { ...router.query, pageIndex: newPageIndex },
      },
      undefined,
      {
        shallow: true,
      }
    );
  };

  const onFinishPractice = () => {
    if (scheduleId) {
      fetch(`/api/schedules/${scheduleId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({ status: "FINISHED" }),
      });
      logScheduleAction(scheduleId, "Se terminó la práctica");
      dispatch({ type: "clearData" });
    }
    socket.close();
    router.replace("/");
  };

  const page = pageIndex > 0 ? metadata.pages[pageIndex - 1] : undefined;

  const pageData =
    page &&
    page.dataIds &&
    page.dataIds.map((dataId) => ({
      ...metadata.data[dataId],
      value: dataValues[dataId],
      id: dataId,
    }));
  const pageActions =
    page &&
    page.actionIds &&
    page.actionIds.map((actionId) => ({
      ...metadata.actions[actionId],
      id: actionId,
    }));
  const pageVideos =
    page &&
    page.videoIds &&
    page.videoIds.map((videoId) => ({
      ...metadata.videos[videoId],
      id: videoId,
    }));

  return (
    <div>
      {pageIndex === 0 ? (
        <>
          <Typography variant="h2">{metadata.name}</Typography>
          <Typography paragraph>{metadata.objective}</Typography>
          {practiceStatus !== "ready" && (
            <Typography paragraph>
              La práctica se está configurando, espera un poco por favor.
            </Typography>
          )}
          {practiceStatus !== "ready" ? (
            <CircularProgress />
          ) : (
            <Button
              size="small"
              variant="contained"
              disabled={practiceStatus !== "ready"}
              onClick={onNextStepClick}
              sx={{ ml: 0, mr: 2 }}
            >
              Empezar práctica
            </Button>
          )}
        </>
      ) : (
        <>
          <Box sx={{ my: 4 }}>
            <PracticeStep
              index={pageIndex}
              instructions={page?.instructions}
              data={pageData}
              actions={pageActions}
              videos={pageVideos}
              sendCommand={sendCommand}
              logCommand={logCommand}
              setPageIndex={setPageIndex}
            />
          </Box>
          <Stack sx={{ my: 2 }} alignItems="flex-end">
            {pageIndex !== metadata.pages.length && (
              <Button size="sm" variant="outlined" onClick={onNextStepClick}>
                Siguiente paso
              </Button>
            )}
            {pageIndex === metadata.pages.length && (
              <Button size="sm" variant="outlined" onClick={onFinishPractice}>
                Terminar práctica
              </Button>
            )}
            {pageIndex !== 1 && (
              <div>
                <Link
                  sx={{ my: 1 }}
                  component="button"
                  onClick={onPreviousStepClick}
                >
                  Paso anterior
                </Link>
              </div>
            )}
          </Stack>
        </>
      )}
    </div>
  );
}

export default PracticePage;
