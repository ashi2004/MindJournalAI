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

import { Box, Typography, CircularProgress, Paper } from "@mui/material";

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

  const labels = entries.map((e) => new Date(e.entryDate).toLocaleDateString());
  const moods = entries.map((e) => e.mood);
  const sentimentMap = { positive: 1, neutral: 0, negative: -1, mixed: 0.5 };
  const sentimentScores = entries.map((e) => sentimentMap[e.sentiment] ?? 0);

  const moodCounts = {};
  moods.forEach((mood) => {
    moodCounts[mood] = (moodCounts[mood] || 0) + 1;
  });
  const moodLabels = Object.keys(moodCounts);
  const moodData = Object.values(moodCounts);

  return (
    <Box sx={{ my: 4, maxWidth: 700, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Analytics Dashboard
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Sentiment Over Time
            </Typography>
            <Line
              data={{
                labels,
                datasets: [
                  {
                    label: "Sentiment Score (1=positive, 0=neutral, -1=negative)",
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
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Mood Frequency
            </Typography>
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
          </Paper>
        </>
      )}
    </Box>
  );
}

export default AnalyticsDashboard;
