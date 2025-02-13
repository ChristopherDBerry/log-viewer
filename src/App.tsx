import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useGetLogs } from './api/generated/default/default';
import type { GetLogs200LogsItem } from './api/generated/logViewerAPI.schemas';


function LogViewer() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data, isLoading, error } = useGetLogs({page, limit });

  if (isLoading) return <p>Loading logs...</p>;
  if (error) return <p>Error loading logs</p>;

  return (
    <div className="p-6">
      <ul>
        {data?.logs?.map((log: GetLogs200LogsItem) => (
          <li key={log.id}>{log.id} {log.timestamp} {log.service} {log.level} {log.message}</li>
        ))}
      </ul>
      <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>Previous</button>
      <span>Page {page}</span>
      <button onClick={() => setPage((p) => p + 1)}>Next</button>
    </div>
  );
}

function GraphView() {
  return <div className="p-6 text-center">Graph View Placeholder</div>;
}

export default function App() {
  return (
    <Router>
      <nav className="p-4 flex gap-4 border-b">
        <Link to="/">Logs</Link>
        <Link to="/graph">Graph</Link>
      </nav>
      <Routes>
        <Route path="/" element={<LogViewer />} />
        <Route path="/graph" element={<GraphView />} />
      </Routes>
    </Router>
  );
}
