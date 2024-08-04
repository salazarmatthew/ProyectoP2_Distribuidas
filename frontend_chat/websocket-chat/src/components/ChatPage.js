import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import MessageList from './MessageList';
import UsersList from './UsersList';
import { requestNotificationPermission, showNotification } from '../utils/notifications'; // Importa las funciones

function ChatPage({ username }) {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    requestNotificationPermission(); // Solicita permiso al cargar la página

    const socket = new SockJS('http://localhost:8080/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      client.subscribe('/topic/public', (message) => {
        const parsedMessage = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, parsedMessage]);
        
        // Mostrar notificación si el mensaje no es del usuario actual
        if (parsedMessage.sender !== username) {
          showNotification('Nuevo mensaje', {
            body: `${parsedMessage.sender}: ${parsedMessage.content}`,
            icon: 'path/to/icon.png', // Opcional: añade un icono
          });
        }
      });

      client.subscribe('/topic/userList', (message) => {
        const parsedMessage = JSON.parse(message.body);
        setUsers(parsedMessage.users);
      });

      client.publish({
        destination: '/app/chat.addUser',
        body: JSON.stringify({ sender: username, type: 'JOIN' }),
      });

      setStompClient(client);
    };

    client.onStompError = (error) => {
      console.error('Error connecting to WebSocket', error);
    };

    client.activate();

    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, [username]);

  const sendMessage = (content) => {
    if (content && stompClient) {
      const chatMessage = {
        sender: username,
        content,
        type: 'CHAT',
      };
      stompClient.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify(chatMessage),
      });
    }
  };

  return (
    <div id="chat-page">
      <div className="user-list-container">
        <h3>Usuarios conectados:</h3>
        <UsersList users={users} />
      </div>
      <div className="chat-container">
        <div className="chat-header">
          <h2>Sala de Chat</h2>
        </div>
        <MessageList messages={messages} />
        <div className="input-group">
          <input
            type="text"
            placeholder="Escribe un mensaje..."
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                sendMessage(event.target.value);
                event.target.value = '';
              }
            }}
          />
          <button onClick={() => {
            const input = document.querySelector('.input-group input');
            sendMessage(input.value);
            input.value = '';
          }}>
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
