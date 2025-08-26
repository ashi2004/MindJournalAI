import React, { useState } from "react";

function JournalForm({ token, onEntryCreated }) {
  console.log("Token in JournalForm:", token);

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const API_BASE = process.env.REACT_APP_API_URL;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    // --- Simple validation ---
    if (text.trim().length < 10) {
      setError("Entry must be at least 10 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/journal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("Failed to create entry");
      const data = await res.json();
      setSuccess("Entry saved!");
      setText("");
      setAnalysis({
        mood: data.mood,
        sentiment: data.sentiment,
        themes: data.themes,
        calmingMessage:
          data.calmingMessage || "Remember to take a moment for yourself.",
      });
      setRecommendations(data.recommendations || []);
      onEntryCreated();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h3>Write a new journal entry:</h3>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          style={{ width: "100%" }}
          required
        />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
        {loading && <span style={{ marginLeft: 10 }}>⏳</span>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
      </form>
      {analysis && (
        <div
          style={{
            marginTop: 20,
            padding: 16,
            backgroundColor: "#e6f0f8",
            borderRadius: 8,
          }}
        >
          {/* <h4>How your entry made us feel</h4> */}
          <p style={{ marginTop: 10, fontStyle: "italic" }}>
            {analysis.calmingMessage}
          </p>
          <p>
            <strong>Mood:</strong> {analysis.mood}
          </p>
          <p>
            <strong>Sentiment:</strong> {analysis.sentiment}
          </p>
          <p>
            <strong>Themes:</strong> {analysis.themes.join(", ")}
          </p>
        </div>
      )}
      {recommendations.length > 0 && (
        <div
          style={{
            marginTop: 20,
            padding: 16,
            backgroundColor: "#f0f4f8",
            borderRadius: 8,
          }}
        >
          <h4>Recommended Resources</h4>
          <ul>
            {recommendations.map((rec, idx) => (
              <li key={idx} style={{ marginBottom: 8 }}>
                <a
                  href={rec.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontWeight: "bold", color: "#0056b3" }}
                >
                  {rec.title}
                </a>
                <p style={{ margin: 0 }}>{rec.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default JournalForm;
