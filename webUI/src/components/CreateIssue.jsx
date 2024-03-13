import React, { useState , useEffect } from 'react';
import axios from 'axios';
import '../styles/CreateIssue.css';
import Swal from 'sweetalert2';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';


const CreateIssue = ({ onClose }) => {
  const initialState = {
    title: '',
    description: '',
    status: 'Backlog',
    priority: 'LOW',
    estimate: "1",
    assignee: "Alan K Mathew",
    reporter: "Alan K Mathew",
  };

  const [issue, setIssue] = useState(initialState);
  const [estimate, setEstimate] = useState(0); 
  const [members, setMembers] = useState([]); 

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get('http://localhost:3009/api/members');
        setMembers(response.data); 
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    fetchMembers();
  }, []); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setIssue({ ...issue, [name]: value });
  };

  const handleEstimateChange = (e) => {
    const value = parseInt(e.target.value);
    setEstimate(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const id = Math.floor(Math.random() * 10000000);
      const time = new Date().toISOString();
      const ticketNumber = Math.floor(Math.random() * 1000);
      const ticketName = `T-${ticketNumber}`;
      const issueWithId = { ...issue, id, estimate, time, ticketName };
  
      console.log('Submitting issue:', issueWithId);
  
      const response = await axios.post('http://localhost:3009/api/issues', issueWithId);
      
      Swal.fire({
        title: 'Success!',
        text: response.data.message,
        icon: 'success',
        position: 'top-end', 
        showConfirmButton: false,
        timer: 3000, 
        toast: true, 
      });
      
      setIssue(initialState);
      setEstimate(0); 
      onClose();
    } catch (error) {
      console.error('There was an error creating the issue:', error);
    }
  };

  return (
    <div className="modal-overlay">
      <form onSubmit={handleSubmit} className="issue-form">
        <button type="button" className="close-button" onClick={onClose}>×</button>
        <h2>Create new issue</h2>
        <div className="form-row">
          <div className="form-column">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              value={issue.title}
              onChange={handleInputChange}
              placeholder="Write the title"
              required
            />
             <label htmlFor="estimate">Estimate</label>
            <input
              id="estimate"
              name="estimate"
              type="number"
              min="1"
              value={estimate || 1}
              onChange={handleEstimateChange}
              placeholder="Enter estimate"
              required
            />
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={issue.description}
              onChange={handleInputChange}
              placeholder="Add a description"
              required
            />
          </div>
<div className="form-column2">
<FormControl>
  <InputLabel  id="status-label">Status</InputLabel>
  <Select
    labelId="status-label"
    id="status"
    name="status"
    value={issue.status}
    onChange={handleInputChange}
  >
    <MenuItem value="To Do">To Do</MenuItem>
    <MenuItem value="Backlog">Backlog</MenuItem>
  </Select>
  </FormControl>

<FormControl>
  <InputLabel  id="priority-label">Priority</InputLabel>
  <Select
    labelId="priority-label"
    id="priority"
    name="priority"
    value={issue.priority}
    onChange={handleInputChange}
  >
    <MenuItem value="LOW">LOW</MenuItem>
    <MenuItem value="MEDIUM">MEDIUM</MenuItem>
    <MenuItem value="HIGH">HIGH</MenuItem>
  </Select>
</FormControl>

<FormControl className="myFormControl">
  <InputLabel id="assignee-label">Assignee</InputLabel>
  <Select
    labelId="assignee-label"
    id="assignee"
    name="assignee"
    value={issue.assignee}
    onChange={handleInputChange}
  >
    {members.map((member) => (
      <MenuItem key={member.id} value={member.name}>{member.name}</MenuItem>
    ))}
  </Select>
</FormControl>

<FormControl>
  <InputLabel id="reporter-label">Reporter</InputLabel>
  <Select 
    labelId="reporter-label"
    id="reporter"
    name="reporter"
    value={issue.reporter}
    onChange={handleInputChange}
  >
    {members.map((member) => (
      <MenuItem key={member.id} value={member.name}>{member.name}</MenuItem>
    ))}
  </Select>
</FormControl>
</div>
</div>
        <button type="submit" className="accept-button">Accept</button>
      </form>
    </div>
  );
};

export default CreateIssue;



