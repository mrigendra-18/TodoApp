import { useState } from 'react'
import CreateTask from './components/CreateTask'
import ListTask from './Components/ListTask'
import { useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Toaster } from 'react-hot-toast';

function App() {
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    setTasks(JSON.parse(localStorage.getItem('tasks')) || [])
  }, [])
  return (
    <DndProvider backend={HTML5Backend}>
      <Toaster toastOptions={{
        duration: 3000,
      }} />
    
       
        <CreateTask tasks={tasks} setTasks={setTasks} />
        <ListTask tasks={tasks} setTasks={setTasks} />
      

    </DndProvider>
  )
}

export default App
