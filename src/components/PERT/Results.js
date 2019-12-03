import React from 'react';

import Grid from '@material-ui/core/Grid';

import { numberWithCommas } from '../../functions/helpers';

export function Results({ Perti }) {
    const { totalDuration, totalCost, criticalPath, sumOfExpectedTime, reTotalDuration, reTotalCost, reSumOfExpectedTime } = Perti;
    return (
        <Grid container flex justify="center" xs>
            <div>
                <h2>Datos Resultantes (Normal)</h2>
                <p><strong>Duracion Total:</strong> {totalDuration} &#177; {sumOfExpectedTime} meses</p>
                <p><strong>Costo Total:</strong> RD${numberWithCommas(totalCost)}</p>
                <span><strong>Ruta Critica:</strong> </span>
                {criticalPath.map(element => <span>{`(${element[0].name})`}</span>)}
            </div>
            <div>
                <h2>Datos Resultantes (Reducidos)</h2>
                <p><strong>Duracion Total:</strong> {reTotalDuration} &#177; {reSumOfExpectedTime} meses</p>
                <p><strong>Costo Total:</strong> RD${numberWithCommas(reTotalCost)}</p>
                <span><strong>Ruta Critica:</strong> </span>
                {criticalPath.map(element => <span>{`(${element[0].name})`}</span>)}
            </div>
        </Grid>
    );
}
