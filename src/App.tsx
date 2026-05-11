import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PipelineProvider } from "./context/PipelineContext";
import Home from "./pages/Home";
import PipelineExecution from "./pages/PipelineExecution";
import CreatePipeline from "./pages/CreatePipeline";
import Layout from "./components/Layout";

function App() {
  return (
    <PipelineProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/pipeline/:pipelineId" element={<PipelineExecution />} />
            <Route path="/create" element={<CreatePipeline />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PipelineProvider>
  );
}

export default App;
