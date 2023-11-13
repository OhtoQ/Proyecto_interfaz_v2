import React from "react";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import useSocket from "/src/hooks/useSocket";
import PracticePage from "/src/components/PracticePage/PracticePage";
import Layout from "/src/components/Layout";
import url from "url";
import MuiAlert from "@mui/material/Alert";
import {
  AppBar,
  Box,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Toolbar,
  Typography,
  Snackbar,
} from "@mui/material";

// "Server only" imports
import { getSession } from "next-auth/react";
import { getSchedulePracticeIp } from "/src/lib/database";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Index({ ip: practiceIp, queryPageIndex, scheduleId }) {
  const [socket, setSocket] = React.useState();

  const {
    connect,
    isConnected,
    metadata,
    practiceStatus,
    dataValues,
    errorMessage,
    showErrorMessage,
    clearErrorMessage,
  } = useSocket();

  React.useEffect(() => {
    let newSocket;

    if (practiceIp) {
      newSocket = connect(practiceIp, {
        user: "admin",
        password: "admin",
        // Si queremos empezar en un paso especifico
        // no reiniciamos la práctica
        initialize: !!queryPageIndex,
      });
      setSocket(newSocket);
    }

    return () => {
      newSocket?.disconnect();
    };
  }, [practiceIp, connect, queryPageIndex]);

  if (!practiceIp) {
    return <Layout loading />;
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Laboratorio Remoto
          </Typography>
          <Box mr={1} alignItems="center">
            {isConnected ? <CheckIcon /> : <ClearIcon />}
          </Box>
          <Typography variant="h6" component="div">
            {isConnected ? "Conectado" : "Desconectado"}
          </Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ paddingTop: 2 }}>
        {metadata && (
          <PracticePage
            socket={socket}
            metadata={metadata}
            practiceStatus={practiceStatus}
            dataValues={dataValues}
            queryPageIndex={queryPageIndex}
            scheduleId={scheduleId}
            errorMessage={errorMessage}
            clearErrorMessage={clearErrorMessage}
          />
        )}
      </Container>
      {!isConnected && (
        <Dialog onClose={() => {}} open={true}>
          <DialogTitle>Desconectado</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Hay un problema con la conexión, intentado conectar nuevamente.
            </DialogContentText>
          </DialogContent>
          <DialogContent>
            <CircularProgress />
          </DialogContent>
        </Dialog>
      )}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={showErrorMessage}
        autoHideDuration={6000}
        onClose={clearErrorMessage}
      >
        <Alert
          onClose={clearErrorMessage}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export async function getServerSideProps({ req }) {
  const {
    ip: queryIp,
    schedule: scheduleId,
    pageIndex,
  } = url.parse(req.url, true).query;

  let schedulePracticeIp;

  const session = await getSession({ req });

  if (session && scheduleId && !queryIp) {
    schedulePracticeIp = await getSchedulePracticeIp({ scheduleId });
  }

  return {
    props: {
      ip: queryIp || schedulePracticeIp,
      queryPageIndex: pageIndex || null,
      scheduleId: scheduleId || null,
    },
  };
}

export default Index;
