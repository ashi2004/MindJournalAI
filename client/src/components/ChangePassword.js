import React, { useState } from "react";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";

function ChangePassword({ token }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const API_BASE = process.env.REACT_APP_API_URL;

  async function handleChange(e) {
    e.preventDefault();
    setMsg("");
    if (newPassword.length < 6) {
      setMsg("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMsg("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/user/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMsg(data.message || "Error changing password.");
      }
    } catch (e) {
      console.log(e);
      setMsg("Network/server error.");
    }
    setLoading(false);
  }

  return (
    <Box
      component="form"
      onSubmit={handleChange}
      sx={{
        marginTop: 4,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxWidth: 400,
        mx: "auto",
      }}
    >
      <Typography variant="h6" component="h4" textAlign="center" gutterBottom>
        Change Password
      </Typography>

      <TextField
        label="Current Password"
        type="password"
        required
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        fullWidth
      />

      <TextField
        label="New Password"
        type="password"
        required
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        fullWidth
      />

      <TextField
        label="Confirm New Password"
        type="password"
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        fullWidth
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
      >
        {loading ? "Changing..." : "Change Password"}
      </Button>

      {msg && (
        <Alert severity={msg.includes("success") ? "success" : "error"} sx={{ mt: 2 }}>
          {msg}
        </Alert>
      )}
    </Box>
  );
}

export default ChangePassword;
