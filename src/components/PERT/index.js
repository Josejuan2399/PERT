import React, {
    useState, useEffect
} from 'react';

// STYLES
import './styles.css';

// HELPERS
import { Activity, PertData } from './functions/logic.js';
import { isNameRepeated, isAnyFieldEmpty } from '../../functions/helpers.js';

// COMPONENTS
import { Results } from './Results.js';
import { Form } from './Form.js';
import { SnackBarAlert } from '../Global/SnackBarAlert.js';

import Grid from '@material-ui/core/Grid';

const mock = [
    new Activity('A', 1, 2, 3, 100000),
    new Activity('B', 4, 5, 6, 1000000, 'A'),
    new Activity('C', 2, 3, 4, 500000, 'A'),
    new Activity('D', 5, 6, 7, 900000, 'B', 'C'),
    new Activity('E', 3, 4, 5, 700000, 'D')
]

export default function PERT({ label }) {
    // Helpers
    let [wasCalculated, setCalc] = useState(false);
    let [shouldDisplayAlert, setAlert] = useState(false);
    let [alertMsg, setAlertMsg] = useState('');

    // Inputs
    let [adminExpenses, setExpenses] = useState(35000);
    let [budget, setBudget] = useState([]);
    let [data, setData] = useState(mock);

    // Results
    let [cost, setCost] = useState(0);
    let [criticalPath, setCriticalPath] = useState([]);
    let [duration, setDuration] = useState(0);
    let [expectedTime, setExpectedTime] = useState(0);

    let [Perti, setPerti] = useState();

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
        setPerti(new PertData(adminExpenses, ...data));
    }

    useEffect(() => {
        if (!Perti) return;
        Perti.doAll();
        setDuration(Perti.totalDuration);
        setCriticalPath(Perti.criticalPath);
        setCost(Perti.totalCost);
        setBudget(Perti.budget);
        setExpectedTime(Perti.sumOfExpectedTime);
        setCalc(true);
    }, [Perti])

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
            <h1>{label}</h1>
            <Form onSubmit={handleData} setData={setDataThroughChildren} data={data} setAlert={setAlertThroughChildren} adminExpenses={adminExpenses} handleExpenses={handleExpenses} />
            {wasCalculated && <div>
                <Results duration={duration} cost={cost} criticalPath={criticalPath} budget={budget} adminExpenses={adminExpenses} expectedTime={expectedTime} />
            </div>}
            <SnackBarAlert msg={alertMsg} open={shouldDisplayAlert} onClose={closeAlert} />
        </Grid>
    );
}
