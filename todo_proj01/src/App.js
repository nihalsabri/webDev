
import React, { useState, useEffect , useRef }from "react";
import "./App.css";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [inputText, setInputText] = useState("");
  const isInitialLoad = useRef(true);

  // Load tasks from localStorage on initial render
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    console.log("Loaded tasks:", savedTasks); 
    setTasks(savedTasks);
  }, []);
  
   // Save tasks to localStorage
   useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }
    console.log("Saving tasks:", tasks);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);


  const addTask = () => {
    if (inputText.trim()) {
      const newTask = {
        id: Date.now(),
        text: inputText,
        completed: false,
      };
      setTasks([...tasks, newTask]);
      setInputText("");
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Drag-and-drop logic
// contain 3 stages 1- allow drag by pervent any default status 
//  2- darg - know and store the task , moving ( by using setData ) 
// 3- drop : read the data we saved , getData  ==== here we wrok on index 

   const handleDragStart = (e, index) => {
    e.dataTransfer.setData("text/plain", index);
  };

  const  allowDrag = (e) => {
    e.preventDefault(); 
  };


////// here is we get the index ( taarget :: new index for the task )
// 1= know the targetindex ( new index ) --- all tasks indexed in on array 
// 2= we remove this task ! -- same idea of the swap ,, so we store the value of the task before removing it 
// 3= we use spilce to add ( storedvalue of the moving task) to (the new index , traget which is the argument of the function)
// 4= then we publish the edition , our implementation , how it would appear ! ?  ---- >>>> in setTasks ! which declare all tasks 
  const handleDrop = (e, targetIndex) => {
    const sourceIndex = e.dataTransfer.getData("text/plain");
    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(sourceIndex, 1);
    updatedTasks.splice(targetIndex, 0, movedTask);/// 0 - remove nothing , third term - to add value 
    setTasks(updatedTasks);
  };

  // Separate tasks into incomplete and completed
  const incompleteTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className="app">
      <header>
        <h1>TODO List React App</h1>
      </header>
      {/* input Section */}
      <div className="input-container">
        <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)}  placeholder="Add a new task" />
        <button onClick={addTask}>
          <i className="fas fa-plus"></i>
        </button>
      </div>

      {/* Tasks Section */}
      <h2>Tasks to do ({incompleteTasks.length})</h2>
      <div>
        {incompleteTasks.map((task, index) => (
          <div
            key={task.id}
            className={`task ${task.completed ? "completed" : ""}`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={allowDrag}
            onDrop={(e) => handleDrop(e, index)}
          >
            <span>{task.text}</span>
            <div>
              <button onClick={() => toggleComplete(task.id)}>
                <i className="far fa-circle"></i>
              </button>
              <button onClick={() => deleteTask(task.id)}>
                <i className="far fa-trash-alt"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Completed Tasks Section */}
      <h2>Done ({completedTasks.length})</h2>
      <div>
        {completedTasks.map((task, index) => (
          <div
            key={task.id}
            className={`task ${task.completed ? "completed" : ""}`}
            draggable
            onDragStart={(e) => handleDragStart(e, index + incompleteTasks.length)} //  tasks array is offset by the number of incomplete tasks
            onDragOver={allowDrag}
            onDrop={(e) => handleDrop(e, index + incompleteTasks.length)}
          >
            <span>{task.text}</span>
            <div>
              <button onClick={() => toggleComplete(task.id)}>
                <i className="fas fa-undo"></i>
              </button>
              <button onClick={() => deleteTask(task.id)}>
                <i className="far fa-trash-alt"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;