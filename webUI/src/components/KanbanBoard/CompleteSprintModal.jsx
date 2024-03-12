import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const SprintCompleteModal = (props) => {
  const navigate = useNavigate();
  const handleSprintComplete = () => {
    props.onSprintComplete();
    props.onClose();
    navigate("/backlog");
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      sx={{ marginBottom: "400px"}}
    >
      <DialogTitle sx={{fontSize: "1rem", fontWeight:'bold' }}>Complete {props.sprintName}?</DialogTitle>
      <DialogContent>
        <p>This sprint contains:</p>
        <ul>
          <li>{props.todoCount} To Do</li>
          <li>{props.inProgressCount} In Progress</li>
          <li>{props.doneCount} Done</li>
        </ul>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={props.onClose}
          sx={{ fontSize: "0.8rem", textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSprintComplete}
          variant="contained"
          color="primary"
          sx={{ fontSize: "0.8rem", textTransform: "none" }}
        >
          Complete Sprint
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SprintCompleteModal;
