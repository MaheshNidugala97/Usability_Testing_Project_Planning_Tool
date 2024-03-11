import React, { useState, useEffect } from "react";
import axios from "axios";
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
          <button onClick={updateDescription}>
            <svg
              height={"30px"}
              fill={descriptionChanged ? "#007bff" : "#acadad"}
              clip-rule="evenodd"
              fill-rule="evenodd"
              stroke-linejoin="round"
              stroke-miterlimit="2"
              viewBox="0 0 24 24"
            >
              <path
                d="m11.998 2.005c5.517 0 9.997 4.48 9.997 9.997 0 5.518-4.48 9.998-9.997 9.998-5.518 0-9.998-4.48-9.998-9.998 0-5.517 4.48-9.997 9.998-9.997zm-5.049 10.386 3.851 3.43c.142.128.321.19.499.19.202 0 .405-.081.552-.242l5.953-6.509c.131-.143.196-.323.196-.502 0-.41-.331-.747-.748-.747-.204 0-.405.082-.554.243l-5.453 5.962-3.298-2.938c-.144-.127-.321-.19-.499-.19-.415 0-.748.335-.748.746 0 .205.084.409.249.557z"
                fill-rule="nonzero"
              />
            </svg>
          </button>
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

const DetailContent = ({ issue, refreshBoard }) => {
  const [employees, setEmployees] = useState([]);
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
  const [assignee, setAssignee] = useState(issue.assignee);
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
          {employees.map((employee, index) => {
            return (
              <option value={employee.name} key={index}>
                {employee.name}
              </option>
            );
          })}
        </select>
      </div>
      <div className="issue-detail">
        <span className="label">Reporter:</span>
        <span>{issue.reporter}</span>
      </div>
    </>
  );
};

export default IssueDetails;