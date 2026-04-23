"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/store/auth";
import { Message, Match } from "@/types";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000";

interface UseSocketOptions {
  onNewMessage?: (message: Message) => void;
  onNewMatch?: (match: Match) => void;
  onUserOnline?: (userId: number) => void;
  onUserOffline?: (userId: number) => void;
}

// Singleton socket instance to avoid multiple connections
let globalSocket: Socket | null = null;
let globalSocketUserId: number | null = null;

export function useSocket(options: UseSocketOptions = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<number>>(new Set());
  const { token, user } = useAuthStore();
  const pendingJoins = useRef<Set<number>>(new Set());
  const optionsRef = useRef(options);
  
  // Keep options ref updated
  optionsRef.current = options;

  // Initialize socket connection
  useEffect(() => {
    if (!token || !user?.id) {
      console.log('[useSocket] No token or user, skipping connect');
      return;
    }

    // If we already have a connected socket for this user, reuse it
    if (globalSocket?.connected && globalSocketUserId === user.id) {
      console.log('[useSocket] Reusing existing socket connection');
      setIsConnected(true);
      return;
    }

    // If socket exists but for different user, disconnect it
    if (globalSocket && globalSocketUserId !== user.id) {
      console.log('[useSocket] Different user, disconnecting old socket');
      globalSocket.disconnect();
      globalSocket = null;
      globalSocketUserId = null;
    }

    // If socket exists but disconnected, reconnect
    if (globalSocket && !globalSocket.connected) {
      console.log('[useSocket] Reconnecting existing socket');
      globalSocket.connect();
      return;
    }

    console.log('[useSocket] Creating new socket connection to', SOCKET_URL);

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    globalSocket = socket;
    globalSocketUserId = user.id;

    socket.on("connect", () => {
      console.log('[useSocket] Connected! Socket ID:', socket.id);
      setIsConnected(true);
      
      // Emit pending joins
      pendingJoins.current.forEach((matchId) => {
        console.log('[useSocket] Emitting pending chat:join for match:', matchId);
        socket.emit("chat:join", matchId);
      });
    });

    socket.on("disconnect", (reason) => {
      console.log('[useSocket] Disconnected. Reason:', reason);
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      // websocket error is common and expected - will fallback to polling
      if (error.message === 'websocket error') {
        console.log('[useSocket] WebSocket failed, falling back to polling');
      } else {
        console.error('[useSocket] Connection error:', error.message);
      }
      setIsConnected(false);
    });

    // Chat message events
    socket.on("chat:message", (message: Message) => {
      console.log('[useSocket] Received chat:message:', message);
      optionsRef.current.onNewMessage?.(message);
    });

    // Also listen to newMessage for compatibility
    socket.on("newMessage", (message: Message) => {
      console.log('[useSocket] Received newMessage (compat):', message);
      optionsRef.current.onNewMessage?.(message);
    });

    // Match events
    socket.on("newMatch", (match: Match) => {
      console.log('[useSocket] Received newMatch:', match);
      optionsRef.current.onNewMatch?.(match);
    });

    // Chat notifications
    socket.on("chat:notification", (payload: { matchId: number; message: string; senderId: number }) => {
      console.log('[useSocket] Received chat:notification:', payload);
    });

    // Presence events
    
    // Receive initial list of online users when connecting
    socket.on("onlineUsers", (userIds: number[]) => {
      console.log('[useSocket] Received online users list:', userIds);
      setOnlineUsers(new Set(userIds));
    });
    
    socket.on("userOnline", (userId: number) => {
      console.log('[useSocket] User online:', userId);
      setOnlineUsers((prev) => new Set(prev).add(userId));
      optionsRef.current.onUserOnline?.(userId);
    });

    socket.on("userOffline", (userId: number) => {
      console.log('[useSocket] User offline:', userId);
      setOnlineUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
      optionsRef.current.onUserOffline?.(userId);
    });

    // No cleanup - keep socket alive
  }, [token, user?.id]);

  const joinMatch = useCallback((matchId: number) => {
    console.log('[useSocket] joinMatch called for:', matchId, 'connected:', globalSocket?.connected);
    if (globalSocket?.connected) {
      console.log('[useSocket] Emitting chat:join for match:', matchId);
      globalSocket.emit("chat:join", matchId);
    } else {
      console.log('[useSocket] Queueing chat:join for match:', matchId);
      pendingJoins.current.add(matchId);
    }
  }, []);

  const leaveMatch = useCallback((matchId: number) => {
    console.log('[useSocket] leaveMatch called for:', matchId);
    if (globalSocket?.connected) {
      globalSocket.emit("chat:leave", matchId);
    }
    pendingJoins.current.delete(matchId);
  }, []);

  const sendMessage = useCallback((matchId: number, content: string) => {
    console.log('[useSocket] sendMessage called. Connected:', globalSocket?.connected, 'matchId:', matchId);
    if (globalSocket?.connected) {
      console.log('[useSocket] Emitting chat:message');
      globalSocket.emit("chat:message", {
        matchId,
        content,
      });
      return true;
    }
    console.warn('[useSocket] Socket not connected, cannot send message via socket');
    return false;
  }, []);

  const markAsRead = useCallback((matchId: number) => {
    if (globalSocket?.connected) {
      globalSocket.emit("markAsRead", matchId);
    }
  }, []);

  const isUserOnline = useCallback((userId: number) => {
    return onlineUsers.has(userId);
  }, [onlineUsers]);

  const disconnect = useCallback(() => {
    if (globalSocket) {
      globalSocket.disconnect();
      globalSocket = null;
      globalSocketUserId = null;
      setIsConnected(false);
    }
  }, []);

  const connect = useCallback(() => {
    if (globalSocket && !globalSocket.connected) {
      globalSocket.connect();
    }
  }, []);

  return {
    socket: globalSocket,
    isConnected,
    onlineUsers,
    connect,
    disconnect,
    joinMatch,
    leaveMatch,
    sendMessage,
    markAsRead,
    isUserOnline,
  };
}
