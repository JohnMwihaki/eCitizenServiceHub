import React, { useState } from "react";
import {
  Box,
  Fab,
  Paper,
  Typography,
  IconButton,
  TextField,
  Button,
  Chip,
  Stack,
  Divider,
  Collapse,
  CircularProgress,
} from "@mui/material";
import {
  SmartToy as BotIcon,
  Close as CloseIcon,
  Send as SendIcon,
  Translate as LangIcon,
  ContentCopy as CopyIcon,
  Launch as LaunchIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

interface ChatMessage {
  sender: "user" | "bot";
  text: string;
  suggestedCategory?: { id: string; name: string; code: string } | null;
  missingInfoTips?: string[];
  provider?: string;
}

export const AIAssistantWidget: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState<"en" | "sw">("en");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "bot",
      text:
        language === "en"
          ? "Hello! I am your County AI Assistant. I can help you find the right department for your issue, draft a clear report, or explain request statuses. How can I help you today?"
          : "Habari! Mimi ni Msaidizi wa AI wa Kaunti. Ninaweza kukusaidia kuchagua kitengo sahihi, kuandika ripoti ya tatizo lako, au kuelewa hatua za ombi lako. Una swali gani?",
    },
  ]);

  const starterPrompts =
    language === "en"
      ? [
          "Which category fits a burst water pipe?",
          "Help me draft a road repair report",
          'What does "AWAITING_CITIZEN" mean?',
        ]
      : [
          "Je, bomba la maji lililopasuka liko kitengo gani?",
          "Nisaidie kuandika ripoti ya barabara mbovu",
          'Maana ya "AWAITING_CITIZEN" ni nini?',
        ];

  const handleSend = async (messageToSend?: string) => {
    const text = (messageToSend || input).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/ai/assist", {
        message: text,
        language,
      });

      if (res.data?.success && res.data?.data) {
        const botData = res.data.data;
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: botData.reply,
            suggestedCategory: botData.suggestedCategory,
            missingInfoTips: botData.missingInfoTips,
            provider: botData.provider,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            language === "en"
              ? "I apologize, the assistant is temporarily unreachable. You can browse categories directly in the Services tab."
              : "Samahani, huduma ya msaidizi haipatikani kwa sasa. Unaweza kuangalia vitengo kwenye menyu ya Huduma.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box sx={{ position: "fixed", bottom: 24, right: 24, zIndex: 1200 }}>
      {/* Floating Action Button */}
      {!open && (
        <Fab
          color="secondary"
          aria-label="citizen-assistant"
          onClick={() => setOpen(true)}
          sx={{
            bgcolor: "#0F8B8D",
            color: "#FFFFFF",
            boxShadow: "0 4px 20px rgba(15,139,141,0.4)",
            "&:hover": { bgcolor: "#0c7375" },
          }}
        >
          <BotIcon />
        </Fab>
      )}

      {/* Chat Popover Window */}
      <Collapse in={open}>
        <Paper
          elevation={4}
          sx={{
            width: { xs: 320, sm: 380 },
            height: 520,
            display: "flex",
            flexDirection: "column",
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid #CBD5E1",
            boxShadow: "0 12px 36px rgba(18,48,74,0.2)",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 1.8,
              bgcolor: "#12304A",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <BotIcon sx={{ color: "#0F8B8D", fontSize: 24 }} />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                  County AI Assistant
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "#94A3B8", fontSize: "0.68rem" }}
                >
                  Category Guide & Report Drafter
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {/* Language Switcher */}
              <Chip
                icon={
                  <LangIcon sx={{ fontSize: 14, color: "#fff !important" }} />
                }
                label={language === "en" ? "EN" : "SW"}
                size="small"
                onClick={() => setLanguage(language === "en" ? "sw" : "en")}
                sx={{
                  bgcolor: "rgba(255,255,255,0.12)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  cursor: "pointer",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                }}
              />
              <IconButton
                size="small"
                onClick={() => setOpen(false)}
                sx={{ color: "#fff" }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* Messages Body */}
          <Box
            sx={{ flexGrow: 1, p: 2, overflowY: "auto", bgcolor: "#F8FAFC" }}
          >
            {messages.map((m, idx) => (
              <Box
                key={idx}
                sx={{
                  display: "flex",
                  justifyContent:
                    m.sender === "user" ? "flex-end" : "flex-start",
                  mb: 1.5,
                }}
              >
                <Box
                  sx={{
                    maxWidth: "85%",
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: m.sender === "user" ? "#0F8B8D" : "#FFFFFF",
                    color: m.sender === "user" ? "#FFFFFF" : "#1E293B",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                    border: m.sender === "bot" ? "1px solid #E2E8F0" : "none",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontSize: "0.82rem", whiteSpace: "pre-line" }}
                  >
                    {m.text}
                  </Typography>

                  {/* Missing Info Tips */}
                  {m.missingInfoTips && m.missingInfoTips.length > 0 && (
                    <Box
                      sx={{ mt: 1, p: 1, bgcolor: "#FEF3C7", borderRadius: 1 }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 700,
                          color: "#92400E",
                          display: "block",
                        }}
                      >
                        Helpful details to include:
                      </Typography>
                      {m.missingInfoTips.map((tip, tIdx) => (
                        <Typography
                          key={tIdx}
                          variant="caption"
                          sx={{ color: "#78350F", display: "block" }}
                        >
                          • {tip}
                        </Typography>
                      ))}
                    </Box>
                  )}

                  {/* Actions on Bot Messages */}
                  {m.sender === "bot" && idx > 0 && (
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      <Button
                        size="small"
                        startIcon={<CopyIcon sx={{ fontSize: 12 }} />}
                        onClick={() => handleCopy(m.text)}
                        sx={{
                          fontSize: "0.68rem",
                          p: "2px 6px",
                          color: "#64748B",
                        }}
                      >
                        {copied ? "Copied" : "Copy"}
                      </Button>
                      <Button
                        size="small"
                        startIcon={<LaunchIcon sx={{ fontSize: 12 }} />}
                        onClick={() => {
                          setOpen(false);
                          navigate("/requests/new");
                        }}
                        sx={{
                          fontSize: "0.68rem",
                          p: "2px 6px",
                          color: "#0F8B8D",
                          fontWeight: 700,
                        }}
                      >
                        New Request
                      </Button>
                    </Stack>
                  )}
                </Box>
              </Box>
            ))}

            {loading && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 1 }}>
                <CircularProgress size={16} sx={{ color: "#0F8B8D" }} />
                <Typography variant="caption" color="text.secondary">
                  Consulting county guidelines...
                </Typography>
              </Box>
            )}
          </Box>

          {/* Quick starter prompts */}
          <Box
            sx={{
              px: 1.5,
              py: 1,
              bgcolor: "#FFFFFF",
              borderTop: "1px solid #E2E8F0",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "#94A3B8",
                fontWeight: 600,
                display: "block",
                mb: 0.5,
              }}
            >
              Suggested inquiries:
            </Typography>
            <Box sx={{ display: "flex", gap: 0.5, overflowX: "auto", pb: 0.5 }}>
              {starterPrompts.map((p, pIdx) => (
                <Chip
                  key={pIdx}
                  label={p}
                  size="small"
                  onClick={() => handleSend(p)}
                  sx={{
                    fontSize: "0.68rem",
                    bgcolor: "#F1F5F9",
                    "&:hover": { bgcolor: "#E2E8F0" },
                    cursor: "pointer",
                  }}
                />
              ))}
            </Box>
          </Box>

          <Divider />

          {/* Input field */}
          <Box sx={{ p: 1.2, display: "flex", gap: 1, bgcolor: "#FFFFFF" }}>
            <TextField
              size="small"
              fullWidth
              placeholder={
                language === "en"
                  ? "Ask about a service or report..."
                  : "Uliza kuhusu huduma au ripoti..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              sx={{ "& .MuiInputBase-input": { fontSize: "0.82rem" } }}
            />
            <IconButton
              color="primary"
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              sx={{
                bgcolor: "#0F8B8D",
                color: "#fff",
                "&:hover": { bgcolor: "#0c7375" },
                "&.Mui-disabled": { bgcolor: "#E2E8F0", color: "#94A3B8" },
              }}
            >
              <SendIcon fontSize="small" />
            </IconButton>
          </Box>
        </Paper>
      </Collapse>
    </Box>
  );
};
