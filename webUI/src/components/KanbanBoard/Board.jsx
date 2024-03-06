import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Column from "./Column";
import "./Board.css";

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([
    {
      "id": 1,
      "ticketName":"T-1",
      "title": "Login API Call",
      "description": "Login API Call",
      "status": "To Do",
      "priority": "HIGH",
      "assignee": "Mahesh Nidugala",
      "reporter": "John",
      "estimate": '1'
      
    },
    {
      "id": 2,
      "ticketName":"T-2",
      "title": "Validation to Login Page",
      "description": "alidation to Login Page",
      "status": "In Progress",
      "priority": "HIGH",
      "assignee": "Adith Jain",
      "reporter": "John",
      "estimate": "3"
    },
    {
      "id": 3,
      "ticketName":"T-3",
      "title": "Login page",
      "description": "design login page with 2 fields",
      "status": "Done",
      "priority": "HIGH",
      "assignee": "Athul Krishna",
      "reporter": "John",
      "estimate": "3"
    }
  ]);
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="kanban-board">
        <Column
          title="To Do"
          status="To Do"
          tickets={tickets}
          setTickets={setTickets}
        />
        <Column
          title="In Progress"
          status="In Progress"
          tickets={tickets}
          setTickets={setTickets}
        />
        <Column
          title="Done"
          status="Done"
          tickets={tickets}
          setTickets={setTickets}
        />
      </div>
    </DndProvider>
  );
};

export default KanbanBoard;
