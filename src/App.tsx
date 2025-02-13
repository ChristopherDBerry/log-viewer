import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useGetLogs, useGetLogsAggregate} from './api/generated/default/default';

import type { GetLogs200LogsItem, GetLogsAggregateTimeframe, GetLogsAggregateField } from './api/generated/logViewerAPI.schemas';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const GraphView = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(400);
  const [timeframe, setTimeframe] = useState<GetLogsAggregateTimeframe>("hourly");
  const [field, setField] = useState<GetLogsAggregateField>("message"); // Default to message

  const { data, isLoading, error } = useGetLogsAggregate({ page, limit, timeframe, field });

  if (isLoading) return <p>Loading aggregated logs...</p>;
  if (error) return <p>Error loading aggregated logs</p>;

  // Group data by time with multiple lines per unique field value
  const groupedData = data?.reduce((acc, log) => {
    const existingEntry = acc.find((entry) => entry.time === log.time);
    if (existingEntry) {
      existingEntry[log[field]] = log.total;
    } else {
      acc.push({ time: log.time, [log[field]]: log.total });
    }
    return acc;
  }, [] as Record<string, any>[]);

  // Get unique field values for different lines
  const uniqueFieldValues = Array.from(new Set(data?.map((log) => log[field])));

  return (
    <div className="p-6">
      {/* Filters */}
      <form className="mb-4 flex gap-4">
        <label>
          Timeframe:
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as GetLogsAggregateTimeframe)}
          >
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </label>

        <label>
          Field:
          <select
            value={field}
            onChange={(e) => setField(e.target.value as GetLogsAggregateField)}
          >
            <option value="message">Message</option>
            <option value="service">Service</option>
            <option value="level">Level</option>
          </select>
        </label>

        <label>
          Limit:
          <input
            type="number"
            value={limit}
            min="1"
            onChange={(e) => setLimit(Number(e.target.value))}
          />
        </label>
      </form>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={groupedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          {uniqueFieldValues.map((value, index) => (
            <Line
              key={value}
              type="monotone"
              dataKey={value}
              stroke={`hsl(${index * 50}, 70%, 50%)`}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      {/* Pagination */}
      <div className="mt-4">
        <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
          Previous
        </button>
        <span className="mx-2">Page {page}</span>
        <button onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>
    </div>
  );
};

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
