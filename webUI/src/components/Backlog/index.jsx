import React, { useState, useEffect } from 'react';
import '../../styles/Backlog.css';
import ReactSearchBox from "react-search-box";
import EnhancedTable from './Table/EnhancedTable';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Droppable } from 'react-beautiful-dnd';
import { DragDropContext } from 'react-beautiful-dnd';
import axios from "axios";

export default function Backlog() {
  const [data, setData] = useState([]);
  const [sprintData, setSprintData] = useState([]);
  const [backlogData, setBacklogData] = useState([]);
  const [page, setPage] = useState(0);
  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3009/api/issues");
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const jsonData = await response.json();
        setData(jsonData);
        setSprintData(jsonData.filter(item => item.status !== "Backlog" && item.completedInPreviousSprint == false));
        setBacklogData(jsonData.filter(item => item.status === "Backlog" || item.status === "Done" && item.completedInPreviousSprint == true));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleDragEnd = async (result) => {
    const { source, destination } = result;
    const taskId = parseInt(result.draggableId);
    if (!destination || source.droppableId === destination.droppableId) {
      return;
    }
    let newStatus;
    if (destination.droppableId === 'sprintData') {
      newStatus = 'To Do';
    } else if (destination.droppableId === 'Backlog') {
      newStatus = 'Backlog';
    }

    data.forEach((task) => {
      const ticketId = (task.id).toString();
      if (ticketId === result.draggableId) {
        task.status = newStatus;
      }
      return task;
    })
    setSprintData(data.filter(item => item.status !== "Backlog" && item.completedInPreviousSprint == false));
    setBacklogData(data.filter(item => item.status === "Backlog" || item.status === "Done" && item.completedInPreviousSprint == true));

    try {
      // Example: Send update to API endpoint
      await axios.patch(`http://localhost:3009/api/issues/${taskId}`, { status: newStatus });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleSearch = (event) => {
    setPage(0);
    setFilterName(event);
  };
  
  return (
    <DndProvider backend={HTML5Backend}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div>
          <div className='backlog'>Backlog</div>
          <div className="searchBox">
            <ReactSearchBox
              placeholder="Search"
              data={data}
              onChange={handleSearch}
              sx={{ mt: '20' }}
            />
          </div>
          <Droppable droppableId='sprintData'>
            {(provided) => (
              <div className='collapse' ref={provided.innerRef} sx={{ mt: '100' }} {...provided.droppableProps} style={{ marginTop: "30px" }}>
                {/* <Collapsible open header="Selected for Development" onDelete> */}
                <EnhancedTable
                  header="Selected for Development"
                  data={sprintData}
                  setData={setSprintData}
                  placeholder={provided.placeholder}
                  setPage={setPage}
                  page={page}
                  filterName={filterName}
                  setFilterName={setFilterName}
                  onDelete
                />
                {/* </Collapsible> */}
              </div>
            )}
          </Droppable>
          <Droppable droppableId='Backlog'>
            {(provided) => (
              <div className='collapse' ref={provided.innerRef}  {...provided.droppableProps} style={{ marginTop: "30px" }}>
                {/* <Collapsible open header="Backlog" onDelete> */}
                <EnhancedTable
                  header="Backlog Items"
                  data={backlogData}
                  setData={setBacklogData}
                  placeholder={provided.placeholder}
                  setPage={setPage}
                  page={page}
                  filterName={filterName}
                  setFilterName={setFilterName}
                  onDelete
                />
                {/* </Collapsible> */}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </DndProvider>
  );
}

