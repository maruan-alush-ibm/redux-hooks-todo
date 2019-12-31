import { useState, useEffect } from "react";

const useToDoList = () => {
  const [isSynced, setSynced] = useState(false);
  const [toDos, setToDos] = useState([]);

  useEffect(() => {
    const fetchToDos = async () => {
      setSynced(false);
      const response = await fetch("http://localhost:3010/todos");
      const initialToDos = await response.json();
      setToDos(initialToDos);
      setSynced(true);
    };
    fetchToDos();
  }, []);

  const addToStore = async ({ newToDo }) => {
    const response = await fetch("http://localhost:3010/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newToDo)
    });
    console.log(await response.json());
  };

  const removeFromStore = async ({ id }) => {
    const response = await fetch(`http://localhost:3010/todos/${id}`, {
      method: "PUT"
    });
    console.log(await response.json());
  };

  const addToDo = async ({ info }) => {
    setSynced(false);
    const currentToDos = [...toDos];
    const newToDo = { id: Date.now().toString(), info };
    currentToDos.push(newToDo);
    setToDos(currentToDos);
    await addToStore({ newToDo });
    setSynced(true);
  };

  const removeToDo = async ({ id }) => {
    setSynced(false);
    const indexToRemove = toDos.findIndex(toDo => {
      return toDo.id === id;
    });
    const newToDos = [...toDos];
    newToDos.splice(indexToRemove, 1);
    setToDos(newToDos);
    await removeFromStore({ id });
    setSynced(true);
  };

  return { toDos, isSynced, addToDo, removeToDo };
};

export default useToDoList;
