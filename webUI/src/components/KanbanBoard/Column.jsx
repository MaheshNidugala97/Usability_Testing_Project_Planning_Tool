import React  from "react";
import { useDrop } from "react-dnd";
import Ticket from "./Ticket";

const Column = (props) => {
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
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });

  return (
    <div className="column" id={props.status} ref={drop}>
      <h2>{props.title}</h2>
      <div>
        {props.tickets.map((ticket, index) =>
          ticket.status === props.status ? (
            <Ticket
              key={ticket.id}
              ticket={ticket}
              index={index}
            />
          ) : null
        )}
      </div>
    </div>
  );
};

export default Column;
