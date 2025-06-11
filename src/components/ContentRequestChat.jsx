import {useState, useEffect, useRef} from "react";

import {
  Card,
  CardContent,
  Box,
  Chip,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import useAIAgent from "../hooks/useAIAgent";

export default function ContentRequestChat() {
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const {messages, isLoading, isConnected, sendInstruction} = useAIAgent();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({behavior: "smooth"});
  }, [messages]);

  const send = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setInput("");

    sendInstruction(trimmed);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div>
      <div className='w-full'>
        <h2 className='text-left mb-5 text-2xl/9 font-bold tracking-tight text-gray-900'>
          IA Content Request Chat
        </h2>
        <Chip
          label={isConnected ? "Connected" : "Connecting..."}
          color={isConnected ? "success" : "warning"}
          size='small'
        />
      </div>
      <Card sx={{maxWidth: 700, mx: "auto"}}>
        <CardContent>
          <Box sx={{height: 400, overflowY: "auto", mb: 2, p: 1}}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{opacity: 0, y: 5}}
                animate={{opacity: 1, y: 0}}
                style={{
                  display: "flex",
                  justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                  marginBottom: 8,
                }}
              >
                <Box
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    maxWidth: {xs: "80%", sm: "60%"},
                    bgcolor: m.role === "user" ? "primary.main" : "grey.300",
                    color:
                      m.role === "user"
                        ? "primary.contrastText"
                        : "text.primary",
                    wordBreak: "break-word",
                  }}
                >
                  {m.text}
                </Box>
              </motion.div>
            ))}

            {/* 3. Mostramos un indicador de carga cuando 'isLoading' es true */}
            {isLoading && (
              <Box sx={{display: "flex", justifyContent: "flex-start", mt: 1}}>
                <CircularProgress size={24} />
              </Box>
            )}

            <div ref={bottomRef} />
          </Box>

          <Box sx={{display: "flex", gap: 1}}>
            <TextField
              fullWidth
              placeholder='Describe the content you need…'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={isLoading || !isConnected}
            />
            <Button variant='contained' onClick={send} disabled={isLoading}>
              Send
            </Button>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}
