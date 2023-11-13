import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button, Stack, TextField, Typography } from "@mui/material";
import Layout from "../src/components/Layout";

export default function Index() {
  const router = useRouter();
  const { ip: queryIp } = router.query;

  const [serverIp, setServerIp] = useState(queryIp || "");

  useEffect(() => {
    if (queryIp) {
      setServerIp(queryIp);
    }
  }, [queryIp, setServerIp]);

  const handleSubmit = () => {
    router.push(`/practica?ip=${serverIp || "localhost:8000"}`);
  };

  const keyPress = (e) => {
    if (e.keyCode == 13) {
      handleSubmit();
    }
  };

  return (
    <Layout>
      <Typography variant="h2" sx={{ mt: 4 }}>
        Conectarse a un servidor directamente
      </Typography>
      <Stack spacing={2} sx={{ mt: 4, maxWidth: "400px" }}>
        <TextField
          value={serverIp}
          onChange={(e) => setServerIp(e.target.value)}
          onKeyDown={keyPress}
          label="Ip del servidor a conectarse"
          size="small"
          fullWidth
          required
          variant="filled"
        />
        <Button
          onClick={handleSubmit}
          type="submit"
          sx={{
            bgcolor: "#cd171e",
            "&:hover": { bgcolor: "#cd171e" },
            color: "white",
          }}
          variant="contained"
          fullWidth
        >
          Conectarse
        </Button>
        <Typography variant="p" sx={{ mt: 4 }}>
          En caso de no colocar ninguno se usará el valor por defecto:
          localhost:8000
        </Typography>
      </Stack>
    </Layout>
  );
}
