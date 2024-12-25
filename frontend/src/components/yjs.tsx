import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { QuillBinding } from "y-quill";
import Quill from "quill";
import QuillCursors from "quill-cursors";
import { useEffect, useRef, useState } from "react";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Stack,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LoginIcon from "@mui/icons-material/Login";

Quill.register("modules/cursors", QuillCursors);
const webSocket = new WebSocket("ws://localhost:8080");

function Yjs() {
  const [roomId, setRoomId] = useState("");
  const [roomName, setRoomName] = useState("");
  const handleJoinRoom = () => {
    console.log("Joining room", roomId);
    webSocket.send(
      JSON.stringify({
        type: "join",
        roomId: roomId,
      })
    );

    webSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "join") {
        console.log("Joined room", data.roomId);
        const ydoc = new Y.Doc();
        const provider = new WebsocketProvider(
          "ws://localhost:1234",
          roomId,
          ydoc
        );
        const quill = new Quill(document.querySelector("#editor"), {
          modules: {
            cursors: true,
            toolbar: [
              [{ header: [1, 2, false] }],
              ["bold", "italic", "underline"],
              ["image", "code-block"],
            ],
            history: {
              userOnly: true,
            },
          },
          placeholder: "Start collaborating...",
          theme: "snow",
        });
        const ytext = ydoc.getText("quill");
        const binding = new QuillBinding(ytext, quill);
      }
      else if (data.type === "error") {
        console.log("Error", data.message);
      }
    };
  };
  const handleCreateRoom = () => {
    console.log("Creating room", roomName);

    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider("ws://localhost:1234", roomId, ydoc);
    const quill = new Quill(document.querySelector("#editor"), {
      modules: {
        cursors: true,
        toolbar: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline"],
          ["image", "code-block"],
        ],
        history: {
          userOnly: true,
        },
      },
      placeholder: "Start collaborating...",
      theme: "snow",
    });
    const ytext = ydoc.getText("quill");
    const binding = new QuillBinding(ytext, quill);

    webSocket.send(
      JSON.stringify({
        type: "create",
        roomName: roomName,
        roomId: roomId,
      })
    );
  };

  useEffect(() => {
    webSocket.onopen = () => {
      console.log("WebSocket connected");
    };
  }, [roomId]);
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom color="primary">
          Collaborative Editor
        </Typography>

        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Join Existing Room
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                label="Room ID"
                variant="outlined"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter room ID"
                size="small"
              />
              <Button
                variant="contained"
                onClick={() => handleJoinRoom()}
                startIcon={<LoginIcon />}
                sx={{ minWidth: "120px" }}
              >
                Join
              </Button>
            </Stack>
          </Box>

          <Divider>OR</Divider>

          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Create New Room
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                label="Room ID"
                variant="outlined"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter room ID"
                size="small"
              />
              <TextField
                fullWidth
                label="Room Name"
                variant="outlined"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Enter room name"
                size="small"
              />
              <Button
                variant="contained"
                color="success"
                onClick={handleCreateRoom}
                startIcon={<AddIcon />}
                sx={{ minWidth: "120px" }}
              >
                Create Room
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>

      <Paper
        elevation={3}
        sx={{
          p: 2,
          minHeight: "500px",
          "& .ql-toolbar": {
            borderTop: "none",
            borderLeft: "none",
            borderRight: "none",
            borderRadius: "4px 4px 0 0",
          },
          "& .ql-container": {
            borderBottom: "none",
            borderLeft: "none",
            borderRight: "none",
            minHeight: "450px",
          },
        }}
      >
        <div id="editor" />
      </Paper>
    </Container>
  );
}

export default Yjs;
