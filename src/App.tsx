import Navbar from "./Navbar"
import { BrowserRouter as Router, Route, Routes, useParams } from "react-router-dom"
import Home from "./pages/Home"
import Tools from "./pages/Tools"
import BoothsAlgorithm from "./pages/tools/BoothsAlgorithm"
import NumberConversion from "./pages/tools/NumberConversion"
import AdditionSubtraction from "./pages/tools/AdditionSubtraction"
import POSET from "./pages/tools/POSET"
import SetTheory from "./posts/SetTheory"
import BoothsDivisionAlgorithm from "./pages/tools/BoothsDiv"
import WarshallAlgorithm from "./pages/tools/WarshallAlgorithm"
import DiscreteMath from "./posts/DiscreteMath"
import Article, {ArticleList} from "./pages/Article"

const App = () => {
  const FindTopic = () => {
    const { topic } = useParams();
    if (topic === 'set-theory') {
      return <SetTheory />
    }
    if (topic === 'discrete-mathematics') {
      return (
        <>
          <DiscreteMath />
        </>
      )
    }
    return <h1>404 Not Found</h1>
  }
  return (
    <>
      <Router>
        <Navbar />

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/tools' element={<Tools />} />
          <Route path='/articles' element={<ArticleList />} />
          <Route path="/tools/booths-algorithm" element={<BoothsAlgorithm />} />
          <Route path="/tools/number-conversion" element={<NumberConversion />} />
          <Route path="/tools/binary-arithmetic" element={<AdditionSubtraction />} />
          <Route path="/tools/poset" element={<POSET />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
          <Route path="/why-do-we-learn/:topic" element={<FindTopic />} />
          <Route path="/tools/division-algorithm" element={<BoothsDivisionAlgorithm />} />
          <Route path="/tools/warshall-algorithm" element={<WarshallAlgorithm />} />
          <Route path="/article/:title" element={<Article />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
