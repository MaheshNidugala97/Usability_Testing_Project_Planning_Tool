import React from "react";
import { TextField } from "@mui/material";
import './Board.css'


const Search = ({ searchQuery, setSearchQuery }) => {
  return (
      <TextField
        className="search-box"
        label="Search this board"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
  );
};

export default Search;