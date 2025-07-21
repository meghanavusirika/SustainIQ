import React, { useState, useRef, useEffect } from 'react';
import { Upload, Send, MessageCircle, FileText, Bot, User, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import './ESGReportChat.css';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatSession {
  id: string;
  documentId: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

interface RelevantChunk {
  content: string;
  section: string;
  page: number;
}

const ESGReportChat: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [relevantChunks, setRelevantChunks] = useState<RelevantChunk[]>([]);
  const [showSources, setShowSources] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatSession?.messages]);

  const handleFileSelect = (file: File) => {
    if (file.type !== 'application/pdf') {
      setUploadError('Please select a PDF file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setUploadError('File size must be less than 10MB');
      return;
    }
    setSelectedFile(file);
    setUploadError(null);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const uploadDocument = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('pdf', selectedFile);

    try {
      const response = await axios.post('http://localhost:5001/api/chat/upload', formData);
      
      setSessionId(response.data.sessionId);
      setChatSession({
        id: response.data.sessionId,
        documentId: response.data.documentId,
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      setSelectedFile(null);
    } catch (err: any) {
      setUploadError(err?.response?.data?.error || 'Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !sessionId || isSending) return;

    setIsSending(true);
    const userMessage = message.trim();
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5001/api/chat/message', {
        sessionId,
        message: userMessage
      });

      setChatSession(response.data.session);
      setRelevantChunks(response.data.relevantChunks || []);
      setShowSources(true);
    } catch (err: any) {
      console.error('Error sending message:', err);
      // Add error message to chat
      if (chatSession) {
        setChatSession({
          ...chatSession,
          messages: [
            ...chatSession.messages,
            {
              id: `error_${Date.now()}`,
              role: 'assistant',
              content: 'Sorry, I encountered an error processing your message. Please try again.',
              timestamp: new Date().toISOString()
            }
          ]
        });
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!sessionId) {
    return (
      <div className="esg-report-chat">
        <div className="chat-header">
          <h1>Chat with ESG Reports</h1>
          <p>Upload an ESG report and ask questions about it using AI</p>
        </div>

        <div className="upload-section">
          <div className="upload-area">
            <input
              type="file"
              id="file-upload"
              accept=".pdf"
              onChange={handleFileInput}
              className="file-input"
            />
            
            <div className="upload-content">
              <Upload size={48} className="upload-icon" />
              <h3>Upload ESG Report PDF</h3>
              <p>Select a PDF file to start chatting about it</p>
              <p className="file-requirements">Maximum file size: 10MB</p>
            </div>

            {selectedFile && (
              <div className="selected-file">
                <FileText size={20} />
                <span>{selectedFile.name}</span>
                <span className="file-size">({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
            )}
          </div>

          {uploadError && (
            <div className="error-message">
              <AlertCircle size={20} />
              <span>{uploadError}</span>
            </div>
          )}

          <button
            className="upload-btn"
            onClick={uploadDocument}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 size={20} className="spinner" />
                Processing Document...
              </>
            ) : (
              <>
                <MessageCircle size={20} />
                Start Chatting
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="esg-report-chat">
      <div className="chat-header">
        <h1>ESG Report Chat</h1>
        <p>Ask questions about your uploaded ESG report</p>
      </div>

      <div className="chat-container">
        <div className="chat-messages">
          {chatSession?.messages.length === 0 && (
            <div className="welcome-message">
              <Bot size={48} />
              <h3>Welcome to ESG Report Chat!</h3>
              <p>I've processed your ESG report and I'm ready to answer your questions. Try asking about:</p>
              <ul>
                <li>Environmental initiatives and goals</li>
                <li>Social responsibility programs</li>
                <li>Governance practices and policies</li>
                <li>ESG performance metrics</li>
                <li>Risk management strategies</li>
              </ul>
            </div>
          )}

          {chatSession?.messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.role}`}>
              <div className="message-avatar">
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className="message-content">
                <div className="message-text">{msg.content}</div>
                <div className="message-time">{formatTime(msg.timestamp)}</div>
              </div>
            </div>
          ))}

          {isSending && (
            <div className="message assistant">
              <div className="message-avatar">
                <Bot size={20} />
              </div>
              <div className="message-content">
                <div className="message-text">
                  <Loader2 size={16} className="spinner" />
                  Thinking...
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {relevantChunks.length > 0 && showSources && (
          <div className="sources-panel">
            <h4>Sources from the report:</h4>
            {relevantChunks.map((chunk, index) => (
              <div key={index} className="source-item">
                <div className="source-header">
                  <span className="source-section">{chunk.section}</span>
                  <span className="source-page">Page {chunk.page}</span>
                </div>
                <div className="source-content">{chunk.content}</div>
              </div>
            ))}
            <button 
              className="close-sources"
              onClick={() => setShowSources(false)}
            >
              Hide Sources
            </button>
          </div>
        )}

        <div className="chat-input">
          <div className="input-container">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question about your ESG report..."
              rows={1}
              disabled={isSending}
            />
            <button
              className="send-btn"
              onClick={sendMessage}
              disabled={!message.trim() || isSending}
            >
              <Send size={16} />
            </button>
          </div>
          <div className="input-hint">
            Press Enter to send, Shift+Enter for new line
          </div>
        </div>
      </div>
    </div>
  );
};

export default ESGReportChat; 