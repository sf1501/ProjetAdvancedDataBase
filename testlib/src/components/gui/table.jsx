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
                {type === "Departures" ? "Destination" : "Origin"}
              </TableCell>
              <TableCell align="right">
                {type === "Departures" ? "Departure hour" : "Arrival hour"}
              </TableCell>
              <TableCell align="right">Delay</TableCell>
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
                onClick={() => setFocusedObject(row.spaceship_number)}
              >
                <TableCell component="th" scope="row">
                  {row.spaceship_number}
                </TableCell>
                <TableCell align="right">
                  {type === "Departures" ? row.destination : row.origin}
                </TableCell>
                <TableCell align="right">
                  {type === "Departures"
                    ? row.departure_hour
                    : row.arrival_hour}
                </TableCell>
                <TableCell align="right">{row.delay}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
