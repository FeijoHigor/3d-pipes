import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PipelineExecution from "./pages/PipelineExecution";
import Layout from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/pipeline/:pipelineId" element={<PipelineExecution />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
