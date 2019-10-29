
import React from 'react';

import SnackBar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

// ICONS
import ErrorIcon from '@material-ui/icons/Error';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

export function SnackBarAlert({ msg, open, onClose }) {
    return <SnackBar
        open={open}
        autoHideDuration={3000}
        onClose={onClose}
        variant="error"
        style={styles.snackbar}
    >
        <SnackbarContent
            style={styles.snackbarContent}
            message={
                <span>
                    <ErrorIcon />
                    <span style={styles.snackbarContentSpan}> {msg}</span>
                </span>
            }
            onClose={onClose}
            action={[
                <IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
                    <CloseIcon />
                </IconButton>,
            ]}
        />
    </SnackBar>
}

const styles = {
    snackbarContent: {
        backgroundColor: '#d32f2f'
    },
    snackbarContentSpan: {
        position: 'relative',
        bottom: 6
    },
    snackbar: {
        width: 'fit-content'
    }
}