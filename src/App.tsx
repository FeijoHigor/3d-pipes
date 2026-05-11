import { BrowserRouter, Routes, Route } from "react-router-dom";
import { usePipelines } from "./hooks/usePipelines";
import Home from "./pages/Home";
import PipelineExecution from "./pages/PipelineExecution";
import CreatePipeline from "./pages/CreatePipeline";
import Layout from "./components/Layout";

function App() {
  const { pipelines, addPipeline, removePipeline, findPipeline } = usePipelines();

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home pipelines={pipelines} onRemove={removePipeline} />} />
          <Route
            path="/pipeline/:pipelineId"
            element={<PipelineExecution findPipeline={findPipeline} />}
          />
          <Route
            path="/create"
            element={<CreatePipeline onSave={addPipeline} />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
