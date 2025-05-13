import io from 'socket.io-client';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const App = () => {

  // LOCAL STATE
  const [socket, setSocket] = useState();
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');

  useEffect(() => {
    // CONNECTION
    const socket = io('ws://localhost:8000', { transports: ['websocket'] });
    setSocket(socket);
    
    // LISTENERS
    socket.on('removeTask', (id) => {
      removeTask(id);
    });

    socket.on('addTask', (task) => {
      addTask(task);
    });

    socket.on('updateData', (tasks) => {
      setTasks(tasks);
    });

    // DISCONNECTION
    return () => {
      socket.disconnect();
    };
  },[]);

  // useEffect(() => {
  //   console.log(tasks);
  // }, [tasks]);

  const removeTask = (id, broadcast=false) => {
    setTasks(tasks => tasks.filter(task => task.id !== id));
    if (broadcast) socket.emit('removeTask', id);
  };

  const addTask = (task, broadcast=false) => {
    setTasks(tasks => [...tasks, task]);
    if (broadcast) socket.emit('addTask', task);
  };

  // const editTask = id => {
  //   console.log('not yet');
  //   console.log('id: ', id);
  // };

  const handleSubmit = e => {
    e.preventDefault();
    addTask({id: uuidv4(), name: taskName}, true);
    setTaskName('');
  };

  return (
    <div className="App">
      <header>
      <h1>ToDoList.app</h1>
    </header>

    <section className="tasks-section" id="tasks-section">
      <h2>Tasks</h2>

      <ul className="tasks-section__list" id="tasks-list">
        {tasks.map(task => (
          <li className="task" key={task.id}>
          {task.name}
          <div className="buttons">
            {/* <button className="btn btn--orange" onClick={() => editTask(task.id)}>Edit</button> */}
            <button className="btn btn--red" onClick={() => removeTask(task.id, true)}>X</button>
          </div>
        </li>
        ))}
      </ul>

      <form id="add-task-form" onSubmit={handleSubmit}>
        <input className="text-input" autoComplete="off" type="text" value={taskName} onChange={e => setTaskName(e.target.value)} placeholder="Type your description" id="task-name" />
        <button className="btn" type="submit">Add</button>
      </form>

    </section>
    </div>
  );
}

export default App;
