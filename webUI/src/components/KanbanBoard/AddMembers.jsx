import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const AddMemberModal = ({ open, onClose, onAddMember }) => {
  const [memberName, setMemberName] = useState("");

  const handleAddMember = () => { 
    onAddMember(memberName);
    setMemberName("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} sx={{ marginBottom: "400px" }}>
      <DialogTitle>Add People</DialogTitle>
      <DialogContent>
        <TextField
          label="Member Name"
          value={memberName}
          onChange={(e) => setMemberName(e.target.value)}
          fullWidth
          InputLabelProps={{
            style: { fontSize: "1rem" } 
          }}
          style={{ marginTop: "10px" }} 
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ fontSize: "0.8rem" }}>Cancel</Button>
        <Button onClick={handleAddMember} variant="contained" color="primary" sx={{ fontSize: "0.8rem" }}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMemberModal;
