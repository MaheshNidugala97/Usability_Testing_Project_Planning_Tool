import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Column from "./Column";
import "./Board.css";
import { getTickets } from "../../services/endpoint.call";

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    getTickets().then((data) => {
      setTickets(data);
    });
  }, []);

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
