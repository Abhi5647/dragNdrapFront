import React, { useState, useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { v4 as uuid } from 'uuid';
import axios from 'axios';
// import useCollegeList from './getlist';


function App() {
  const[ todoItems, settodoItems ] = useState([{id : uuid(), content: "sec task"}]) 
 
  useEffect(()=>{
   axios.get('http://localhost:4000/getlist')
   .then( (response) => {
     console.log("response", response.data[0]);
     var datamodified = [
      {id : response.data[0].todoItems[0]._id, content: "First task"}
      , {id : uuid(), content: "sec task"}
     ]
     console.log("hi",datamodified)
     settodoItems(datamodified)
     console.log("todo",todoItems)
     // this.setState({
     //   fetchUser: response.data
     // });
     // console.log("fetchUser", this.state.fetchUser);
   })
   .catch( (error) => {
     console.log(error);
   }); 
  }, []);
  const requestedItems = [
    { id: uuid(), content: "First task" },
    { id: uuid(), content: "Second task" },
    { id: uuid(), content: "Third task" },
    { id: uuid(), content: "Fourth task" },
    { id: uuid(), content: "Fifth task" }
  ];
  console.log("h222",requestedItems)
  // const todoItems = useCollegeList()
  
  const progressItems=[
    { id: uuid(), content: "miscellaneous" },
    { id: uuid(), content: "Have a Bath" },
  ]
  const resolvedItems=[
    { id: uuid(), content: "Developing Project" },
    { id: uuid(), content: "Riding Bike" },
  ]
  const doneItems=[
    { id: uuid(), content: "Brush" },
    { id: uuid(), content: "Walking" },
  ]
   
  
  const columnsFromBackend = {
    [1]: {
      name: "Requested",
      items: requestedItems
    },
    [2]: {
      name: "To do",
      items: todoItems
    },
    [3]: {
      name: "In Progress",
      items: progressItems
    },
    [4]: {
      name: "Resolved",
      items: resolvedItems
    },
    [5]: {
      name: "Done",
      items: doneItems
    }
  };
  
  const onDragEnd = (result ,columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;
  
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      console.log("sourceColumns",sourceColumn);
      const destColumn = columns[destination.droppableId];
      console.log("destColumn",destColumn);
      const sourceItems = [...sourceColumn.items];
      console.log("sourceItems",sourceItems)
      const destItems = [...destColumn.items];
      console.log("destItemsbefore",destItems);
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      console.log("destItemsAfter",destItems)
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems
        }
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems
        }
      });
    }
  
  };
  function change(){
    console.log(todoItems);
  }
  const [columns, setColumns] = useState(columnsFromBackend);
  return (
    <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
      <DragDropContext
        onDragEnd={result => onDragEnd(result, columns, setColumns)}
      >
        {Object.entries(columns).map(([columnId, column], index) => {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
              key={columnId}
            >
              <h2>{column.name}</h2>
              <div style={{ margin: 8 }}>
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          background: snapshot.isDraggingOver
                            ? "lightblue"
                            : "lightgrey",
                          padding: 4,
                          width: 250,
                          minHeight: 500
                        }}
                      >
                        {column.items.map((item, index) => {
                          return (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      userSelect: "none",
                                      padding: 16,
                                      margin: "0 0 8px 0",
                                      minHeight: "50px",
                                      backgroundColor: snapshot.isDragging
                                        ? "#263B4A"
                                        : "#456C86",
                                      color: "white",
                                      ...provided.draggableProps.style
                                    }}
                                  >
                                    {item.content}
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            </div>
          );
        })}
      </DragDropContext>
      <button onClick={change}>change</button>
    </div>
  );
}

export default App;
