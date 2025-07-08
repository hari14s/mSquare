// function ResultViewer({ result }) {
//   if (!result) return null;
//   if (result.issues?.length === 0) return <p>No issues found 🎉</p>;

//   return (
//     <div className="mt-4">
//       <h2 className="font-bold mb-2">Issues (via {result.toolUsed})</h2>
//       <ul className="space-y-2">
//         {result.issues.map((issue, idx) => (
//           <li key={idx} className="border p-2 rounded shadow">
//             <p><strong>File:</strong> {issue.file}</p>
//             <p><strong>Line:</strong> {issue.line}</p>
//             <p><strong>Issue:</strong> {issue.issue}</p>
//             <p><strong>Severity:</strong> {issue.severity}</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

const getColor = (severity) => {
  if (severity === "HIGH") return "bg-red-500";
  if (severity === "MEDIUM") return "bg-orange-400";
  if(severity == "WARNING") return "bg-yellow-500";
  return "bg-green-500";
};

function ResultViewer({ result }) {
  if (!result) return null;
  if (result.issues?.length === 0) return <p className="text-green-600 font-medium">No issues found</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Detected Issues ({result.toolUsed})</h2>
      {result.issues.map((issue, i) => (
        <div key={i} className="border border-gray-300 p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-600 mb-1">File: {issue.file}</div>
          <div className="text-sm">Line: {issue.line}</div>
          <div className="text-sm font-medium mt-1">⚠️ {issue.issue}</div>
          <span className={`inline-block mt-2 px-3 py-1 text-white text-xs rounded-full ${getColor(issue.severity)}`}>
            {issue.severity}
          </span>
        </div>
      ))}
    </div>
  );
}

export default ResultViewer;
