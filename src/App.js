import React, {
  useState
} from 'react';

// STYLES
import './App.css';

// HELPERS
import { calculateTotalCost, calculateTotalDuration, calculateCriticalPath, Activity, calculateBudget } from './logic.js';
import { isNameRepeated, anyNameEmpty } from './helpers.js';

// COMPONENTS
import { Results } from './components/Results.js';
import { Form } from './components/Form.js';
import { SnackBarAlert } from './components/SnackBarAlert.js';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

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
  let [criticalPath, setCriticalPath] = useState();
  let [budget, setBudget] = useState([]);
  let [wasCalculated, setCalc] = useState(false);
  let [shouldDisplayAlert, setAlert] = useState(false);
  let [alertMsg, setAlertMsg] = useState('');

  const isValid = () => {
    if (isNameRepeated(data)) {
      setAlertMsg('Hay 2 o mas actividades con el mismo nombre.');
      setAlert(true);
      return false;
    }

    if (anyNameEmpty(data)) {
      setAlertMsg('Hay 1 o mas actividades sin nombre.');
      setAlert(true);
      return false;
    }
    return true;
  }

  const closeAlert = () => {
    setAlert(false);
  }

  function handleData() {
    if (!isValid()) return;
    setDuration(calculateTotalDuration(data, groupedActivitiesDone, flatActivitiesDone));
    setCriticalPath(calculateCriticalPath(groupedActivitiesDone));
    setCost(calculateTotalCost(data));
    setBudget(calculateBudget(groupedActivitiesDone, adminExpenses));
    flatActivitiesDone = [];
    groupedActivitiesDone = [[]];
    setCalc(true);
  }

  const handleExpenses = ({ target: { value } }) => {
    if (value === '') value = 0;
    setExpenses(parseInt(value));
  }

  const setDataThroughChildren = (newData) => {
    setData(newData);
  }

  const setAlertThroughChildren = (msg) => {
    setAlert(true);
    setAlertMsg(msg)
  }

  return (
    <Grid className="App">
      <h1>Metodo de la Ruta Critica</h1>
      <Form onSubmit={handleData} setData={setDataThroughChildren} data={data} setAlert={setAlertThroughChildren} adminExpenses={adminExpenses} handleExpenses={handleExpenses} />
      {wasCalculated && <div>
        <Results duration={duration} cost={cost} criticalPath={criticalPath} budget={budget} adminExpenses={adminExpenses} />
      </div>}
      <SnackBarAlert msg={alertMsg} open={shouldDisplayAlert} onClose={closeAlert} />
    </Grid>
  );
}

export default App;
