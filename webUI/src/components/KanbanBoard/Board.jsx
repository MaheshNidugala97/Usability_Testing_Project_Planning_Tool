import React, { useState, useEffect } from "react";
import axios from "axios";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Tooltip, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
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
  const [sprints, setSprints] = useState([]);
  const [isAddMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [sprintRemainingDays, setSprintRemainingDays] = useState(0);
  const [selectedMember, setSelectedMember] = useState(null);

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
        const issues = await axios.get(
          `${process.env.REACT_APP_TICKET_API_ENDPOINT}issues`
        );
        if (!issues?.data) {
          throw new Error("Failed to get tickets");
        }

        setTickets(
          issues.data.filter(
            (issue) =>
              issue.status !== "Backlog" && !issue.completedInPreviousSprint
          )
        );
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
    const fetchSprints = async () => {
      try {
        const response = await axios.get("http://localhost:3009/api/sprints");
        if (response.data) {
          setSprints(response.data);
          response.data.forEach((sprint) => {
            const remainingDays = sprintDayCalculation(sprint.endDate);
            setSprintRemainingDays(remainingDays);
          });
        }
      } catch (error) {
        console.error("Error fetching sprint details:", error);
      }
    };
    fetchSprints();
  }, [sprints]);

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

  const sprintDayCalculation = (sprintEndDate) => {
    const endDate = new Date(sprintEndDate);
    const currentDate = new Date();
    const remainingDuration = endDate - currentDate;
    const remainingDays = Math.ceil(remainingDuration / (1000 * 60 * 60 * 24));
    return remainingDays;
  };

  const memberOnClick = (name) => {
    if (name === selectedMember) {
      setFilteredTickets(tickets);
      setSelectedMember(null);
    } else {
      setFilteredTickets(tickets.filter((ticket) => ticket.assignee === name));
      setSelectedMember(name);
    }
  };

  return (
    <div className="board-container">
      <div className="sprint-container">
        {sprints.map((sprint, index) => (
          <Typography
            variant="h5"
            component="h4"
            className="sprint-name"
            style={{ fontWeight: 400, marginLeft: "10px", color: "black" }}
          >
            {sprint.sprintName}
          </Typography>
        ))}
        <div className="time-container">
          {sprints.map((sprint, index) => (
            <Tooltip
              key={index}
              title={
                <Typography variant="body" component="h4">
                  Sprint start date:
                  <br />
                  {sprint.startDate}
                  <br />
                  Sprint end date:
                  <br />
                  {sprint.endDate}
                </Typography>
              }
              arrow
            >
              <AccessTimeIcon
                fontSize="small"
                style={{ marginTop: "6px", marginRight: "8px", color: "gray" }}
              ></AccessTimeIcon>
            </Tooltip>
          ))}
          <Typography
            variant="body"
            component={"h5"}
            style={{
              marginTop: "7px",
              color: "gray",
              marginRight: "30px",
              fontWeight: "normal",
            }}
          >
            {sprintRemainingDays} days remaining
          </Typography>
          <Button
            onClick={handleAddMember}
            sx={{
              fontSize: "0.8rem",
              fontWeight: "semibold",
              color: "black",
              textTransform: "none",
              backgroundColor: "#f0f0f0",
              "&:hover": {
                backgroundColor: "lightgray",
              },
              marginRight: "15px",
            }}
          >
            Complete sprint
          </Button>
        </div>
      </div>
      <div className="search-container">
        <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="member-icons">
          {members.map((member, index) => (
            <Tooltip key={index} title={member.name} arrow>
              <div
                key={index}
                className={
                  "member-icon" +
                  (selectedMember === member.name ? " highlighted" : "")
                }
                onClick={() => memberOnClick(member.name)}
              >
                {member.name
                  .split(" ")
                  .map((namePart) => namePart[0])
                  .join("")}
              </div>
            </Tooltip>
          ))}
          <Tooltip title="Add Member" arrow>
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
