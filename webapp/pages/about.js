import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { List, ListItem, ListItemText } from "@mui/material";
import Link from "../src/components/Link";

export default function Index() {
  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Acerca de Laboratorio Remoto FI
        </Typography>
        <Typography variant="body1" gutterBottom>
          Interfaz gráfica que permite conectar a los alumnos de la facultad de
          ingeniería de la UNAM a las prácticas de laboratorio remoto. Versión
          0.0.1.
        </Typography>
        <Typography variant="body1">Desarrolladores:</Typography>
        <List>
          <ListItem>
            <ListItemText primary="Manuel Lara" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Nathaniel Ceballos" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Alejandro Puga" />
          </ListItem>
        </List>
        <Link href="/">Regresar</Link>
      </Box>
    </Container>
  );
}
