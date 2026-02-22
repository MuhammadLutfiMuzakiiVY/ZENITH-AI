import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Zap,
  Monitor,
  History,
  Settings,
  LogOut,
  BrainCircuit,
  Globe,
  Plus,
  X,
  Trash2,
  Check,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAIResponse } from './services/aiService';
import './App.css';

const INITIAL_MESSAGE = (name = "Zenith AI") => ({
  id: 'init-' + Date.now(),
  role: 'assistant',
  content: `Greetings! I am **${name}**, your high-performance intelligence co-pilot. How can I assist you with your productivity or learning goals today?`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
});

function App() {
  // --- States ---
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('zenith_sessions');
    return saved ? JSON.parse(saved) : [{ id: 'default', name: 'Initial Session', messages: [INITIAL_MESSAGE()] }];
  });
  const [activeSessionId, setActiveSessionId] = useState('default');
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeMode, setActiveMode] = useState('creative');
  const [showSettings, setShowSettings] = useState(false);
  const [userName, setUserName] = useState(() => localStorage.getItem('zenith_user') || 'Developer');
  const [notification, setNotification] = useState(null);

  const messagesEndRef = useRef(null);

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem('zenith_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sessions, activeSessionId, isTyping]);

  // --- Computed ---
  const currentSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const messages = currentSession.messages;

  // --- Handlers ---
  const showToast = (text) => {
    setNotification(text);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = {
      id: 'u-' + Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update session messages
    setSessions(prev => prev.map(s =>
      s.id === activeSessionId
        ? { ...s, messages: [...s.messages, userMessage], name: s.messages.length === 1 ? input.substring(0, 20) + '...' : s.name }
        : s
    ));

    setInput('');
    setIsTyping(true);

    try {
      const response = await getAIResponse(input, activeMode, messages);
      const assistantMessage = {
        id: 'a-' + Date.now(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setSessions(prev => prev.map(s =>
        s.id === activeSessionId
          ? { ...s, messages: [...s.messages, assistantMessage] }
          : s
      ));
    } catch (err) {
      showToast("Connection to Neural Link lost. Retrying...");
    } finally {
      setIsTyping(false);
    }
  };

  const createNewSession = () => {
    const newId = 's-' + Date.now();
    const newSession = {
      id: newId,
      name: 'New Session',
      messages: [INITIAL_MESSAGE("Zenith")]
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newId);
    showToast("New Neural Channel Opened");
  };

  const deleteSession = (e, id) => {
    e.stopPropagation();
    if (sessions.length === 1) {
      showToast("Cannot delete the only active session.");
      return;
    }
    const newSessions = sessions.filter(s => s.id !== id);
    setSessions(newSessions);
    if (activeSessionId === id) {
      setActiveSessionId(newSessions[0].id);
    }
    showToast("Session Purged");
  };

  const handleSaveSettings = () => {
    localStorage.setItem('zenith_user', userName);
    setShowSettings(false);
    showToast("Neural Profile Updated");
  };

  const handleLogout = () => {
    if (window.confirm("Disconnect from Zenith AI? All unsaved local cache will be cleared.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="app-container">
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -50 }}
            className="toast glass-panel"
          >
            <Check size={16} className="toast-icon" /> {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="settings-modal glass-panel"
            >
              <div className="modal-header">
                <h3>Neural Configuration</h3>
                <button onClick={() => setShowSettings(false)} className="close-btn"><X size={20} /></button>
              </div>
              <div className="modal-body">
                <div className="setting-field">
                  <label>Co-pilot Identity</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="User Name"
                  />
                </div>
                <div className="setting-info">
                  <p>Current Active Mode: <strong>{activeMode.toUpperCase()}</strong></p>
                  <p>Neural sessions cached: {sessions.length}</p>
                </div>
              </div>
              <div className="modal-footer">
                <button className="primary-btn" onClick={handleSaveSettings}>Save Protocol</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className="sidebar glass-panel">
        <div className="sidebar-header">
          <div className="logo">
            <img src="/zenith-logo.svg" alt="Zenith Logo" className="logo-icon-svg" />
            <span className="logo-text gradient-text">ZENITH AI</span>
          </div>
          <button className="new-chat" onClick={createNewSession}>
            <Plus size={18} /> New Session
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-group">
            <span className="nav-label">Protocol Modes</span>
            <button
              className={`nav-item ${activeMode === 'creative' ? 'active' : ''}`}
              onClick={() => { setActiveMode('creative'); showToast("Switched to Creative Mode"); }}
            >
              <Sparkles size={18} /> Creative Mode
            </button>
            <button
              className={`nav-item ${activeMode === 'focus' ? 'active' : ''}`}
              onClick={() => { setActiveMode('focus'); showToast("Switched to Focus Mode"); }}
            >
              <Zap size={18} /> Focus Mode
            </button>
            <button
              className={`nav-item ${activeMode === 'research' ? 'active' : ''}`}
              onClick={() => { setActiveMode('research'); showToast("Switched to Research Mode"); }}
            >
              <Globe size={18} /> Research Mode
            </button>
          </div>

          <div className="nav-group session-list">
            <span className="nav-label">Neural History</span>
            <div className="sessions-container">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  className={`session-item ${activeSessionId === s.id ? 'active' : ''}`}
                  onClick={() => setActiveSessionId(s.id)}
                >
                  <div className="session-content">
                    <History size={14} />
                    <span>{s.name}</span>
                  </div>
                  <button onClick={(e) => deleteSession(e, s.id)} className="delete-session"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        </nav>

        <div className="sidebar-footer">
          <button className="footer-item" onClick={() => setShowSettings(true)}><Settings size={18} /> Settings</button>
          <button className="footer-item logout" onClick={handleLogout}><LogOut size={18} /> Disconnect</button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="main-content">
        <header className="main-header glass-panel">
          <div className="header-info">
            <h2 className="mode-title">{activeMode.charAt(0).toUpperCase() + activeMode.slice(1)} Dashboard</h2>
            <p className="status-text">Operator: <span className="user-span">{userName}</span> | Status: <span className="status-active">Optimal</span></p>
          </div>
          <div className="header-actions">
            <button className="icon-btn" title="Toggle Monitoring"><Monitor size={20} /></button>
          </div>
        </header>

        <section className="chat-viewport">
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`message-wrapper ${msg.role}`}
              >
                <div className={`message-avatar ${msg.role}`}>
                  {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
                </div>
                <div className="message-bubble glass-panel">
                  <div className="message-content">
                    {msg.content.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                  <span className="message-time">{msg.timestamp}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="message-wrapper assistant"
            >
              <div className="message-avatar assistant"><Bot size={20} /></div>
              <div className="typing-indicator glass-panel">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </section>

        <footer className="input-area">
          <form onSubmit={handleSend} className="input-container glass-panel">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isTyping ? "Zenith is thinking..." : `Communicate with Zenith (${activeMode} mode)...`}
              className="chat-input"
              disabled={isTyping}
            />
            <button type="submit" className="send-btn" disabled={!input.trim() || isTyping}>
              {isTyping ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Sparkles size={18} /></motion.div> : <Send size={20} />}
            </button>
          </form>
          <p className="disclaimer">Zenith AI Neural Link v1.0.4. Fully synthesized backend active.</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
