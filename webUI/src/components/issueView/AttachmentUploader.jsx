import React from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import "../../styles/issueView/FileUploader.css";

const AttachmentUploader = ({
  attachments,
  setAttachments,
  fileInputKey,
  setFileInputKey,
  setMessage,
  issue,
  attachmentFileNames,
  setAttachmentFileNames,
}) => {
  const handleFileChange = (e) => {
    const files = e.target.files;
    setAttachments([...attachments, ...files]);
    setFileInputKey((prevKey) => prevKey + 1);
  };

  const updateAttachmentInfo = async () => {
    setAttachments([]);
    try {
      await axios.patch(
        `${process.env.REACT_APP_TICKET_API_ENDPOINT}issues/${issue.id}`,
        {
          attachments: [
            ...attachmentFileNames,
            ...Array.from([...attachments]).map((f) => f.name),
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error updating attachments:", error);
    }
  };

  const handleFileUpload = async () => {
    try {
      const formData = new FormData();
      attachments.forEach((file) => {
        formData.append("files", file);
      });

      const response = await axios.post(
        "http://localhost:3009/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert(response.data.message);

      setMessage("Files uploaded successfully!");
      setAttachmentFileNames([
        ...attachmentFileNames,
        ...Array.from([...attachments]).map((f) => f.name),
      ]);
      await updateAttachmentInfo();
    } catch (error) {
      console.error("Error uploading files:", error);
      setMessage("Error uploading files");
    }
  };

  return (
    <div className="attachment-section">
      <label htmlFor="fileInput">Attachments:</label>
      <div className="file-input-section">
        <input
          data-testid="fileInput"
          key={fileInputKey}
          type="file"
          id="fileInput"
          multiple
          onChange={handleFileChange}
        />
        <label htmlFor="fileInput" className="upload-button">
          <FontAwesomeIcon icon={faPaperclip} />
        </label>
        <button onClick={handleFileUpload}>Upload</button>
      </div>
      {(attachments.length > 0 || attachmentFileNames.length) > 0 && (
        <div
          className="attachment-thumbnails"
          data-testid="attachments-container"
        >
          {attachments.map((file, index) => (
            <div key={index} className="attachment-thumbnail">
              <img
                src={URL.createObjectURL(file)}
                alt={`Attachment ${index + 1}`}
              />
            </div>
          ))}
          {attachmentFileNames.map((fileName, index) => (
            <div key={index} className="attachment-thumbnail">
              <img
                src={`http://localhost:3009/Assets/uploads/${fileName}`}
                alt={`Attachment ${index + 1}`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttachmentUploader;