/**
 * UsernamePrompt.js
 * 
 * Component that renders the initial lobby screen before joining a video call.
 * Displays a preview of the user's camera feed, provides an input field for username entry,
 * and includes a connect button to join the video call. This serves as the entry point
 * for users before they enter the main video conference interface.
 * 
 * - Shows local video preview
 * - Handles username input
 * - Provides connection interface
 */

import React from 'react';
import { TextField, Button } from '@mui/material';

const UsernamePrompt = ({ 
  username, 
  setUsername, 
  localVideoref, 
  onConnect 
}) => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "Center",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <h2>Enter into Lobby </h2>
      <video
        ref={localVideoref}
        width="320"
        height="240"
        autoPlay
        muted
        style={{
          borderRadius: "8px",
          objectFit: "cover",
        }}
      ></video>
      <div>
        <TextField
          id="outlined-basic"
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          variant="outlined"
        />
        <Button variant="contained" onClick={onConnect}>
          Connect
        </Button>
      </div>
    </div>
  );
};

export default UsernamePrompt;