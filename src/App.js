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
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';

import './App.css';

import { calculateTotalCost, calculateTotalDuration, calculateCriticalPath, Activity, calculateBudget } from './logic.js';
import { isValueInAnotherArray } from './helpers';

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
  let [data, setData] = useState([]);
  let [adminExpenses, setExpenses] = useState(sampleAdminExpenses);
  let [cost, setCost] = useState(0);
  let [duration, setDuration] = useState(0);
  let [criticalPath, setCriticalPath] = useState([]);
  let [budget, setBudget] = useState([]);
  let [wasCalculated, setCalc] = useState(false);

  const handleData = (data) => {
    setDuration(calculateTotalDuration(data, groupedActivitiesDone, flatActivitiesDone));
    setCost(calculateTotalCost(data, duration, adminExpenses));
    setCriticalPath(calculateCriticalPath(groupedActivitiesDone));
    setBudget(calculateBudget(groupedActivitiesDone, adminExpenses));
    setCalc(true);
  }

  return (
    <div className="App">
      <Form onSubmit={handleData} />
      {wasCalculated && <div>
        <div className="horizontal-divisor"></div> <Results duration={duration} cost={cost} criticalPath={criticalPath} budget={budget} />
      </div>}
    </div>
  );
}

// Probably can use this to render a Chip with delete button
function preChip(value, handleDeleteFN = () => { }) {
  return <Chip
    label={value}
    onDelete={handleDeleteFN}
    color="primary"
  />
}

function Form({ onSubmit }) {
  let [data, setData] = useState(sampleData);
  let [names, setName] = useState('');

  function handleChange({ target: { value } }, key, index) {
    let newData = [...data];
    newData[index][key] = key === 'name' ? value : parseInt(value);
    setData(newData);
    console.log(data)
  }

  function addPre({ target: { value } }, index) {
    let newData = [...data];
    newData[index].pre.push(value);
    setData(newData);
    console.log(newData);
  }

  function removePre(activityName, index) {
    let newData = [...data];
    newData[index].pre = newData[index].pre.filter(el => el !== activityName);
    setData(newData);
  }

  function createNewActivity() {
    setData([...data, new Activity('', 0, 0)])
  }

  useEffect(() => {
    // createNewActivity();
    // createNewActivity();
  }, [])


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
        data.map((act, index) => {
          return (
            <TableRow>
              <TableCell > <TextField value={act.name} onChange={event => handleChange(event, 'name', index)}></TextField> </TableCell>
              <TableCell> {index !== 0 &&
                <Select
                  value={act.pre} // Values already Selected
                  onChange={event => { addPre(event, index) }}
                  renderValue={selected => <div>{selected + ''}</div>} // The way that already selected values will be rendered
                >
                  {/* Handles Values in the Selection Menu */}
                  {data.map(({ name }) => (name !== act.name && isValueInAnotherArray(data[index].pre, name)) && <MenuItem value={name}>
                    {name}
                  </MenuItem>)}
                </Select>
              } </TableCell>
              <TableCell > <TextField type="number" value={act.duration} onChange={event => handleChange(event, 'duration', index)}></TextField> </TableCell>
              <TableCell > <TextField type="number" value={act.cost} onChange={event => handleChange(event, 'cost', index)}></TextField> </TableCell>
            </TableRow>
          )
        })
      }
    </TableBody>
    <TableFooter>
      <Grid >
        <IconButton onClick={() => { createNewActivity() }}><AddIcon /></IconButton>
        <IconButton onClick={() => { onSubmit(data) }}><PlayArrowIcon /></IconButton>
      </Grid>
    </TableFooter>

  </Table>)
}

function Results({ duration, cost, criticalPath, budget }) {
  return (
    <div>
      <h1>Resultados</h1>
      <p>Duracion Total: {duration} meses</p>
      <p>Costo Total: RD${cost}</p>
      <span>Ruta Critica: </span>
      {criticalPath.map(element => <span>{`(${element[0].name})` + ' '}</span>)}
      <h2>Presupuesto</h2>
      <Table className="table-sm">
        <TableHead>
          <TableRow>
            <TableCell className="table-cell-sm">Mes</TableCell>
            <TableCell>Costo</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {budget.map((elem, index) => {
            return <TableRow>
              <TableCell>{index}.</TableCell>
              <TableCell>{elem}</TableCell>
            </TableRow>
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export default App;
