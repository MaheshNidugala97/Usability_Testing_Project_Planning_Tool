import React, { useState, useEffect } from 'react';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { styled } from '@mui/system';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import './DatePicker.css';
import Swal from 'sweetalert2';

export default function AddDate({ open, onClose, onDateChange, sprintName, setSprintName, startDate, setStartDate, endDate, setEndDate }) {
  
  const handleSubmit = async () => {
    if (!sprintName || !startDate || !endDate) {
      Swal.fire({
        title: 'Warning!',
        text: "Please fill out all the fields",
        icon: 'warning',
        position: 'top-end', 
        showConfirmButton: false,
        timer: 3000, 
        toast: true, 
      });
      return;
    }

    if (endDate <= startDate || endDate == startDate) {
      Swal.fire({
        title: 'Error!',
        text: "End date must be greater than start date",
        icon: 'error',
        position: 'top-end', 
        showConfirmButton: false,
        timer: 3000, 
        toast: true, 
      });
      return;
    }

    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];
 
    // Prepare form data object
    const formData = {
      sprintName: sprintName,
      startDate: formattedStartDate,
      endDate: formattedEndDate
    };

    try {
      // Example: Send form data to API endpoint
      const response = await axios.patch('http://localhost:3009/api/sprints/1', formData);
      Swal.fire({
        title: 'Success!',
        text: response.data.message,
        icon: 'success',
        position: 'top-end', 
        showConfirmButton: false,
        timer: 3000, 
        toast: true, 
      });
      onClose();
      onDateChange(startDate, endDate); // Close the popup after successful submission
    } catch (error) {
      console.error('Error submitting form data:', error);
    }
  };

  return (
    <BasePopup open={open} onClose={onClose} className="modal">
      <PopupBody>
        <div>
          <div style={{ marginLeft: '240px'}}>
          <button type="button"  onClick={onClose}>×</button>
          </div>
          {/* Sprint Name field */}
          <TextField
            label="Sprint Name"
            variant="outlined"
            value={sprintName}
            onChange={(e) => setSprintName(e.target.value)}
            fullWidth
            margin="normal"
            required
          />

          {/* Start Date field */}
          <label style={{ marginTop: '10px' }}>Start Date</label>
          <div>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              label="Start Date"
              fullWidth
              margin="normal"
              className="date-picker"
              dateFormat="MMMM d, yyyy"
              placeholderText="Select Start Date"
              required
            />
          </div>

          {/* End Date field */}
          <label style={{ marginTop: '10px' }}>End Date</label>
          <div>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              label="End Date"
              fullWidth
              margin="normal"
              className="date-picker"
              dateFormat="MMMM d, yyyy"
              placeholderText="Select End Date"
              required
            />
          </div>

          {/* Submit Button */}
          <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ fontSize: "0.8rem", marginTop: '10px', display: 'flex', justifyContent: 'left' }}>
            Update Sprint
          </Button>
        </div>
      </PopupBody>
    </BasePopup>
  );
}

const PopupBody = styled('div')(
  ({ theme }) => `
        width: 300px; /* Adjust width as needed */
        padding: 16px;
        border-radius: 8px;
        border: 1px solid ${theme.palette.mode === 'dark' ? 'gray' : 'lightgray'};
        background-color: ${theme.palette.mode === 'dark' ? 'black' : 'white'};
        box-shadow: ${theme.palette.mode === 'dark'
      ? `0px 4px 8px rgba(0, 0, 0, 0.7)`
      : `0px 4px 8px rgba(0, 0, 0, 0.1)`};
        font-family: 'IBM Plex Sans', sans-serif;
        font-weight: 500;
        font-size: 0.875rem;
        margin-bottom: 200px;
    `,
);
