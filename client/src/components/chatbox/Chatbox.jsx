// ChatBox.jsx
import  { useState, useRef, useEffect } from "react";
import { MdEmojiEmotions } from "react-icons/md";
import { FaMicrophone } from "react-icons/fa";
import { FaRegFileLines } from "react-icons/fa6";
import { BsFillSendPlusFill } from "react-icons/bs";
import { FaStop } from "react-icons/fa6";




import io from "socket.io-client";

// CONFIG: change to your backend address
const API_BASE = "http://localhost:5000";
const SOCKET_URL = "http://localhost:5000";

// Emoji list (small) - expand as needed
const EMOJIS = ["😀","😂","😅","😊","😍","🤔","😢","👍","🎉","🔥","❤️"];

export default function ChatBox({
  title = "Chat with Bot",
  botAvatar = "https://i.pravatar.cc/40?img=5",
  userAvatar = "https://i.pravatar.cc/40?img=3",
  roomId = "global-room",
  userId = "user-1",
}) {
  const [messages, setMessages] = useState([]); // {id, sender, text, time, type, url}
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false); // show "Bot is typing..."
  const [showEmoji, setShowEmoji] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  // connect socket
  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.emit("joinRoom", { roomId, userId });

    socket.on("chat:history", (history) => {
      setMessages(history || []);
    });

    socket.on("chat:message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("bot:typing", ({ isTyping }) => {
      setTyping(isTyping);
    });

    // cleanup
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [roomId, userId]);

  // load history from REST if needed
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/chat/history?roomId=${roomId}`);
        if (res.ok) {
          const json = await res.json();
          setMessages(json.history || []);
        }
      } catch (err) {
        console.warn("Failed to load history", err);
      }
    })();
  }, [roomId]);

  // autoscroll on messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "stop" });
  }, [messages, typing]);

  // send text message
  const sendMessage = async (payload) => {
    // payload: { text?, type?:'text'|'file'|'audio', url? }
    const msg = {
      id: Date.now() + Math.random(),
      sender: "user",
      text: payload.text || "",
      type: payload.type || "text",
      url: payload.url || null,
      time: new Date().toISOString(),
      roomId,
      userId,
    };

    // emit to socket (server will persist + broadcast)
    socketRef.current?.emit("chat:send", msg);

    // local optimistic update
    setMessages((prev) => [...prev, msg]);

    // trigger bot behavior: show typing and emulate reply (server can handle real bot)
    socketRef.current?.emit("bot:request", { text: msg.text, roomId });
  };

  // handle send button or Enter
  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage({ text: input.trim(), type: "text" });
    setInput("");
    setShowEmoji(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // file upload preview + upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // preview
    const url = URL.createObjectURL(file);
    setFilePreview({ url, name: file.name, file });

    // upload to server
    const fd = new FormData();
    fd.append("file", file);
    fd.append("roomId", roomId);
    try {
      const res = await fetch(`${API_BASE}/api/chat/upload`, {
        method: "POST",
        body: fd,
      });
      const json = await res.json();
      if (json.success && json.fileUrl) {
        // send a chat message pointing to uploaded file
        sendMessage({ text: file.name, type: "file", url: json.fileUrl });
        setFilePreview(null);
      }
    } catch (err) {
      console.error("File upload failed", err);
    }
  };

  // Emoji add
  const addEmoji = (emoji) => {
    setInput((s) => s + emoji);
  };

  // Voice recording: uses MediaRecorder
  const startRecording = async () => {
    if (!navigator.mediaDevices) return alert("Media devices not supported");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      setMediaRecorder(mr);
      setAudioChunks([]);

      mr.ondataavailable = (ev) => {
        setAudioChunks((prev) => [...prev, ev.data]);
      };

      mr.onstop = async () => {
        const blob = new Blob(audioChunks, { type: "audio/webm" });
        // upload blob
        const fd = new FormData();
        fd.append("audio", blob, `voice-${Date.now()}.webm`);
        fd.append("roomId", roomId);
        try {
          const res = await fetch(`${API_BASE}/api/chat/upload-audio`, {
            method: "POST",
            body: fd,
          });
          const json = await res.json();
          if (json.success && json.fileUrl) {
            sendMessage({ text: "Voice message", type: "audio", url: json.fileUrl });
          }
        } catch (err) {
          console.error("Audio upload failed", err);
        }
      };

      mr.start();
      setRecording(true);
    } catch (err) {
      console.error("startRecording error:", err);
      alert("Could not start recording: " + err.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      setRecording(false);
      setMediaRecorder(null);
    }
  };

  // render a message row
  const renderMsg = (msg) => {
    const isUser = msg.sender === "user";
    const bubbleClass = isUser
      ? "bg-blue-500 text-white rounded-br-none"
      : "bg-gray-200 text-gray-800 rounded-bl-none";

    return (
      <div
        key={msg.id}
        className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}
      >
        {!isUser && (
          <img src={botAvatar} alt="bot" className="w-8 h-8 rounded-full" />
        )}

        <div className={`px-4 py-2 rounded-2xl max-w-[70%] break-words shadow ${bubbleClass}`}>
          {msg.type === "text" && <div>{msg.text}</div>}

          {msg.type === "file" && msg.url && (
            <div>
              <a href={msg.url} target="_blank" rel="noreferrer" className="underline">
                {msg.text}
              </a>
              {msg.url.match(/\.(jpeg|jpg|png|gif)$/i) && (
                <img src={msg.url} alt={msg.text} className="mt-2 max-h-48 rounded" />
              )}
            </div>
          )}

          {msg.type === "audio" && msg.url && (
            <div>
              <audio controls src={msg.url} />
            </div>
          )}

          <div className="text-xs text-gray-500 mt-1 text-right">
            {new Date(msg.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>

        {isUser && <img src={userAvatar} alt="you" className="w-8 h-8 rounded-full" />}
      </div>
    );
  };

 return (
  <div className="flex justify-center w-full">
    <div className="mt-6 w-full max-w-md h-[400px] rounded-xl overflow-hidden shadow-2xl bg-white flex flex-col">

      {/* HEADER (WhatsApp style) */}
      <div className="bg-blue-900 text-white px-4 py-3 flex items-center gap-3 shadow-md">
        <img src={botAvatar} className="w-9 h-9 rounded-full shadow" alt="avatar" />
        <div>
          <div className="font-semibold text-lg">{title}</div>
          <div className="text-xs text-green-100">online</div>
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 p-4 overflow-y-auto bg-[#e5ddd5] space-y-3">

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-2 ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >

            {/* Avatar for bot */}
            {msg.sender !== "user" && (
              <img
                src={botAvatar}
                className="w-7 h-7 rounded-full opacity-90"
                alt="bot"
              />
            )}

            {/* Bubble */}
            <div
              className={`px-3 py-2 max-w-[75%] rounded-lg shadow-md text-sm relative ${
                msg.sender === "user"
                  ? "bg-[#d9fdd3] text-gray-900 rounded-br-none"
                  : "bg-white rounded-bl-none"
              }`}
            >
              {/* TEXT */}
              {msg.type === "text" && <div>{msg.text}</div>}

              {/* FILE */}
              {msg.type === "file" && msg.url && (
                <div>
                  <a href={msg.url} className="underline text-blue-700 font-medium" target="_blank">
                    {msg.text}
                  </a>

                  {msg.url.match(/\.(jpg|jpeg|png|gif)$/i) && (
                    <img src={msg.url} className="mt-2 rounded-lg max-h-40 border" />
                  )}
                </div>
              )}

              {/* AUDIO */}
              {msg.type === "audio" && (
                <audio controls src={msg.url} className="mt-1 w-full" />
              )}

              {/* TIME (bottom right small opacity) */}
              <div className="text-[10px] opacity-60 mt-1 text-right">
                {new Date(msg.time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>

            {/* Avatar for user */}
            {msg.sender === "user" && (
              <img
                src={userAvatar}
                className="w-7 h-7 rounded-full opacity-90"
                alt="you"
              />
            )}
          </div>
        ))}

        {/* Typing Indicator (WhatsApp style dots) */}
        {typing && (
          <div className="flex items-center gap-2">
            <img src={botAvatar} className="w-7 h-7 rounded-full" />
            <div className="bg-white px-3 py-2 rounded-xl shadow-md">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT BAR (WhatsApp style) */}
      <div className="px-3 py-3 bg-white flex items-center gap-2 border-t">

        {/* Emoji Button */}
        <button
          onClick={() => setShowEmoji((s) => !s)}
          className="text-2xl"
        >
          <MdEmojiEmotions/>
        </button>

        {/* Emoji Picker */}
        {showEmoji && (
          <div className="absolute bottom-20 left-5 bg-white border shadow-lg rounded-lg p-2 w-48 flex flex-wrap gap-1">
            {EMOJIS.map((em) => (
              <button
                key={em}
                onClick={() => addEmoji(em)}
                className="text-xl hover:bg-gray-100 rounded p-1"
              >
                {em}
              </button>
            ))}
          </div>
        )}

        {/* Input Box */}
        <textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message"
          className="flex-1 px-4 py-2 bg-[#f0f0f0] rounded-2xl resize-none text-sm outline-none"
        />

        {/* File Upload */}
        <label className="text-xl cursor-pointer">
          <FaRegFileLines/>
          <input type="file" className="hidden" onChange={handleFileChange} />
        </label>

        {/* Mic / Stop button */}
        {!recording ? (
          <button
            className="text-xl"
            onClick={startRecording}
            title="Record voice"
          >
            <FaMicrophone />
          </button>
        ) : (
          <button
            className="text-xl text-red-600"
            onClick={stopRecording}
            title="Stop recording"
          >
            <FaStop />
          </button>
        )}

        {/* Send Button */}
        <button
          onClick={handleSend}
          className="bg-green-600 text-white px-4 py-2 rounded-full text-sm shadow hover:bg-green-700"
        >
          <BsFillSendPlusFill />
        </button>
      </div>
    </div>
  </div>
);

}
