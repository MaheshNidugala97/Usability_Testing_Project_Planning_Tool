import React from 'react';
import { Toolbar, Typography, Tooltip, IconButton } from '@mui/material';
import { alpha } from '@mui/material/styles';
import ReactSearchBox from "react-search-box";
import Iconify from '../../../utilities/iconify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
// import DeleteIcon from '@mui/icons-material/Delete';
// import FilterListIcon from '@mui/icons-material/FilterList';

function EnhancedTableToolbar({ numSelected, header, data, onSearch, onDelete }) {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
  

     
    </Toolbar>
  );
}

// EnhancedTableToolbar.propTypes = {
//     numSelected: PropTypes.number.isRequired,
//     header:  PropTypes.string.isRequired,
//     data: PropTypes.arrayOf(PropTypes.object).isRequired,
//     onSearch:  PropTypes.func.isRequired,
//     handleDelete: PropTypes.func.isRequired,
// };

export default EnhancedTableToolbar;
