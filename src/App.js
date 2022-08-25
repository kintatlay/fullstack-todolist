import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import './App.css';

const URL = "http://localhost:4000";

function App() {

  const [input, setInput] = useState("");
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetch(`${URL}/todos`)
    .then(res => res.json())
    .then(data => 
      setTodos(data)  
    );
  },[])

  const handleAdd = () => {


    fetch(`${URL}/todos`,{
      method: "POST",
      body: JSON.stringify({
        content: input
      }),
      headers: {
        "content-type": "application/json"
      }
    })
    .then(res => res.json())
    .then(data => {
      setTodos([...todos, {
        id: data.id,
        content: input
      }])
      setInput("");
    })
  }

  const handleDelete = (todo) => {
      setTodos(prev => {
        const temp = [...prev];
        return temp.filter(t=>{
          if (t.id === todo.id) return false;
          return true;
        })
      })
      fetch(`${URL}/todos/${todo.id}`, {
        method: "DELETE"
      })
    }

  return (
    <div className="App">
      <h1>Full Stack: To Do List</h1>
      <div className="input--center">
        <TextField id="standard-basic" label="Enter a to do" variant="standard" value={input} onChange={(e)=>{setInput(e.target.value)}} />
        <Button variant="outlined" color="primary" onClick={handleAdd}>ADD TODO</Button>
      </div>
      <section className="todo--list--container">
        {todos.map(todo => {
          return <div className="todo--list--row" key={todo.id}>
            <span>{todo.content}</span>
            <div className="todo--buttons--position">
              <Button variant="contained" color="error" onClick={() => handleDelete(todo)}>DELETE</Button>
              <EditTodo id={todo.id} setTodos={setTodos} /> 
            </div>
          </div>
        })}
      </section>
    </div>
  );
}

const EditTodo = ({id, setTodos}) => {
  const [input, setInput] = useState("");
  const [showEdit, setShowEdit] = useState(false);

  const handleEdit = () => {
    fetch(`${URL}/todos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        content: input
      }),
      headers: {
        "content-type": "application/json; charset=utf-8"
      }
    })
    .then(res => res.json())
    .then(data => {
      console.log(data.content)
      setTodos(prev => {
        return prev.map(t=> {
          if (t.id === id) return {
            ...t,
            content: data.content
          }
          return t
        })
      })
      setInput("");
    })
  }

  return <>
    {showEdit
    ?
    <div>
      <input value={input} onChange={
        (e) => setInput(e.target.value)
      } />
      <Button variant="contained" color="success" onClick={handleEdit}>UPDATE</Button>
      <Button variant="contained" color="warning" onClick={() => setShowEdit(!showEdit)}>CLOSE</Button>
    </div>
    :
      <Button variant="contained" color="secondary" onClick={() => setShowEdit(!showEdit)}>EDIT</Button>
    }
  </>
}

export default App;
