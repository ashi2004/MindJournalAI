import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function MoodCalendar({ token }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState(new Date()); // Selected date

  useEffect(() => {
    async function fetchEntries() {
      setLoading(true);
      try {
        const res = await fetch(`/api/journal?page=1&limit=9999`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch entries");
        const data = await res.json();
        setEntries(data.entries || []);
      } catch {
        setEntries([]);
      }
      setLoading(false);
    }
    fetchEntries();
  }, [token]);

  // Aggregate mood emojis per date and find dominant emoji for the day
  const dayEmojiCounts = {}; // { 'dateStr' : { emoji: count, ... } }

  entries.forEach(({ entryDate, emoji }) => {
    const dateStr = new Date(entryDate).toDateString();
    if (!dayEmojiCounts[dateStr]) dayEmojiCounts[dateStr] = {};
    const em = emoji || "🙂";
    dayEmojiCounts[dateStr][em] = (dayEmojiCounts[dateStr][em] || 0) + 1;
  });

  // Find dominant emoji per day
  const dominantEmojiPerDay = {};
  Object.entries(dayEmojiCounts).forEach(([dateStr, emojiCount]) => {
    const sorted = Object.entries(emojiCount).sort((a, b) => b[1] - a[1]);
    dominantEmojiPerDay[dateStr] = sorted[0][0]; // most frequent emoji
  });

  // Details of entries for selected date
  const selectedDateStr = value.toDateString();
  const entriesForSelectedDate = entries.filter(
    (e) => new Date(e.entryDate).toDateString() === selectedDateStr
  );

  return (
    <>
      <h2>Mood Calendar</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Calendar
          onChange={setValue}
          value={value}
          tileContent={({ date, view }) => {
            if (view === "month") {
              const emoji = dominantEmojiPerDay[date.toDateString()];
              if (emoji) {
                return (
                  <div
                    style={{ fontSize: 18, textAlign: "center", marginTop: 4 }}
                    title={`Mood: ${emoji}`}
                  >
                    {emoji}
                  </div>
                );
              }
            }
            return null;
          }}
        />
      )}

      {entriesForSelectedDate.length > 0 ? (
        <div
          style={{
            marginTop: 20,
            padding: 16,
            border: "1px solid #ccc",
            borderRadius: 8,
          }}
        >
          <h3>Entries on {value.toLocaleDateString()}</h3>
          {entriesForSelectedDate.map((entry) => (
            <div key={entry._id} style={{ marginBottom: 16 }}>
              <p>
                <strong>Emoji:</strong> {entry.emoji || "🙂"} &nbsp;&nbsp;
                <strong>Mood:</strong> {entry.mood}
              </p>
              <p><strong>Sentiment:</strong> {entry.sentiment}</p>
              <p><strong>Themes:</strong> {entry.themes.join(", ")}</p>
              <p>{entry.text}</p>
              <hr />
            </div>
          ))}
        </div>
      ) : (
        <p style={{ marginTop: 20 }}>Select a date with an entry to see details</p>
      )}
    </>
  );
}

export default MoodCalendar;
