import React, { useState, useEffect } from "react";
import axios from "axios";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Column from "./Column";
import "./Board.css";
import IssuePopup from "../issueView/IssuePopup";
import Search from "./Search";

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);

  const [showIssuePopup, setShowIssuePopup] = useState(false);
  const [popupIssueId, setPopupIssueId] = useState();
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [forceBoardRefresh, setForceBoardRefresh] = useState(false);

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
    setFilteredTickets(
      tickets.filter((ticket) =>
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [tickets, searchQuery]);

  return (
    <div className="board-container">
      <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
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
    </div>
  );
};

export default KanbanBoard;
