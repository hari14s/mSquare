import { useState } from "react";
import axios from "axios";

function UploadForm({ onResult }) {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [file, setFile] = useState(null);
  const [githubUrl, setGithubUrl] = useState("");

  const handleSubmit = async () => {
    const formData = new FormData();
    if (file) formData.append("codeFile", file);
    else {
      formData.append("pastedCode", code);
      formData.append("selectedLanguage", language);
    }

    try {
      const res = await axios.post("http://localhost:5000/api/analyze", formData);
      onResult(res.data);
    } catch (err) {
      alert("Analysis failed");
      console.error(err);
    }
  };

  return (
    <>
    <textarea
      placeholder="Paste your code here..."
      className="w-full border rounded-lg p-3 font-mono resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      rows={10}
      value={code}
      onChange={(e) => setCode(e.target.value)} /><div className="flex gap-4">
        <input
          type="file"
          className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
          onChange={(e) => setFile(e.target.files[0])} />

          <input
            type="text"
            placeholder="Paste GitHub file URL here"
            className="w-full border p-2 rounded-md text-sm mb-4"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
          />

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="cpp">C/C++</option>
          <option value="ruby">Others</option>
        </select>
      </div>
      <button
        onClick={handleSubmit}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md">
        Analyze Code
      </button>
      </>

  );
}

export default UploadForm;
