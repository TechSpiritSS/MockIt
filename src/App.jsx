import React, { useState } from 'react';

import { useLocation } from 'react-router-dom';
import './App.css';
import Chat from './pages/Chat/Chat';

function App() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const name = queryParams.get('name');

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi ${name}, start by giving a brief introduction about yourself.`,
    },
  ]);

  return <Chat messages={messages} setMessages={setMessages} />;
}

export default App;
