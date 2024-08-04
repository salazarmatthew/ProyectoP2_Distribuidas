import React from 'react';

function MessageList({ messages }) {
  return (
    <ul id="messageArea">
      {messages.map((message, index) => (
        <li key={index} className={message.type === 'JOIN' || message.type === 'LEAVE' ? 'event-message' : 'chat-message'}>
          {message.type !== 'JOIN' && message.type !== 'LEAVE' && (
            <>
              <i style={{ backgroundColor: getAvatarColor(message.sender) }}>{message.sender[0]}</i>
              <span>{message.sender}</span>
            </>
          )}
          <p>{message.content}</p>
        </li>
      ))}
    </ul>
  );
}

function getAvatarColor(sender) {
  const colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
  ];
  let hash = 0;
  for (let i = 0; i < sender.length; i++) {
    hash = 31 * hash + sender.charCodeAt(i);
  }
  const index = Math.abs(hash % colors.length);
  return colors[index];
}

export default MessageList;
