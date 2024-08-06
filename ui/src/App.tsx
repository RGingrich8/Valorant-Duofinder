import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FormType } from './components/Start/Form';
import Start from './components/Start/Start';
import ChatHistory from './components/Chat/ChatHistory';
import ChatBody from './components/Chat/ChatBody';
import { FilterProvider } from './contexts/FilterContext';
import { LoggedUserProvider } from './contexts/LoggedUserContext';
import { MatchedUserProvider } from './contexts/MatchedUserContext';
import Landing from "./components/Landing/Landing";
import { SocketProvider } from './contexts/SocketContext';

function App() {

  return <BrowserRouter>
          <LoggedUserProvider>
          <FilterProvider>
          <MatchedUserProvider>
          <SocketProvider>
            <Routes>
              <Route path="/" element={<Start formType={FormType.Registration}></Start>} />
              <Route path="/register" element={<Start formType={FormType.Registration}></Start>} />
              <Route path="/login" element={<Start formType={FormType.Login}></Start>} />
              <Route path="/landing" element={<Landing></Landing>}/>
              <Route path="/history" element={<ChatHistory />} />
              <Route path="/chat" element={<ChatBody />} />
            </Routes>
          </SocketProvider>
          </MatchedUserProvider>
          </FilterProvider>
          </LoggedUserProvider> 
        </BrowserRouter>;
}

export default App;