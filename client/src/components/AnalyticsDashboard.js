import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the components you need
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function AnalyticsDashboard({ token }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE = process.env.REACT_APP_API_URL || "";

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/journal/analytics`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setEntries(Array.isArray(data.entries) ? data.entries : []);
      } catch (e) {
        setEntries([]);
      }
      setLoading(false);
    }
    fetchAnalytics();
  }, [token]);

  // Prepare data for charts
  const labels = entries.map((e) => new Date(e.entryDate).toLocaleDateString());
  const moods = entries.map((e) => e.mood);
  const sentimentMap = { positive: 1, neutral: 0, negative: -1, mixed: 0.5 };
  const sentimentScores = entries.map((e) => sentimentMap[e.sentiment] ?? 0);

  // Count moods frequency for bar chart
  const moodCounts = {};
  moods.forEach((mood) => {
    moodCounts[mood] = (moodCounts[mood] || 0) + 1;
  });
  const moodLabels = Object.keys(moodCounts);
  const moodData = Object.values(moodCounts);

  return (
    <div style={{ margin: "32px 0" }}>
      <h2>Analytics Dashboard</h2>
      {loading ? (
        <p>Loading analytics...</p>
      ) : (
        <>
          <div style={{ maxWidth: 600 }}>
            <h4>Sentiment Over Time</h4>
            <Line
              data={{
                labels,
                datasets: [
                  {
                    label:
                      "Sentiment Score (1=positive, 0=neutral, -1=negative)",
                    data: sentimentScores,
                    borderColor: "blue",
                    fill: false,
                  },
                ],
              }}
              options={{
                scales: {
                  y: { min: -1, max: 1 },
                },
              }}
            />
          </div>
          <div style={{ maxWidth: 600, marginTop: 30 }}>
            <h4>Mood Frequency</h4>
            <Bar
              data={{
                labels: moodLabels,
                datasets: [
                  {
                    label: "Number of Days",
                    data: moodData,
                    backgroundColor: "orange",
                  },
                ],
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default AnalyticsDashboard;
