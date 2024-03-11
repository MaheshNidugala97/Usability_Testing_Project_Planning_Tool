import React, { useState, useEffect, useMemo } from 'react';
import EnhancedTableToolbar from './EnhancedTableToolbar';
import EnhancedTableHead from './EnhancedTableHead';
import TableNoData from './table-no-data';
import { getComparator, applyFilter } from '../../../utilities/sorting';
import { Box, Paper, Table, TableContainer, TableBody, TablePagination, FormControlLabel, Switch, TableRow, TableCell, Checkbox } from '@mui/material';
import BpCheckbox from '../../../utilities/BpCheckbox';
import { Droppable, Draggable, DragDropContext } from 'react-beautiful-dnd';
import Collapsible from "../collapse/Collapsible";
import "../collapse/index.css";

function EnhancedTable({ header, data, setData, placeholder,setPage, page, filterName, setFilterName, onDelete }) {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');
  const [selected, setSelected] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);


  useEffect(() => {
    // Fetch data using props.data if needed
  }, [data]);
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data.map((task) => task.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = () => {
    const updatedData = [...data]; // Create a copy of the data array
    const newData = updatedData.filter((row) => !selected.includes(row.id));
    setData(newData);
    setSelected([]);
  };


  const isSelected = (id) => selected.indexOf(id) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const dataFiltered = applyFilter({
    inputData: data,
    comparator: getComparator(order, orderBy),
    filterName,
  });
  const notFound = !dataFiltered.length && !!filterName;
  return (
   
    <Box sx={{ width: '100%' }}>
    <Collapsible open header={header} onDelete={handleDelete} numSelected={selected.length}>
      <Paper sx={{ width: '100%' }}>
        {/* <EnhancedTableToolbar
          numSelected={selected.length}
          header={header}
          data={data}
          onDelete={handleDelete} /> */}
        <TableContainer>
          <Table
            sx={{ minWidth: 750}}
            aria-labelledby="tableTitle"
            size='small'
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {dataFiltered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  // Check if the row status allows dragging
                  const canDrag = row.status === 'todo' || row.status === 'backlog';

                  return (
                    <React.Fragment key={row.id}>
                      {canDrag ? (
                        <Draggable key={row.id} draggableId={row.id} index={index}>
                          {(provided) => (
                            <TableRow
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              hover
                              onClick={(event) => handleClick(event, row.id)}
                              role="checkbox"
                              aria-checked={isItemSelected}
                              tabIndex={-1}
                              key={row.id}
                              selected={isItemSelected}
                              sx={{ cursor: 'pointer' }}
                            >
                              <TableCell padding="checkbox">
                                <BpCheckbox isItemSelected={isItemSelected} isCustomized={false} />
                              </TableCell>
                              <TableCell component="th" id={labelId} scope="row" padding="none">
                                {row.id}
                              </TableCell>
                              <TableCell align="left">{row.title}</TableCell>
                              <TableCell align="left">{row.status}</TableCell>
                              <TableCell align="left">{row.priority}</TableCell>
                            </TableRow>
                          )}
                        </Draggable>
                      ) : (
                        // Render the row without Draggable component if dragging is not allowed
                        <TableRow
                          hover
                          onClick={(event) => handleClick(event, row.id)}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.id}
                          selected={isItemSelected}
                          sx={{ cursor: 'pointer' }}
                        >
                          <TableCell padding="checkbox">
                            <BpCheckbox isItemSelected={isItemSelected} isCustomized={false} />
                          </TableCell>
                          <TableCell component="th" id={labelId} scope="row" padding="none">
                            {row.id}
                          </TableCell>
                          <TableCell align="left">{row.title}</TableCell>
                          <TableCell align="left">{row.status}</TableCell>
                          <TableCell align="left">{row.priority}</TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })
              }

              {placeholder}
              {notFound && <TableNoData query={filterName} />}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      </Collapsible>
    </Box>


  );
}

export default EnhancedTable;

