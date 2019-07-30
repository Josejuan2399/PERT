import React, {useEffect} from 'react';

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

import Tooltip from '@material-ui/core/Tooltip';

import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';

// HELPERS
import { isValueInAnotherArray, canRemoveActivity, hasUniqueName } from '../helpers';
import {Activity} from '../logic.js';

export function Form({ onSubmit, data, setData }) {

    function handleChange({ target: { value } }, key, index) {
        let newData = [...data];
        newData[index][key] = key === 'name' ? value : parseInt(value);
        setData(newData);
    }

    function addPre({ target: { value } }, index) {
        let newData = [...data];
        newData[index].pre.push(value);
        setData(newData);
    }

    function removePre(activityName, index) {
        let newData = [...data];
        newData[index].pre = newData[index].pre.filter(el => el !== activityName);
        setData(newData);
    }

    function removeActivity(activityName) {
        let newData = [...data];

        if (!canRemoveActivity(data, activityName)) {
            alert('Esta actividad es prerequisito de otra.');
            return;
        };

        newData = newData.filter(el => el.name !== activityName);
        setData(newData);
    } // Check if there's an activity that has this one as a prerequisite

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
                <TableCell>Acciones</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {
                data.map((act, index) => {
                    return (
                        <TableRow>
                            <TableCell >
                                <TextField value={act.name} onChange={event => handleChange(event, 'name', index)}></TextField>
                            </TableCell>
                            <TableCell>
                                {index !== 0 &&
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
                                }
                            </TableCell>
                            <TableCell >
                                <TextField type="number" value={act.duration} onChange={event => handleChange(event, 'duration', index)}></TextField>
                            </TableCell>
                            <TableCell >
                                <TextField type="number" value={act.cost} onChange={event => handleChange(event, 'cost', index)}></TextField>
                            </TableCell>
                            <TableCell>
                                <IconButton onClick={() => removeActivity(data[index].name)} > <RemoveIcon></RemoveIcon> </IconButton>
                            </TableCell>
                        </TableRow>
                    )
                })
            }
        </TableBody>
        <TableFooter>
            <Grid>
                <Tooltip title="Agregar Actividad">
                    <IconButton onClick={() => { createNewActivity() }}><AddIcon /></IconButton>
                </Tooltip>
                <Tooltip title="Calcular">
                    <IconButton onClick={() => { onSubmit(data) }}><PlayArrowIcon /></IconButton>
                </Tooltip>
            </Grid>
        </TableFooter>

    </Table>)
}

// Probably can use this to render a Chip with delete button
function preChip(value, handleDeleteFN = () => { }) {
    return <Chip
      label={value}
      onDelete={handleDeleteFN}
      color="primary"
    />
  }