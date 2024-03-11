import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/issueView/IssueDetails.css";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";

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

  const handleDescriptionChange = (e) => {
    setDescriptionText(e.target.value);
    setDescriptionChanged(true);
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
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="issue-details" data-testid="issue-details">
      <div className="title-section">
        <h2 className="title">{issue.title}</h2>
      </div>
      <div className={`status-section ${selectedStatus}`}>
        <label htmlFor="status">Status:</label>
        <select
          id="status"
          value={selectedStatus}
          onChange={handleStatusChange}
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>
      <div className="description-section">
        <h3>Description:</h3>
        <div className="description-box">
          <textarea
            className="description-text"
            value={descriptionText}
            onChange={handleDescriptionChange}
          ></textarea>
          <div className="description-icon-button">
            <DoneRoundedIcon sx={{ fontSize: "30px", color: "white" }} />
          </div>
        </div>
      </div>

      {!isExpanded && (
        <div className="details-section">
          <button
            className="details-button"
            onClick={toggleDetails}
            data-testid="show-hide-details-button"
          >
            {showDetails ? "Hide Details" : "Show Details"}
          </button>
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
  const [employees, setEmployees] = useState([]);
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
    updateSprint(); {/* Add updateSprint when blur */}
  };

  return (
    <>
      <div className="issue-detail">
        <span className="label">Priority:</span>
        <span>{issue.priority}</span>
      </div>
      <div className="issue-detail">
        <span className="label">Assignee:</span>
        <select
          id="assignee"
          value={assignee}
          onChange={(e) => {
            updateAssignee(e.target.value);
          }}
        >
          {employees.map((employee, index) => (
            <option value={employee.name} key={index}>
              {employee.name}
            </option>
          ))}
        </select>
      </div>
      <div className="issue-detail">
        <span className="label">Reporter:</span>
        <span>{issue.reporter}</span>
      </div>
      <div className="issue-detail">
        <span className="label">Sprint:</span>
        {isEditingSprint ? (
          <input
            type="number"
            value={sprint}
            onChange={(e) => setSprint(parseInt(e.target.value, 10) || 0)}
            onBlur={handleSprintBlur}
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