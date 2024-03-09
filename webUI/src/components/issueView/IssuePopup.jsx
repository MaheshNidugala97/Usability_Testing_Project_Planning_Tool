import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IssueHeader from './IssueHeader'; 
import ColorPicker from './ColorPicker'; 
import AttachmentUploader from './AttachmentUploader'; 
import IssueDetails from './IssueDetails'; 
import CommentSection from './CommentSection'; 

import "../../styles/issueView/IssuePopup.css";

const IssuePopup = ({ issueId, onClose }) => {

  const [isExpanded, setIsExpanded] = useState(false);
  const [issue, setIssue] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedColor, setSelectedColor] = useState("#007bff"); 
  const [showColorOptions, setShowColorOptions] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(0); 
  const [message, setMessage] = useState(""); 
  const [showDetails, setShowDetails] = useState(false);
  const [comment, setcomment] = useState(""); 
  const [commentList, setcommentList] = useState([]); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const issueResponse = await axios.get(`http://localhost:3009/api/issues/${issueId}`);
       // const issueResponse = await axios.get(`http://localhost:3009/api/issues/1796084`);
        setIssue(issueResponse.data);

        const commentResponse = await axios.get(`http://localhost:3009/api/issues/${issueId}/comment`);
        // const commentResponse = await axios.get(`http://localhost:3009/api/issues/1796084/comment`);
        setcommentList(commentResponse.data);
      } catch (error) {
        console.error("Error fetching issue:", error);
      }
    };

    fetchData();

    return () => {
      setIssue(null);
      setcommentList([]);
    };
  }, [issueId]);

  const toggleExpandedView = () => {
    setIsExpanded(!isExpanded);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    setShowColorOptions(false);
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className={`issue-popup-container ${isExpanded ? 'expanded' : ''}`}>
  <div className={`issue-popup ${isExpanded ? 'expanded' : ''}`}>
    <IssueHeader onClose={onClose} onExpand={toggleExpandedView} />
        {issue ? (
          <>
            <ColorPicker
              selectedColor={selectedColor}
              onSelectColor={handleColorChange}
              showColorOptions={showColorOptions}
              setShowColorOptions={setShowColorOptions}
            />
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
            />
            <CommentSection
              issueId={issueId}
              comment={comment}
              setcomment={setcomment}
              commentList={commentList}
              setcommentList={setcommentList}
              setMessage={setMessage}
            />
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
