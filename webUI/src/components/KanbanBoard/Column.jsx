import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDrop } from "react-dnd";
import Ticket from "./Ticket";
import "./Board.css";

const Column = (props) => {
  const [totalTickets, setTotalTickets] = useState(0);

  useEffect(() => {
    setTotalTickets(
      props.tickets.reduce(
        (total, ticket) => (ticket.status === props.status ? total + 1 : total),
        0
      )
    );
  }, [props.tickets, props.status]);

  const getInitials = (fullName) => {
    const names = fullName.split(" ");
    return names[0][0] + (names.length > 1 ? names[names.length - 1][0] : "");
  };

  const moveTicket = async (ticketId, status) => {
    const { data } = await axios.patch(
      `http://localhost:3009/api/issues/${ticketId}`,
      {
        status,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    props.setTickets(data);
  };

  const [, drop] = useDrop({
    accept: "ticket",
    drop: (item, monitor) => {
      if (!monitor.didDrop()) {
        console.log("index", item.id);
        moveTicket(item.id, props.status);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div className="column" id={props.status} ref={drop}>
      <h2>
        {props.title} ({totalTickets}){" "}
        {props.status === "Done" && <span className="tick-mark">&#10004;</span>}
      </h2>
      <div>
        {props.tickets.map((ticket, index) =>
          ticket.status === props.status ? (
            <Ticket
              key={ticket.id}
              ticket={ticket}
              index={index}
              assigneeInitials={getInitials(ticket.assignee)}
              setTickets={props.setTickets}
            />
          ) : null
        )}
      </div>
    </div>
  );
};

export default Column;
