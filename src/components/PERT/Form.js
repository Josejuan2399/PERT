import React from 'react';

// TABLE
import Table from '@material-ui/core/Table';
import TableFooter from '@material-ui/core/TableFooter';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';

// ICONS
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import CloseIcon from '@material-ui/icons/Close';

import Tooltip from '@material-ui/core/Tooltip';

import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';

// HELPERS
import { isValueInAnotherArray, canRemoveActivity } from '../../functions/helpers';
import { Activity } from './logic';

function PreChips({ data, act, index, addPre, removePre }) {
    return <TableCell >
        {index !== 0 &&
            <Select
                value={act.pre} // Values already Selected
                onChange={event => { addPre(event, index); }}
                renderValue={
                    selected => (
                        <div>
                            {selected.map(value => <Chip color="primary" value={value} label={value} icon={CloseIcon} onDelete={() => removePre(value, index)} />)}
                        </div>
                    )
                }
            >
                {data.map(({ name }) => (name !== act.name && isValueInAnotherArray(data[index].pre, name)) && <MenuItem value={name}>
                    {name}
                </MenuItem>)}
            </Select>
        }
    </TableCell>;
}

export function Form({ onSubmit, data, setData, setAlert, adminExpenses, handleExpenses }) {

    const headers = ['Nombre', 'Prerequisitos', 'Pesima (Normal)', 'Ideal (Normal)', 'Optima (Normal)', 'Costo (Normal)', 'Pesima (Reducido)', 'Ideal (Reducido)', 'Optima (Reducido)', 'Costo (Reducido)', 'Acciones'];

    function handleChange({ target: { value } }, key, index) {
        const newData = [...data];

        newData[index][key] = key === 'name' ? value : parseInt(value);
        setData(newData);
    }

    function handleDurationChange({ target: { value } }, key, index) {
        const newData = [...data];

        newData[index].durations[key] = parseInt(value);
        setData(newData);
    }

    function addPre({ target: { value } }, index) {
        const newData = [...data];

        newData[index].pre.push(value);
        setData(newData);
    }

    function removePre(activityName, index) {
        const newData = [...data];

        newData[index].pre = newData[index].pre.filter(el => el !== activityName);
        setData(newData);
    }

    function removeActivity(activityName) {
        let newData = [...data];

        if (!canRemoveActivity(data, activityName)) {
            setAlert('Esta actividad es prerequisito de otra.');
            return;
        };

        newData = newData.filter(el => el.name !== activityName);
        setData(newData);
    }

    function createNewActivity() {
        setData([...data, new Activity()]);
    }

    return (<Table className="table">
        <TableHead>
            <TableRow>
                {headers.map(head => <TableCell>{head}</TableCell>)}
            </TableRow>
        </TableHead>
        <TableBody>
            {
                data.map((act, index) => {
                    const { worst, medium, best, reWorst, reMedium, reBest } = act.durations;
                    return (
                        <TableRow key={index}>
                            <TableCell >
                                <TextField required={true} value={act.name} onChange={event => handleChange(event, 'name', index)}></TextField>
                            </TableCell>
                            <PreChips data={data} act={act} index={index} addPre={addPre} removePre={removePre} />
                            <TableCell >
                                <TextField type="number" value={worst} onChange={event => handleDurationChange(event, 'worst', index)}></TextField>
                            </TableCell>
                            <TableCell >
                                <TextField type="number" value={medium} onChange={event => handleDurationChange(event, 'medium', index)}></TextField>
                            </TableCell>
                            <TableCell >
                                <TextField type="number" value={best} onChange={event => handleDurationChange(event, 'best', index)}></TextField>
                            </TableCell>
                            <TableCell >
                                <TextField className="cost" type="number" value={act.cost} onChange={event => handleChange(event, 'cost', index)}></TextField>
                            </TableCell>
                            <TableCell >
                                <TextField type="number" value={reWorst} onChange={event => handleDurationChange(event, 'reWorst', index)}></TextField>
                            </TableCell>
                            <TableCell >
                                <TextField type="number" value={reMedium} onChange={event => handleDurationChange(event, 'reMedium', index)}></TextField>
                            </TableCell>
                            <TableCell >
                                <TextField type="number" value={reBest} onChange={event => handleDurationChange(event, 'reBest', index)}></TextField>
                            </TableCell>
                            <TableCell >
                                <TextField className="cost" type="number" value={act.reCost} onChange={event => handleChange(event, 'reCost', index)}></TextField>
                            </TableCell>
                            <TableCell>
                                <Tooltip title="Eliminar Actividad">
                                    <IconButton onClick={() => removeActivity(data[index].name)} > <RemoveIcon></RemoveIcon> </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    );
                })
            }
        </TableBody>
        <TableFooter>
            <Grid style={{ 'min-width': 265 }}>
                <TextField label="Gastos Administrativos" value={adminExpenses} onChange={handleExpenses}></TextField>
                <Tooltip title="Agregar Actividad">
                    <IconButton onClick={() => { createNewActivity(); }}><AddIcon /></IconButton>
                </Tooltip>
                <Tooltip title="Calcular">
                    <IconButton onClick={() => { onSubmit(); }}><PlayArrowIcon /></IconButton>
                </Tooltip>
            </Grid>
        </TableFooter>

    </Table>);
}
