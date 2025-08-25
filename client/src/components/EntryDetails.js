import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EntryDetails({ token }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEntry() {
      setLoading(true);
      try {
        const res = await fetch(`/api/journal/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load entry");
        const data = await res.json();
        setEntry(data);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    }
    fetchEntry();
  }, [id, token]);

  if (loading) return <p>Loading entry...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!entry) return <p>Entry not found.</p>;

  return (
    <div style={{ padding: 24, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>Entry Details</h2>
      <div><strong>Date:</strong> {new Date(entry.entryDate).toLocaleDateString()}</div>
      <div><strong>Mood:</strong> {entry.mood}</div>
      <div><strong>Sentiment:</strong> {entry.sentiment}</div>
      <div><strong>Themes:</strong> {entry.themes.join(", ")}</div>
      <div style={{ marginTop: 16 }}><strong>Text:</strong></div>
      <div>{entry.text}</div>
      <button style={{ marginTop: 24 }} onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}

export default EntryDetails;
