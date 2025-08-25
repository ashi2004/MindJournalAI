import React, { useState } from "react";

function ChangePassword({ token }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

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
      const res = await fetch("/api/user/password", {
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
    <form onSubmit={handleChange} style={{ marginTop: 24 }}>
      <h4>Change Password</h4>
      <input
        type="password"
        placeholder="Current password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        required
      /><br />
      <input
        type="password"
        placeholder="New password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      /><br />
      <input
        type="password"
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      /><br />
      <button type="submit" disabled={loading}>
        {loading ? "Changing..." : "Change Password"}
      </button>
      {msg && <div style={{ color: msg.includes("success") ? "green" : "red" }}>{msg}</div>}
    </form>
  );
}

export default ChangePassword;
