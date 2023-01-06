import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import EditVoyage from './EditVoyage';
import DeleteVoyage from './DeleteVoyage';
import { useForm } from 'react-hook-form';
import { useState } from 'react';


function createData(id_voyage, nom_voyage, type, depart, arrive, voie, id_train, gare_depart, gare_arrive, delay) {
  return {id_voyage, nom_voyage, type, depart, arrive, voie, id_train, gare_depart, gare_arrive, delay};
}


// const rows = [
//   createData('', '', '', '', '', '', '', '', '', ''),
//   createData('', '', '', '', '', '', '', '', '', ''),
//   createData('', '', '', '', '', '', '', '', '', ''),
// ];




export default function VoyageTable() {

    const [voyages, setVoyages] = useState([]);

    React.useEffect(() => {
        async function fetchData() {
        const response = await fetch('http://192.168.151.55:8000/voyage');
        const data = await response.json();
        console.log(data)
        setVoyages(data);
        }
        fetchData();
    }, []);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>id_voyage</TableCell>
            <TableCell>nom_voyage</TableCell>
            <TableCell align="right">type</TableCell>
            <TableCell align="right">depart</TableCell>
            <TableCell align="right">arrive</TableCell>
            <TableCell align="right">voie</TableCell>
            <TableCell align="right">id_train</TableCell>
            <TableCell align="right">gare_depart</TableCell>
            <TableCell align="right">gare_arrive</TableCell>
            <TableCell align="right">delay&nbsp;(min)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {voyages.map((voyage) => (
            <TableRow key={voyage.id_voyage}>
            <TableCell>{voyage.id_voyage}</TableCell>
            <TableCell>{voyage.nom_voyage}</TableCell>
            <TableCell align="right">{voyage.type}</TableCell>
            <TableCell align="right">{voyage.depart}</TableCell>
            <TableCell align="right">{voyage.arrive}</TableCell>
            <TableCell align="right">{voyage.voie}</TableCell>
            <TableCell align="right">{voyage.id_train}</TableCell>
            <TableCell align="right">{voyage.gare_depart}</TableCell>
            <TableCell align="right">{voyage.gare_arrive}</TableCell>
            <TableCell align="right">{voyage.delai}</TableCell>
            <div style={{display: 'flex', justifyContent: 'space-between', margin: '0 10px'}}>
                <EditVoyage voyage={voyage}></EditVoyage>
                <DeleteVoyage voyage={voyage}></DeleteVoyage>
              </div>
            </TableRow>
        ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}