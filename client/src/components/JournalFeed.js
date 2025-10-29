import React, { useEffect, useState } from "react";
import JournalEntryCard from "./Journal/JournalEntryCard";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Stack,
  Pagination,
} from "@mui/material";

function JournalFeed({ token, refreshFeed }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // items per page
  const API_BASE = process.env.REACT_APP_API_URL;

  useEffect(() => {
    async function fetchEntries(currentPage) {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `${API_BASE}/api/journal?page=${currentPage}&limit=${limit}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch entries");
        const data = await res.json();
        setEntries(Array.isArray(data.entries) ? data.entries : []);
        setTotalPages(typeof data.totalPages === "number" ? data.totalPages : 1);
        setPage(typeof data.page === "number" ? data.page : 1);
      } catch (err) {
        setError(err.message);
        setEntries([]);
        setTotalPages(1);
        setPage(1);
      }
      setLoading(false);
    }
    fetchEntries(page);
  }, [page, token, refreshFeed]);

  function handleUpdate(updatedEntry) {
    setEntries((prevEntries) =>
      prevEntries.map((e) => (e._id === updatedEntry._id ? updatedEntry : e))
    );
  }

  // function handleDelete(deletedId) {
  //   setEntries((prevEntries) => prevEntries.filter((e) => e._id !== deletedId));
  // }

  function handlePageChange(event, value) {
    setPage(value);
  }

  if (loading)
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Alert severity="error" sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
        {error}
      </Alert>
    );
  if (!entries || entries.length === 0)
    return (
      <Typography variant="body1" sx={{ maxWidth: 600, mx: "auto", mt: 4, textAlign: "center" }}>
        No journal entries yet.
      </Typography>
    );

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4, px: 2 }}>
      <Typography variant="h4" gutterBottom>
        Your Journal Entries
      </Typography>

      <Stack spacing={2}>
        {entries.map((entry) => (
          <Link
            key={entry._id}
            to={`/entry/${entry._id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <JournalEntryCard
              entry={entry}
              token={token}
              onUpdate={handleUpdate}
              // onDelete={handleDelete}
            />
          </Link>
        ))}
      </Stack>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>
    </Box>
  );
}

export default JournalFeed;
