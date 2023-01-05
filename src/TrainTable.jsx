import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Edit from './Edit';
import Delete from './Delete';

function createData(name, departure_station, destination_station, departure_time, arrival_time, delay) {
  return { name, departure_station, destination_station, departure_time, arrival_time, delay };
}


const rows = [
  createData('Spaceship1', 'Mercure', 'Terre', '13:30', '18:30'),
  createData('Spaceship2', 'Venus', 'Terre', '14:30', '18:30'),
  createData('Spaceship3', 'Mars', 'Uranus', '13:30', '20:30', '+5'),
  createData('Spaceship4', 'Saturne', 'Terre', '13:30', '19:30','+10'),
  createData('Spaceship5', 'Neptune', 'Mercure', '12:30', '18:30','+30'),
];


export default function TrainTable() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Names</TableCell>
            <TableCell align="right">departure_station</TableCell>
            <TableCell align="right">destination_station</TableCell>
            <TableCell align="right">departure_time</TableCell>
            <TableCell align="right">arrival_time</TableCell>
            <TableCell align="right">delay&nbsp;(min)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.departure_station}</TableCell>
              <TableCell align="right">{row.destination_station}</TableCell>
              <TableCell align="right">{row.departure_time}</TableCell>
              <TableCell align="right">{row.arrival_time}</TableCell>
              <TableCell align="right">{row.delay}</TableCell>
              {console.log(row)}
              <div style={{display: 'flex', justifyContent: 'space-between', margin: '0 10px'}}>
                <Edit row={row}></Edit>
                <Delete></Delete>
              </div>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}