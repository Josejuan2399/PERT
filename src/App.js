import React, {
  useState, useEffect
} from 'react';

import Table from '@material-ui/core/Table';
import TableFooter from '@material-ui/core/TableFooter';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

import './App.css';

import { calculateTotalCost, calculateTotalDuration, calculateCriticalPath, Activity } from './logic.js';

let sampleData = [
  new Activity("A", 10, 100000),
  new Activity("B", 5, 500000),
  new Activity("C", 1, 1000000, "A", "B"),
  new Activity("D", 9, 2000000, "C"),
  new Activity("E", 7, 800000, "C"),
  new Activity("F", 1, 1500000, "D", "E"),
  new Activity("G", 4, 600000, "D", "E")
];

let flatActivitiesDone = [];
let groupedActivitiesDone = [[]];
let sampleAdminExpenses = 50000;

function App() {
  let [data, setData] = useState(sampleData);
  let [adminExpenses, setExpenses] = useState(sampleAdminExpenses);
  let [cost, setCost] = useState(0);
  let [duration, setDuration] = useState(0);
  let [criticalPath, setCriticalPath] = useState([]);
  let [wasCalculated, setCalc] = useState(false);

  const handleData = (data) => {
    setDuration(calculateTotalDuration(data, groupedActivitiesDone, flatActivitiesDone));
    setCost(calculateTotalCost(data, duration, adminExpenses));
    setCriticalPath(calculateCriticalPath(groupedActivitiesDone));
    setCalc(true);
  }

  return (
    <div className="App">
      <Form onSubmit={handleData} />
      {wasCalculated && <div>
        <div className="horizontal-divisor"></div> <Results duration={duration} cost={cost} criticalPath={criticalPath} />
      </div>}
    </div>
  );
}



function Form({ onSubmit }) {
  let [data, setData] = useState(sampleData);
  let [names, setName] = useState('');

  function handleChange({ target: { value } }, key, index) {
    let newData = [...data];
    newData[index][key] = value;
    setData(newData);
    console.log(data)
  }

  return (<Table className="table">
    <TableHead>
      <TableRow>
        <TableCell>Nombre</TableCell>
        <TableCell>Prerequisitos</TableCell>
        <TableCell>Duracion</TableCell>
        <TableCell>Costo</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {
        data.map((d, index) => {
          return (
            <TableRow>
              <TableCell > <TextField value={data[index].name} onChange={event => handleChange(event, 'name', index)}></TextField> </TableCell>
              <TableCell> {index !== 0 && <p>woot</p>} </TableCell>
              <TableCell > <TextField type="number" value={data[index].duration} onChange={event => handleChange(event, 'duration', index)}></TextField> </TableCell>
              <TableCell > <TextField type="number" value={data[index].cost} onChange={event => handleChange(event, 'cost', index)}></TextField> </TableCell>
            </TableRow>
          )
        })
      }
    </TableBody>
    <TableFooter>
      <Grid >
        <IconButton><AddIcon onClick={() => setData([...data, new Activity('', 0, 0, [])])} /></IconButton>
        <IconButton><PlayArrowIcon /></IconButton>
      </Grid>
    </TableFooter>

  </Table>)
}

function Results({ duration, cost, criticalPath }) {
  return (
    <div>
      <h1>Resultados</h1>
      <p>Duracion Total: {duration} meses</p>
      <p>Costo Total: RD${cost}</p>
      <span>Ruta Critica: </span>
      {criticalPath.map(element => <span>{element[0].name}</span>)}
    </div>
  )
}

export default App;
