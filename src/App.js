import React, {useState
} from 'react';
import './App.css';
import { calculateTotalCost, calculateTotalDuration, calculateCriticalPath, Activity } from './logic.js';
import { spawn } from 'child_process';

const data = [
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
let adminExpenses = 50000;
const totalDuration = calculateTotalDuration(data, groupedActivitiesDone, flatActivitiesDone);
const totalCost = calculateTotalCost(data, totalDuration,adminExpenses);
const criticalPath = calculateCriticalPath(groupedActivitiesDone);

function App() {
  let [count, setCount] = useState(0);
  return (
    <div className="App">
      <Results duration={totalDuration} cost={totalCost} criticalPath={criticalPath}/>
    </div>
  );
}

function Results({duration, cost, criticalPath}) {
  return (
    <div>
      <p>Duracion Total: {duration} meses</p>
      <p>Costo Total: RD${cost}</p>
      <span>Ruta Critica: </span>
      {criticalPath.map(element => <span>{element[0].name}</span>)}
    </div>
  )
}

export default App;
