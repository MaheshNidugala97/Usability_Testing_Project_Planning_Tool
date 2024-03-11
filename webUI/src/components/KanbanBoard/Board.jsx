import React, { useState, useEffect } from "react";
import axios from "axios";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Column from "./Column";
import "./Board.css";
import IssuePopup from "../issueView/IssuePopup";
import Search from "./Search";
import AddMemberModal from "./AddMembers";

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [showIssuePopup, setShowIssuePopup] = useState(false);
  const [popupIssueId, setPopupIssueId] = useState();
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [forceBoardRefresh, setForceBoardRefresh] = useState(false);
  const [members, setMembers] = useState([]);
  const [isAddMemberModalOpen, setAddMemberModalOpen] = useState(false);

  const openPopupWithIssue = (id) => {
    setPopupIssueId(id);
    setShowIssuePopup(true);
  };

  const refreshBoard = () => {
    setForceBoardRefresh(!forceBoardRefresh);
  };
  useEffect(() => {
    const getTickets = async () => {
      try {
        console.log(process.env.REACT_APP_TICKET_API_ENDPOINT);
        const issues = await axios.get(
          `${process.env.REACT_APP_TICKET_API_ENDPOINT}issues`
        );
        if (!issues?.data) {
          throw new Error("Failed to get tickets");
        }

        setTickets(issues.data.filter((issue) => issue.status !== "Backlog"));
      } catch (error) {
        console.error("Error fetching issue:", error);
      }
    };
    getTickets();
  }, [forceBoardRefresh]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get("http://localhost:3009/api/members");
        if (response.data) {
          setMembers(response.data);
        }
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };
    fetchMembers();
  }, [members]);

  useEffect(() => {
    setFilteredTickets(
      tickets.filter((ticket) =>
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [tickets, searchQuery]);

  const handleAddMember = async (name) => {
    try {
      await axios.post(
        "http://localhost:3009/api/members",
        {
          name,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  return (
    <div className="board-container">
      <div className="search-container">
        <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="member-icons">
          {members.map((member, index) => (
            <Tooltip key={index} title={member.name}>
              <div key={index} className="member-icon">
                {member.name
                  .split(" ")
                  .map((namePart) => namePart[0])
                  .join("")}
              </div>
            </Tooltip>
          ))}
          <Tooltip title="Add Member">
            <div
              className="add-member-icon"
              onClick={() => setAddMemberModalOpen(true)}
            >
              <AddIcon />
            </div>
          </Tooltip>
        </div>
      </div>
      <DndProvider backend={HTML5Backend}>
        <div className="kanban-board">
          <Column
            title="To Do"
            status="To Do"
            tickets={filteredTickets}
            setTickets={setTickets}
            openPopupWithIssue={openPopupWithIssue}
          />
          <Column
            title="In Progress"
            status="In Progress"
            tickets={filteredTickets}
            setTickets={setTickets}
            openPopupWithIssue={openPopupWithIssue}
          />
          <Column
            title="Done"
            status="Done"
            tickets={filteredTickets}
            setTickets={setTickets}
            openPopupWithIssue={openPopupWithIssue}
          />
        </div>
      </DndProvider>
      {showIssuePopup && (
        <IssuePopup
          issueId={popupIssueId}
          refreshBoard={refreshBoard}
          onClose={() => {
            setShowIssuePopup(false);
          }}
        />
      )}
      <AddMemberModal
        open={isAddMemberModalOpen}
        onClose={() => setAddMemberModalOpen(false)}
        onAddMember={handleAddMember}
      />
    </div>
  );
};

export default KanbanBoard;
