import React from "react";
import AnalyticsDashboard from "./AnalyticsDashboard";
import MoodCalendar from "./MoodCalendar";

function Dashboard({ token }) {
  return (
    <div>
      <h1>Your Dashboard</h1>
      <AnalyticsDashboard token={token} />
      <hr style={{ margin: "30px 0" }} />
      <MoodCalendar token={token} />
    </div>
  );
}

export default Dashboard;
