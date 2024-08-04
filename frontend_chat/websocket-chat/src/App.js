import React, { useState } from 'react';
import ChatPage from './components/ChatPage';

function App() {
  const [username, setUsername] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setIsAuthenticated(true);
    }
  };

  return (
    <div>
      {!isAuthenticated ? (
        <div id="username-page">
          <div className="username-page-container">
            <h1 className="title">Ingresa un nombre de usuario para entrar a la sala de chat</h1>
            <form onSubmit={handleUsernameSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="form-control"
                  autoComplete="off"
                />
              </div>
              <div className="form-group">
                <button type="submit" className="accent username-submit">Empezar a chatear</button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <ChatPage username={username} />
      )}
    </div>
  );
}

export default App;
