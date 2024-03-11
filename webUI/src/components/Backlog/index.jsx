import React, { useState, useEffect } from 'react';
import '../../styles/Backlog.css';
import ReactSearchBox from "react-search-box";
import EnhancedTable from './Table/EnhancedTable';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Droppable } from 'react-beautiful-dnd';
import { DragDropContext } from 'react-beautiful-dnd';



export default function Backlog() {
  const [data, setData] = useState([]);
  const [sprintData, setSprintData] = useState([]);
  const [backlogData, setBacklogData] = useState([]);
  const [page, setPage] = useState(0);
  const [filterName, setFilterName] = useState('');
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/task'); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        setData(jsonData);
        setSprintData(jsonData.filter(item => item.status !== "backlog"));
        setBacklogData(jsonData.filter(item => item.status === "backlog"));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination || source.droppableId === destination.droppableId) {
      return;
    }

    let newStatus;
    if (destination.droppableId === 'sprintData') {
      newStatus = 'todo';
    } else if (destination.droppableId === 'Backlog') {
      newStatus = 'backlog';
    }

    data.forEach((task) => {
      if (task.id === result.draggableId) {
        task.status = newStatus;
      }
      return task;
    })
    setSprintData(data.filter(item => item.status !== "backlog"));
    setBacklogData(data.filter(item => item.status === "backlog"));
  };

  const handleSearch = (event) => {
    console.log("handle search event----------->", event)
    setPage(0);
    setFilterName(event);
  };
  
  return (
    <DndProvider backend={HTML5Backend}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div>
          <div className='backlog'>Backlog</div>
          <ReactSearchBox
            style={{ width:'37%' }}
            placeholder="Search"
            className="max-w-sm"
            data={data}
            onChange={handleSearch}
          />
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

