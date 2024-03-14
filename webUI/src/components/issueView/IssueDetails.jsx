import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
} from "@mui/material";
import "../../styles/issueView/IssueDetails.css";

const IssueDetails = ({
  issue,
  selectedStatus,
  handleStatusChange,
  toggleDetails,
  showDetails,
  isExpanded,
  refreshBoard,
}) => {
  const [descriptionText, setDescriptionText] = useState(issue.description);
  const [descriptionChanged, setDescriptionChanged] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleDescriptionChange = (e) => {
    setDescriptionText(e.target.value);
    setDescriptionChanged(true);
    setIsEditing(true);
  };

  const updateDescription = async () => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_TICKET_API_ENDPOINT}issues/${issue.id}`,
        {
          description: descriptionText,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setDescriptionChanged(false);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="issue-details" data-testid="issue-details">
      <div className="title-section">
        <h2 className="title">{issue.title}</h2>
      </div>
      <div
        className={`status-section ${selectedStatus}`}
        data-testid="status-container"
      >
        <label htmlFor="status">Status:</label>
        <FormControl fullWidth>
          <Select
            labelId="status-label"
            id="status"
            value={selectedStatus}
            onChange={handleStatusChange}
          >
            <MenuItem value="To Do">To Do</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Done">Done</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className="description-section">
        <h3>Description:</h3>
        <div className="description-box">
          <textarea
            className="description-text"
            data-testid="description-ta"
            value={descriptionText}
            onChange={handleDescriptionChange}
          ></textarea>

          <Button
            disabled={!isEditing}
            variant="contained"
            color="primary"
            onClick={updateDescription}
            sx={{ marginLeft: "10px" }}
            data-testid="edit-description-button"
          >
            Save
          </Button>
        </div>
      </div>

      {!isExpanded && (
        <div className="details-section">
          <Button
            className="details-button"
            onClick={toggleDetails}
            variant="contained"
            color="primary"
            data-testid="show-hide-details-button"
          >
            {showDetails ? "Hide Details" : "Show Details"}
          </Button>
          {showDetails && (
            <div className="details-content" data-testid="details-content">
              <DetailContent issue={issue} refreshBoard={refreshBoard} />
            </div>
          )}
        </div>
      )}

      {isExpanded && (
        <div className="details-content">
          <DetailContent issue={issue} />
        </div>
      )}
    </div>
  );
};

const DetailContent = ({ issue, refreshBoard, toggleDetails }) => {
  const [employees, setEmployees] = useState([issue.assignee]);
  const [assignee, setAssignee] = useState(issue.assignee);
  const [sprint, setSprint] = useState(Number(issue.estimate));
  const [isEditingSprint, setIsEditingSprint] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get("http://localhost:3009/api/members");
        if (response.data) {
          setEmployees(response.data);
        }
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };
    fetchMembers();
  }, [employees]);

  const updateAssignee = async (newAssignee) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_TICKET_API_ENDPOINT}issues/${issue.id}`,
        {
          assignee: newAssignee,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setAssignee(newAssignee);
      refreshBoard();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const updateSprint = async () => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_TICKET_API_ENDPOINT}issues/${issue.id}`,
        {
          estimate: sprint.toString(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      refreshBoard();
    } catch (error) {
      console.error("Error updating sprint:", error);
    }
  };

  const handleSprintClick = () => {
    setIsEditingSprint(true);
  };

  const handleSprintBlur = () => {
    setIsEditingSprint(false);
    updateSprint();
  };

  return (
    <>
      <div className="issue-detail">
        <span className="label">Priority:</span>
        <span>{issue.priority}</span>
      </div>
      <div className="issue-detail">
        <span className="label">Assignee:</span>
        <FormControl fullWidth>
          <Select
            labelId="assignee-label"
            id="assignee"
            value={assignee}
            onChange={(e) => updateAssignee(e.target.value)}
          >
            {employees.map((employee, index) => (
              <MenuItem key={index} value={employee.name}>
                {employee.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className="issue-detail">
        <span className="label">Reporter:</span>
        <span>{issue.reporter}</span>
      </div>
      <div className="issue-detail">
        <span className="label">Sprint:</span>
        {isEditingSprint ? (
          <TextField
            type="number"
            value={sprint}
            onChange={(e) => setSprint(parseInt(e.target.value, 10) || 0)}
            onBlur={handleSprintBlur}
            variant="outlined"
            fullWidth
            size="small"
          />
        ) : (
          <span onClick={handleSprintClick} className="sprint-value">
            {sprint}
          </span>
        )}
      </div>
    </>
  );
};

export default IssueDetails;