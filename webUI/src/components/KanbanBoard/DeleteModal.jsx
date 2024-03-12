import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const DeleteTicketModal = (props) => {
  const handleDeleteTicket = () => {
    props.onTicketDelete(props.ticketId);
    props.onClose();
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      sx={{ marginBottom: "400px" }}
    >
      
      <DialogTitle  sx={{ display: "flex", alignItems: "center" }}>
        <ErrorOutlineIcon  style={{ marginRight: "8px", color:'red',  }} />
        Delete Ticket {props.ticketName}?
      </DialogTitle>
      <DialogContent>
        <p>
          You're about to permanently delete this issue, its comments and
          attachments, and all of its data.
        </p>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={props.onClose}
          sx={{ fontSize: "0.8rem", textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleDeleteTicket}
          variant="contained"
          color="error"
          sx={{ fontSize: "0.8rem", textTransform: "none" }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteTicketModal;
