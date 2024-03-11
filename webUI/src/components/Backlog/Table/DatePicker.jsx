import React, { useState } from 'react';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { styled } from '@mui/system';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function SimplePopup(props) {
    const open = Boolean(props.anchor);
    const id = open ? 'simple-popup' : undefined;

    // State variables to store form data
    const [sprintName, setSprintName] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);


   const  handleChangeDate = date => {
    console.log("A date has been selected: ", date);
        this.setStartDate(date);
      };
    // Function to handle form submission
    const handleSubmit = () => {
        // Prepare form data object
        const formData = {
            sprintName: sprintName,
            startDate: startDate,
            endDate: endDate
        };

        // Example: Send form data to API endpoint
        fetch('https://example.com/api/endpoint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Form data submitted:', data);
            // Handle response from API if needed
        })
        .catch(error => {
            console.error('Error submitting form data:', error);
            // Handle error if needed
        });
    };

    return (
        <BasePopup id={id} open={open} anchor={props.anchor}>
            <PopupBody>
                {/* Sprint Name field */}
                <TextField
                    label="Sprint Name"
                    variant="outlined"
                    value={sprintName}
                    onChange={handleChangeDate}
                    fullWidth
                    margin="normal"
                />
                <div>
                <TextField
                    label="Start Date"
                    variant="outlined"
                    value={startDate}
                    onChange={(e) => setSprintName(e.target.value)}
                    fullWidth
                    margin="normal"
                >  <DatePicker
               
               
                /> </TextField>  
                
                </div>
                <TextField
                    label="Sprint Name"
                    variant="outlined"
                    value={sprintName}
                    onChange={(e) => setSprintName(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                
                {/* <div className="marginBottom">
              <label id="Dateofbirth-label" htmlFor="Date of birth">
                Date of birth
              </label>
              <DatePicker
                selected={this.state.startDate}
                onChange={this.handleChangeDate}
              />
            </div>
               */}

                {/* Submit button */}
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Submit
                </Button>
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
    `,
);
