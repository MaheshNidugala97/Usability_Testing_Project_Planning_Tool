import React, { useState, useEffect } from "react";
import axios from "axios";
import IssueHeader from "./IssueHeader";
import AttachmentUploader from "./AttachmentUploader";
import IssueDetails from "./IssueDetails";
import CommentSection from "./CommentSection";

import "../../styles/issueView/IssuePopup.css";

const IssuePopup = ({ issueId, refreshBoard, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [issue, setIssue] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [message, setMessage] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const issueResponse = await axios.get(
          `http://localhost:3009/api/issues/${issueId}`
        );
        // const issueResponse = await axios.get(`http://localhost:3009/api/issues/1796084`);
        setIssue(issueResponse.data);
        setSelectedStatus(issueResponse.data.status);
      } catch (error) {
        console.error("Error fetching issue:", error);
      }
    };

    fetchData();

    return () => {
      setIssue(null);
    };
  }, [issueId]);

  const toggleExpandedView = () => {
    setIsExpanded(!isExpanded);
  };

  const handleStatusChange = async (e) => {
    setSelectedStatus(e.target.value);
    try {
      await axios.patch(
        `${process.env.REACT_APP_TICKET_API_ENDPOINT}issues/${issueId}`,
        {
          status: e.target.value,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      refreshBoard();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className={`issue-popup-container ${isExpanded ? "expanded" : ""}`}>
      <div className={`issue-popup ${isExpanded ? "expanded" : ""}`}>
        <IssueHeader onClose={onClose} onExpand={toggleExpandedView} />
        {issue ? (
          <>
            <AttachmentUploader
              attachments={attachments}
              setAttachments={setAttachments}
              fileInputKey={fileInputKey}
              setFileInputKey={setFileInputKey}
              setMessage={setMessage}
            />
            <IssueDetails
              issue={issue}
              selectedStatus={selectedStatus}
              handleStatusChange={handleStatusChange}
              toggleDetails={toggleDetails}
              showDetails={showDetails}
              refreshBoard={refreshBoard}
            />
            {/* Pass down props to CommentSection */}
            <CommentSection issueId={issueId} />
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      {/* {message && <div className="message">{message}</div>} */}
    </div>
  );
};

export default IssuePopup;