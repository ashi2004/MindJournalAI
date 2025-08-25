import React, { useEffect, useState } from "react";
import JournalEntryCard from './Journal/JournalEntryCard';
import { Link } from "react-router-dom";
function JournalFeed({ token, refreshFeed }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // items per page

  useEffect(() => {
    async function fetchEntries(currentPage) {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/journal?page=${currentPage}&limit=${limit}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch entries");
        const data = await res.json();
        console.log("Fetched entries data:", data);
        // Safe checks to avoid undefined/null
        setEntries(Array.isArray(data.entries) ? data.entries : []);
        setTotalPages(typeof data.totalPages === "number" ? data.totalPages : 1);
        setPage(typeof data.page === "number" ? data.page : 1);
      } catch (err) {
        setError(err.message);
        setEntries([]); // Clear entries on error to prevent .map issues
        setTotalPages(1);
        setPage(1);
      }
      setLoading(false);
    }
    fetchEntries(page);
  }, [page, token,refreshFeed]);

  function handleUpdate(updatedEntry) {
    setEntries((prevEntries) =>
      prevEntries.map((e) => (e._id === updatedEntry._id ? updatedEntry : e))
    );
  }

  function handleDelete(deletedId) {
    setEntries((prevEntries) => prevEntries.filter((e) => e._id !== deletedId));
  }

  function handlePrevPage() {
    if (page > 1) setPage(page - 1);
  }

  function handleNextPage() {
    if (page < totalPages) setPage(page + 1);
  }

//   if (loading) return <p>Loading...</p>;
  if (loading) return <div>Loading... <span role="img" aria-label="spinner">⏳</span></div>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!entries || entries.length === 0) return <p>No journal entries yet.</p>;

  return (
    <div>
      <h2>Your Journal Entries</h2>
      {entries.map((entry) => (
         <Link key={entry._id} to={`/entry/${entry._id}`} style={{ textDecoration: "none", color: "inherit" }}>
        <JournalEntryCard
          key={entry._id}
          entry={entry}
          token={token}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
        </Link>
      ))}
      <div style={{ marginTop: 16 }}>
        <button onClick={handlePrevPage} disabled={page === 1}>
          Previous
        </button>{' '}
        <span>
          Page {page} of {totalPages}
        </span>{' '}
        <button onClick={handleNextPage} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

export default JournalFeed;
