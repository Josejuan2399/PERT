import React, {
    useState, useEffect
} from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

export function Results({ duration, cost, criticalPath, budget, adminExpenses }) {
    return (
        <div>
            <h1>Resultados</h1>
            <p>Duracion Total: {duration} meses</p>
            <p>Costo Total: RD${cost + (adminExpenses * duration)}</p>
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
                            <TableCell>{index + 1}.</TableCell>
                            <TableCell>RD${elem}</TableCell>
                        </TableRow>
                    })}
                </TableBody>
            </Table>
        </div>
    )
}