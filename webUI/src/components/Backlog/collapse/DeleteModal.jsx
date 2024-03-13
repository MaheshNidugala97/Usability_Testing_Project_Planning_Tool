import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const DeleteTicketModal = (props) => {
  const handleDeleteTickets = () => {
    props.onTicketDelete(props.ticketIds);
    props.onClose();
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      sx={{ marginBottom: "400px" }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
        <ErrorOutlineIcon style={{ marginRight: "8px", color: "red" }} />
        {props.ticketIds.length === 1 ? (
          <>Delete Ticket</>
        ) : (
          <>Delete Tickets</>
        )}
      </DialogTitle>
      <DialogContent>
        <p>
          You're about to permanently delete {props.ticketIds.length}{" "}
          {props.ticketIds.length === 1 ? "ticket" : "tickets"}, their comments,
          attachments, and all of their data.
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
          onClick={handleDeleteTickets}
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
