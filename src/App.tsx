import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import FindTopic from "./pages/FindTopic";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const Tools = lazy(() => import("./pages/Tools"));
const ArticleList = lazy(() => import("./pages/ArticleList"));
const Article = lazy(() => import("./pages/Article"));

// Tools
const BoothsAlgorithm = lazy(() => import("./pages/tools/BoothsAlgorithm"));
const NumberConversion = lazy(() => import("./pages/tools/NumberConversion"));
const AdditionSubtraction = lazy(() => import("./pages/tools/AdditionSubtraction"));
const POSET = lazy(() => import("./pages/tools/POSET"));
const BoothsDivisionAlgorithm = lazy(() => import("./pages/tools/BoothsDiv"));
const WarshallAlgorithm = lazy(() => import("./pages/tools/WarshallAlgorithm"));
const BubbleSortAlgorithm = lazy(() => import("./pages/tools/BubbleSortAlgorithm"));
const SelectionSortAlgorithm = lazy(() => import("./pages/tools/SelectionSortAlgorithm"));
const FractionalKnapsack = lazy(() => import("./pages/tools/FractionalKnapsack"));
const ZeroOneKnapsackProblem = lazy(() => import("./pages/tools/ZeroOneKnapsackProblem"));
const InsertionSortAlgorithm = lazy(() => import("./pages/tools/InsertionSortAlgorithm"));
const MergeSortAlgorithm = lazy(() => import("./pages/tools/MergeSortAlgorithm"));
const QuickSortAlgorithm = lazy(() => import("./pages/tools/QuickSortAlgorithm"));
const MCM = lazy(() => import("./pages/tools/MCM"));
const StringMatching = lazy(() => import("./pages/tools/StringMatching"));
const LCS = lazy(() => import("./pages/tools/LCS"));
const EulerianPath = lazy(() => import("./pages/tools/EulerianPath"));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const App = () => {
  return (
    <Router>
      <Layout>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/tools' element={<Tools />} />
            <Route path='/articles' element={<ArticleList />} />
            <Route path="/article/:title" element={<Article />} />

            {/* Dynamic Topic Route */}
            <Route path="/why-do-we-learn/:topic" element={<FindTopic />} />

            {/* Algorithm Tools Routes */}
            <Route path="/tools/booths-algorithm" element={<BoothsAlgorithm />} />
            <Route path="/tools/number-conversion" element={<NumberConversion />} />
            <Route path="/tools/binary-arithmetic" element={<AdditionSubtraction />} />
            <Route path="/tools/poset" element={<POSET />} />
            <Route path="/tools/division-algorithm" element={<BoothsDivisionAlgorithm />} />
            <Route path="/tools/warshall-algorithm" element={<WarshallAlgorithm />} />
            <Route path="/tools/bubble-sort" element={<BubbleSortAlgorithm />} />
            <Route path="/tools/selection-sort" element={<SelectionSortAlgorithm />} />
            <Route path="/tools/fractional-knapsack" element={<FractionalKnapsack />} />
            <Route path="/tools/0-1-knapsack" element={<ZeroOneKnapsackProblem />} />
            <Route path="/tools/insertion-sort" element={<InsertionSortAlgorithm />} />
            <Route path="/tools/merge-sort" element={<MergeSortAlgorithm />} />
            <Route path="/tools/quick-sort" element={<QuickSortAlgorithm />} />
            <Route path="/tools/matrix-chain-multiplication" element={<MCM />} />
            <Route path="/tools/string-matching" element={<StringMatching />} />
            <Route path="/tools/longest-common-subsequence" element={<LCS />} />
            <Route path="/tools/eulerian-path" element={<EulerianPath />} />

            {/* 404 Route */}
            <Route path="*" element={
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <h1 className="text-4xl font-bold text-destructive">404</h1>
                <p className="text-xl text-muted-foreground">Page not found</p>
                <a href="/" className="text-primary hover:underline">Go back home</a>
              </div>
            } />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;
