import React from 'react';
import PropTypes from 'prop-types';
import { TableHead, TableRow, TableCell, Checkbox, TableSortLabel, Box } from '@mui/material';
import BpCheckbox from '../../../utilities/BpCheckbox';


const headCells = [
    {
        id: 'Task',
        numeric: true,
        disablePadding: true,
        label: 'Task',
    },
    {
        id: 'Title',
        numeric: true,
        disablePadding: false,
        label: 'Title',
    },
    {
        id: 'Status',
        numeric: true,
        disablePadding: false,
        label: 'Status',
    },
    {
        id: 'Priority',
        numeric: true,
        disablePadding: false,
        label: 'Priority',
    }
];

function EnhancedTableHead({ numSelected, order, orderBy, onSelectAllClick, onRequestSort, rowCount, isItemSelected }) {
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };
    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <BpCheckbox
                        isItemSelected={isItemSelected}
                        numSelected={numSelected}
                        rowCount={rowCount}
                        onSelectAllClick={onSelectAllClick}
                        isCustomized={true}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'left' : 'right'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sx={{ flex: '1 1 100%', fontWeight: 'bold' }}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span">
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

export default EnhancedTableHead;
