import React, { useState, useEffect } from "react";
import axios from "axios";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Column from "./Column";
import "./Board.css";


const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const getTickets = async () => {
      try {
        console.log(process.env.REACT_APP_TICKET_API_ENDPOINT)
        const issues = await axios.get(`${process.env.REACT_APP_TICKET_API_ENDPOINT}issues`);
        if (!issues?.data) {
          throw new Error("Failed to get tickets");
        }
        setTickets(issues.data);
      } catch (error) {
        console.error("Error fetching issue:", error);
      }
    };
    getTickets();;    
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
