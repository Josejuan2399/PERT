/* eslint-disable one-var */
import React, {
    useState, useEffect
} from 'react';
import Grid from '@material-ui/core/Grid';

// STYLES
import './styles.css';

// HELPERS
import { PertData } from './logic';
import { isNameRepeated, isAnyFieldEmpty } from '../../functions/helpers';

// COMPONENTS
import { Results } from './Results';
import { Form } from './Form';
import { SnackBarAlert } from '../Global/SnackBarAlert';
import { Graph } from '../Graph';



export default function PERT({ initialData, Perti, setPerti }) {
    // Helpers
    const [wasCalculated, setCalc] = useState(false);

    const [shouldDisplayAlert, setAlert] = useState(false);

    const [alertMsg, setAlertMsg] = useState('');

    // Inputs
    const [adminExpenses, setExpenses] = useState(35000);

    const [budget, setBudget] = useState([]);

    const [data, setData] = useState(initialData);

    // Results
    const [cost, setCost] = useState(0);

    const [criticalPath, setCriticalPath] = useState([]);

    const [duration, setDuration] = useState(0);

    const [expectedTime, setExpectedTime] = useState(0);

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
    };

    const closeAlert = () => {
        setAlert(false);
    };

    function handleData() {
        if (!isValid()) return;
        setPerti(new PertData(adminExpenses, 0, ...data));
    }

    useEffect(() => {
        setCalc(false);
        if (!Perti) return;
        Perti.doAll();
        setDuration(Perti.totalDuration);
        setCriticalPath(Perti.criticalPath);
        setCost(Perti.totalCost);
        setBudget(Perti.budget);
        setExpectedTime(Perti.sumOfExpectedTime);
        setTimeout(() => {
            setCalc(true);
        }, 1);
    }, [Perti]);

    const handleExpenses = ({ target: { value } }) => {
        if (value === '') value = 0;
        setExpenses(parseInt(value));
    };

    const setDataThroughChildren = (newData) => {
        setData(newData);
    };

    const setAlertThroughChildren = (msg) => {
        setAlert(true);
        setAlertMsg(msg);
    };

    function _onSubmit() {
        handleData();
    };

    return (
        <Grid className="App">
            <h1>Tabla para Calculo de PERT</h1>
            <Form onSubmit={handleData} setData={setDataThroughChildren} data={data} setAlert={setAlertThroughChildren} adminExpenses={adminExpenses} handleExpenses={handleExpenses} />
            {wasCalculated && <div>
                <h2>Grafico Resultante</h2>
                <Graph data={Perti} />
                <Results duration={duration} cost={cost} criticalPath={criticalPath} budget={budget} adminExpenses={adminExpenses} expectedTime={expectedTime} Perti={Perti} />
            </div>}
            <SnackBarAlert msg={alertMsg} open={shouldDisplayAlert} onClose={closeAlert} />
        </Grid>
    );
}
