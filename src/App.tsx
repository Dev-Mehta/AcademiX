import Navbar from "./Navbar"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import LearnX from "./pages/LearnX"
import Tools from "./pages/Tools"
import BoothsAlgorithm from "./pages/tools/BoothsAlgorithm"

const App = () => {
  return (
    <>
      <Router>
        <Navbar />

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/tools' element={<Tools />} />
          <Route path='/learn-x' element={<LearnX />} />
          <Route path="/tools/booths-algorithm" element={<BoothsAlgorithm />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;