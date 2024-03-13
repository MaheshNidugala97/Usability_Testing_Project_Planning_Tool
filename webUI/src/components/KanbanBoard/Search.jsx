import React from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import './Board.css';

const Search = ({ searchQuery, setSearchQuery }) => {
  const clearSearchQuery = () => {
    setSearchQuery('');
  };
  return (
    <TextField
      className='search-box'
      label='Search this board'
      variant='outlined'
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      style={{ width: '20%' }}
      InputProps={{
        endAdornment: searchQuery && (
          <InputAdornment position='end'>
            <IconButton
              size='small'
              style={{ marginRight: '-10px' }}
              onClick={clearSearchQuery}
              data-testid='clear-icon'
            >
              <ClearIcon fontSize='small' />
            </IconButton>
          </InputAdornment>
        ),
      }}
      inputProps={{
        'data-testid': 'search-input',
      }}
    />
  );
};

export default Search;
