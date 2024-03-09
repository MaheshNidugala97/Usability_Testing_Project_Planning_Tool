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

  const moveTicket = (dragIndex, hoverIndex, targetStatus) => {
    const ticketsCopy = [...props.tickets];
    const draggedTicket = ticketsCopy.splice(dragIndex, 1)[0];
    draggedTicket.status = targetStatus;
    ticketsCopy.splice(hoverIndex, 0, draggedTicket);
    props.setTickets(ticketsCopy);
  };

  const [, drop] = useDrop({
    accept: "ticket",
    drop: (item, monitor) => {
      if (!monitor.didDrop()) {
        moveTicket(item.index, props.tickets.length, props.status);
        item.index = props.tickets.length;
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
              openPopupWithIssue={props.openPopupWithIssue}
            />
          ) : null
        )}
      </div>
    </div>
  );
};

export default Column;