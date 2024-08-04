import React, { useState } from 'react';

function MessageForm({ sendMessage }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(message);
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} id="messageForm">
      <div className="form-group">
        <div className="input-group clearfix">
          <input
            type="text"
            id="message"
            placeholder="Type a message..."
            className="form-control"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" className="primary">Send</button>
        </div>
      </div>
    </form>
  );
}

export default MessageForm;
