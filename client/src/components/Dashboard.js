import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import AnalyticsDashboard from "./AnalyticsDashboard";
import MoodCalendar from "./MoodCalendar";

function Dashboard({ token }) {
  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: 3 }}>
      <Typography variant="h3" gutterBottom>
        Your Dashboard
      </Typography>

      <AnalyticsDashboard token={token} />

      <Divider sx={{ my: 4 }} />

      <MoodCalendar token={token} />
    </Box>
  );
}

export default Dashboard;
