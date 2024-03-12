import React from "react";
import { TextField,  InputAdornment, IconButton  } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import './Board.css'


const Search = ({ searchQuery, setSearchQuery }) => {
  const clearSearchQuery = () => {
    setSearchQuery("");
  };
  return (
      <TextField
        className="search-box"
        label="Search this board" 
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          endAdornment: searchQuery && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={clearSearchQuery}  style={{ marginRight: "-10px" }} >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
  );
};

export default Search;