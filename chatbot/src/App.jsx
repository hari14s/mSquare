import { useState } from "react";
import UploadForm from "./Components/UploadForm";
import ResultViewer from "./Components/ResultViewer";

function App() {
  const [result, setResult] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
    <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-3xl space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">🔐 Code Vulnerability Scanner</h1>
        <UploadForm onResult={setResult}/>
        <ResultViewer result={result} />
    </div>
    </div>
  );
}

export default App;



