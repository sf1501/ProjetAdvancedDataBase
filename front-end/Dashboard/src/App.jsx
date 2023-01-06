import logo from './assets/logo.png'
import './App.css'
import AddVoyage from './AddVoyage';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import VoyageTable from './VoyageTable';


function App() {

  return (
    <div className="App">
      <div>
        {/* <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a> */}
          <img src={logo} className="logo react" alt="React logo" />
      </div>
      <h1>Administration des voyages</h1>
      <div className="card">
        <VoyageTable/>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
          integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
          crossorigin="anonymous"
        />
        <AddVoyage></AddVoyage>
      </div>
    </div>
    
  )
}

export default App
