import React from "react";
import { useDrag } from "react-dnd";

const Ticket = (props) => {
    const [{ isDragging }, drag] = useDrag({
        type: "ticket",
        item: { type: "ticket", id: props.ticket.id, status: props.ticket.status, index: props.index },
        collect: monitor => ({
          isDragging: !!monitor.isDragging()
        })
      });

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <p>{props.ticket.title}</p>
    </div>
  );
};

export default Ticket;
