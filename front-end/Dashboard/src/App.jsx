import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import TrainTable from './TrainTable';
import Add from './Add';
import AddVoyage from './AddVoyage';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { useForm } from 'react-hook-form';
import VoyageTable from './VoyageTable';


function App() {
  const [count, setCount] = useState(0)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Spaceships trips</h1>
      <div className="card">
        {/* <TrainTable/> */}
        <VoyageTable/>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
          integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
          crossorigin="anonymous"
        />
        {/* <Add/> */}
        <AddVoyage></AddVoyage>
      </div>
    </div>
    
  )
}

export default App