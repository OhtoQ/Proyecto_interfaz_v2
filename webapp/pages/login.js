import React, { useState } from "react";
import { useRouter } from "next/router";
import { LoadingButton } from "@mui/lab";
import { useSession, signIn } from "next-auth/react";
import { Grid, Paper, TextField, Typography, Box } from "@mui/material";
import Layout from "../src/components/Layout";

export default function Index() {
  const router = useRouter();
  const { status } = useSession();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fetching, setFetching] = useState(false);

  React.useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const paperStyle1 = { height: "45vh", width: 500, margin: "60px auto" };

  const handleSubmit = () => {
    setFetching(true);
    signIn("credentials", {
      username,
      password,
      redirect: false,
    }).then(({ error }) => {
      if (error) {
        setFetching(false);
        setError(error);
      }
    });
  };

  const keyPress = (e) => {
    if (e.keyCode == 13) {
      handleSubmit();
    }
  };

  if (!fetching && status !== "unauthenticated") {
    return <Layout loading />;
  }

  return (
    <Layout>
      <Grid
        container
        item
        component={Paper}
        elevation={10}
        style={paperStyle1}
        direction="column"
        xs={12}
        md={7}
      >
        <Grid item container direction="column">
          <Grid item xs align="center">
            <Box
              sx={{
                bgcolor: "#cd171e",
                color: "white",
                minHeight: "75px",
                border: "1px black",
              }}
            >
              <br />
              <Typography variant="h5" sx={{ flexGrow: 1 }}>
                Iniciar Sesión
              </Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box sx={{ margin: "20px" }}>
              <TextField
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={keyPress}
                label="Username"
                size="small"
                fullWidth
                required
                variant="filled"
              />
              <TextField
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={keyPress}
                label="Password"
                size="small"
                type="password"
                fullWidth
                required
                variant="filled"
                sx={{ pt: "5px" }}
              />
              {error && (
                <Typography sx={{ color: "error.main", pt: "5px" }}>
                  Usuario o contraseña no válidos
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item>
            <Box sx={{ mx: "20px", mb: "10px" }}>
              <LoadingButton
                onClick={handleSubmit}
                type="submit"
                sx={{
                  bgcolor: "#cd171e",
                  "&:hover": { bgcolor: "#cd171e" },
                  color: "white",
                }}
                variant="contained"
                fullWidth
                loading={fetching}
              >
                Ingresar
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  );
}
