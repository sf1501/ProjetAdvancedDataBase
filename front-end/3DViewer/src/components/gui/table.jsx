import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { useSetRecoilState } from "recoil";
import { focusedObjectState } from "../../atoms";

export default function InfoTable({ type, rows }) {
  const setFocusedObject = useSetRecoilState(focusedObjectState);
  return (
    <>
      <span>{type}</span>
      <TableContainer component={Paper} id="info">
        <Table sx={{}} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Spaceship number</TableCell>
              <TableCell align="right">
                {type === "Departures" ? "gare_arrive" : "Origin"}
              </TableCell>
              <TableCell align="right">
                {type === "Departures" ? "Departure hour" : "Arrival hour"}
              </TableCell>
              <TableCell align="right">delai</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, id) => (
              <TableRow
                hover
                key={id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  height: 15,
                  maxHeight: 15,
                }}
                onClick={() => setFocusedObject(row.nom_voyage)}
              >
                <TableCell component="th" scope="row">
                  {row.nom_voyage}
                </TableCell>
                <TableCell align="right">
                  {type === "Departures" ? row.gare_arrive : row.gare_depart}
                </TableCell>
                <TableCell align="right">
                  {type === "Departures" ? row.depart : row.arrive}
                </TableCell>
                <TableCell align="right">{row.delai}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
