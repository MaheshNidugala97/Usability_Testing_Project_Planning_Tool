// KanbanBoard.js
import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Column from "./Column";
import "./Board.css";

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([
    { id: "ticket-1", title: "Fix bug in login", status: "To Do" },
    { id: "ticket-2", title: "Implement new feature", status: "In Progress" },
    { id: "ticket-3", title: "Write documentation", status: "Done" },
  ]);
  
  useEffect(() => {
    const maxTickets = Math.max(
      tickets.filter(ticket => ticket.status === 'To Do').length,
      tickets.filter(ticket => ticket.status === 'In Progress').length,
      tickets.filter(ticket => ticket.status === 'Done').length
    );

    const columnHeight = maxTickets * 90;
    const columns = document.querySelectorAll('.column');
    columns.forEach(column => {
      column.style.height = `${columnHeight}px`;
    });
  }, [tickets])

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
