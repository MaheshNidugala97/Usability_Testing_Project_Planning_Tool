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

function EnhancedTableHead({ numSelected, onSelectAllClick, rowCount, isItemSelected }) {
   
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
                    >
                        
                            {headCell.label}
                            
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    rowCount: PropTypes.number.isRequired,
};

export default EnhancedTableHead;
