import React, {
  useState
} from 'react';

// STYLES
import './App.css';

// HELPERS
import { calculateTotalCost, calculateTotalDuration, calculateCriticalPath, calculateBudget } from './logic.js';
import { isNameRepeated, isAnyFieldEmpty } from './helpers.js';

// COMPONENTS
import { Results } from './components/Results.js';
import { Form } from './components/Form.js';
import { SnackBarAlert } from './components/SnackBarAlert.js';

import Grid from '@material-ui/core/Grid';

let flatActivitiesDone = [];
let groupedActivitiesDone = [[]];

function App() {
  let [data, setData] = useState([]);
  let [adminExpenses, setExpenses] = useState(0);
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

    if (isAnyFieldEmpty(data)) {
      setAlertMsg('Asegurese de que los campos Nombre, Duracion y Costo no esten vacios');
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
