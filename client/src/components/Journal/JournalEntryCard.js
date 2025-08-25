import React, { useState } from "react";

function JournalEntryCard({ entry, token, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(entry.text);
  const [mood, setMood] = useState(entry.mood);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/journal/${entry._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text, mood }),
      });
      if (!res.ok) throw new Error("Failed to update entry");
      const updated = await res.json();
      onUpdate(updated);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/journal/${entry._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete entry");
      await res.json();
      onDelete(entry._id);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  if (isEditing) {
    return (
      <div style={{ border: "1px solid #ccc", margin: 8, padding: 8 }}>
        <textarea
          rows={4}
          style={{ width: "100%" }}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {/* <input
          type="text"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          placeholder="Mood"
          style={{ width: "200px", marginTop: 8 }}
        /> */}
        <br />
        <button onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
        <button onClick={() => setIsEditing(false)} disabled={loading}>
          Cancel
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    );
  }

  return (
    <div style={{ border: "1px solid #ccc", margin: 8, padding: 8 }}>
      <div>{new Date(entry.entryDate).toLocaleDateString()}</div>
      <div><strong>Text:</strong> {entry.text}</div>
      <div><strong>Mood:</strong> {entry.mood}</div>
      <div><strong>Sentiment:</strong> {entry.sentiment}</div>
      <div><strong>Themes:</strong> {entry.themes.join(", ")}</div>
      <button onClick={() => setIsEditing(true)}>Edit</button>
      <button onClick={handleDelete} disabled={loading}>
        {loading ? "Deleting..." : "Delete"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default JournalEntryCard;
