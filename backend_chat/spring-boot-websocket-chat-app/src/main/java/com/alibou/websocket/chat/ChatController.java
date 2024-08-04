package com.alibou.websocket.chat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.context.event.EventListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Controller
public class ChatController {

    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);
    private static final Set<String> connectedUsers = ConcurrentHashMap.newKeySet();

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
        return chatMessage;
    }

    @MessageMapping("/chat.addUser")
    public void addUser(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        String username = chatMessage.getSender();
        headerAccessor.getSessionAttributes().put("username", username);
        connectedUsers.add(username);

        logger.info("User added: {}", username);
        logger.info("Connected users: {}", connectedUsers);

        chatMessage.setUsers(connectedUsers);
        chatMessage.setContent(username + " joined!");

        messagingTemplate.convertAndSend("/topic/public", chatMessage);
        broadcastUserList();
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = (String) headerAccessor.getSessionAttributes().get("username");
        if (username != null) {
            logger.info("User removed: {}", username);

            ChatMessage chatMessage = ChatMessage.builder()
                    .type(MessageType.LEAVE)
                    .sender(username)
                    .content(username + " left!")
                    .users(connectedUsers)
                    .build();

            connectedUsers.remove(username);
            logger.info("Connected users: {}", connectedUsers);

            messagingTemplate.convertAndSend("/topic/public", chatMessage);
            broadcastUserList();
        }
    }

    private void broadcastUserList() {
        ChatMessage userListMessage = new ChatMessage();
        userListMessage.setType(MessageType.USER_LIST);
        userListMessage.setUsers(connectedUsers);
        messagingTemplate.convertAndSend("/topic/userList", userListMessage);
    }
}
