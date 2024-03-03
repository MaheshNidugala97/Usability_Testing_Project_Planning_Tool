import React, { useState } from 'react';
import axios from 'axios'; 
import '../styles/CreateIssue.css';

const CreateIssue = ({ onClose }) => {
  const initialState = {
    title: '',
    description: '',
    status: 'To do',
    priority: 'LOW',
    assignee: 'Daniel', 
    reporter: 'Daniel'  
  };

  const [issue, setIssue] = useState(initialState);

  const assignees = ['Mark', 'John','Daniel']; 
  const reporters = ['Mark', 'John','Daniel']; 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setIssue({ ...issue, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const id = Math.floor(Math.random() * 10000000); 
      const issueWithId = { ...issue, id };

     
      console.log('Submitting issue:', issueWithId);

      const response = await axios.post('http://localhost:3009/api/issues', issueWithId);
      
      alert(response.data.message); 
      setIssue(initialState); 
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
          <div className="form-column">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={issue.status} onChange={handleInputChange}>
              <option value="To do">To do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
            <label htmlFor="priority">Priority</label>
            <select id="priority" name="priority" value={issue.priority} onChange={handleInputChange}>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
            <label htmlFor="assignee">Assignee</label>
            <select id="assignee" name="assignee" value={issue.assignee} onChange={handleInputChange}>
              {assignees.map(assignee => (
                <option key={assignee} value={assignee}>{assignee}</option>
              ))}
            </select>
            <label htmlFor="reporter">Reporter</label>
            <select id="reporter" name="reporter" value={issue.reporter} onChange={handleInputChange}>
              {reporters.map(reporter => (
                <option key={reporter} value={reporter}>{reporter}</option>
              ))}
            </select>
          </div>
        </div>
        <button type="submit" className="accept-button">Accept</button>
      </form>
    </div>
  );
};

export default CreateIssue;
