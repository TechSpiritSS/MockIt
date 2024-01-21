import React from 'react';
import ReactDOM from 'react-dom';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import Intro from './Intro';
import { UserIdProvider } from './context/userId';
import ChatHistoryPage from './pages/History/ChatHistory';
import Jobs from './pages/Jobs/Jobs';
import PDFUpload from './pages/PDF/PDFUpload';

ReactDOM.render(
  <>
    <Toaster />
    <BrowserRouter>
      <UserIdProvider>
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/chat" element={<App />} />
          <Route path="/chat/:userId" element={<App />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/pdf" element={<PDFUpload />} />
          <Route path="/history" element={<ChatHistoryPage />} />
        </Routes>
      </UserIdProvider>
    </BrowserRouter>
  </>,
  document.getElementById('root')
);
