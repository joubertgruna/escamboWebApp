"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Send, ArrowLeft, MoreVertical, Phone, Info, Paperclip, Image as ImageIcon, Smile, File, Camera } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Spinner } from "@/components/ui/Loading";
import { useToast } from "@/components/ui/Toast";
import { useAuthStore } from "@/store/auth";
import { useSocket } from "@/hooks/useSocket";
import { matchService } from "@/services/matches";
import { Match, Message } from "@/types";
import { format, isToday, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";

const PLACEHOLDER_BLUR =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoGSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCABoAGgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWm5ybnJ2eoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlbaWmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/2Q==";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const { error } = useToast();
  const { user } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const matchId = Number(params.id);
  const [match, setMatch] = useState<Match | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const handleNewMessage = useCallback((message: Message) => {
    if (message.match_id === matchId) {
      // Evita duplicação: ignora mensagens do próprio usuário (já foram adicionadas otimisticamente)
      // Só adiciona se for mensagem de outro usuário
      if (message.sender_id === user?.id) {
        // Substitui a mensagem temporária pela mensagem real do servidor (com ID correto)
        setMessages((prev) => {
          // Remove mensagem temporária e adiciona a real
          const withoutTemp = prev.filter(m => 
            !(m.sender_id === user?.id && m.content === message.content && m.id > 1000000000000)
          );
          // Verifica se a mensagem já existe (evita duplicação)
          if (withoutTemp.some(m => m.id === message.id)) {
            return withoutTemp;
          }
          return [...withoutTemp, message];
        });
      } else {
        // Mensagem de outro usuário - adiciona normalmente
        setMessages((prev) => {
          // Evita duplicação se já existe
          if (prev.some(m => m.id === message.id)) {
            return prev;
          }
          return [...prev, message];
        });
      }
    }
  }, [matchId, user?.id]);

  const { isConnected, joinMatch, leaveMatch, sendMessage: socketSendMessage, markAsRead, isUserOnline } = useSocket({
    onNewMessage: handleNewMessage,
  });

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const [matchResponse, messagesResponse] = await Promise.all([
          matchService.getById(matchId),
          matchService.getMessages(matchId),
        ]);
        setMatch(matchResponse.data || null);
        
        // Backend returns { messages: [...], total: X } or can be just an array
        const messagesData = messagesResponse.data;
        let messagesArray: Message[] = [];
        
        if (Array.isArray(messagesData)) {
          messagesArray = messagesData;
        } else if (messagesData && Array.isArray(messagesData.messages)) {
          messagesArray = messagesData.messages;
        }
        
        setMessages(messagesArray);
        
        // Join socket room
        joinMatch(matchId);
        markAsRead(matchId);
      } catch (err) {
        console.error("Error fetching chat:", err);
        error("Erro ao carregar conversa");
      } finally {
        setLoading(false);
      }
    };

    fetchChat();

    return () => {
      leaveMatch(matchId);
    };
  }, [matchId, error, joinMatch, leaveMatch, markAsRead]);

  useEffect(() => {
    // Scroll to bottom on new messages
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Determina qual é o outro usuário baseado no usuário logado
  const getOtherUser = () => {
    if (!match || !user) return null;
    // Se o usuário logado é user_1, o outro é user_2 e vice-versa
    if (match.user_1_id === user.id) {
      return match.user_2;
    } else {
      return match.user_1;
    }
  };

  // Determina qual é o meu item e o item do outro
  const getMyItem = () => {
    if (!match || !user) return null;
    if (match.user_1_id === user.id) {
      return match.item_1;
    } else {
      return match.item_2;
    }
  };

  const getOtherItem = () => {
    if (!match || !user) return null;
    if (match.user_1_id === user.id) {
      return match.item_2;
    } else {
      return match.item_1;
    }
  };

  const otherUser = getOtherUser();
  const myItem = getMyItem();
  const otherItem = getOtherItem();

  const getUrl = (url?: string) => {
    if (!url) return undefined;
    return url.startsWith("http")
      ? url
      : `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}${url}`;
  };

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;

    const content = newMessage.trim();
    setNewMessage("");
    setSending(true);

    try {
      // Optimistic update
      const tempMessage: Message = {
        id: Date.now(),
        content,
        sender_id: user?.id || 0,
        match_id: matchId,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, tempMessage]);

      // Send via socket
      if (isConnected) {
        socketSendMessage(matchId, content);
      } else {
        // Fallback to API
        await matchService.sendMessage(matchId, content);
      }
    } catch (err) {
      console.error("Error sending message:", err);
      error("Erro ao enviar mensagem");
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((m) => m.id !== Date.now()));
    } finally {
      setSending(false);
    }
  };

  const formatMessageDate = (date: string) => {
    const d = new Date(date);
    if (isToday(d)) {
      return format(d, "HH:mm", { locale: ptBR });
    }
    if (isYesterday(d)) {
      return `Ontem ${format(d, "HH:mm", { locale: ptBR })}`;
    }
    return format(d, "dd/MM HH:mm", { locale: ptBR });
  };

  const isMyMessage = (message: Message) => {
    return message.sender_id === user?.id;
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f5f5f7] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#f5f5f7] items-center">
      {/* Centralized Container */}
      <div className="flex flex-col h-screen w-full max-w-4xl">
        {/* Header */}
        <div className="bg-white px-4 sm:px-5 py-4 shadow-sm border-b border-gray-100 safe-top">
          <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>

          <Avatar src={getUrl(otherUser?.avatar_url)} size="lg" ring />

          <div className="flex-1 min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 truncate">
              {otherUser?.name}
            </h2>
            <p className="text-xs sm:text-sm flex items-center gap-1.5">
              {otherUser && isUserOnline(otherUser.id) ? (
                <>
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-green-600 font-medium">Online</span>
                </>
              ) : (
                <span className="text-gray-500">Offline</span>
              )}
            </p>
          </div>

          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Info className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Match Info Card */}
      {match && (
        <div className="bg-white border-b border-gray-100">
          <div className="px-4 sm:px-5 py-3">
            <div className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-3 border border-gray-100">
              <div className="flex -space-x-3">
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden ring-2 ring-white shadow-md">
                  <Image
                    src={getUrl(myItem?.photos?.[0]?.url) || "/placeholder-item.jpg"}
                    alt={myItem?.title || "Meu item"}
                    fill
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={PLACEHOLDER_BLUR}
                  />
                </div>
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden ring-2 ring-white shadow-md">
                  <Image
                    src={getUrl(otherItem?.photos?.[0]?.url) || "/placeholder-item.jpg"}
                    alt={otherItem?.title || "Item do outro"}
                    fill
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={PLACEHOLDER_BLUR}
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium mb-0.5">Troca em andamento</p>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {myItem?.title} ↔ {otherItem?.title}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div 
        className="flex-1 overflow-y-auto"
      >
        <div className="px-4 sm:px-5 py-6">
          {!Array.isArray(messages) || messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl px-6 py-8 shadow-sm border border-gray-100 max-w-sm"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-50 to-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Send className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Nenhuma mensagem</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Envie a primeira mensagem para começar a negociação da troca!
                </p>
              </motion.div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message, index) => {
                const isMine = isMyMessage(message);
                const showDate =
                  index === 0 ||
                  new Date(message.created_at).toDateString() !==
                    new Date(messages[index - 1].created_at).toDateString();

                return (
                  <div key={message.id}>
                    {showDate && (
                      <div className="flex items-center justify-center my-6">
                        <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                          <span className="text-xs font-semibold text-gray-600">
                            {isToday(new Date(message.created_at))
                              ? "Hoje"
                              : isYesterday(new Date(message.created_at))
                              ? "Ontem"
                              : format(new Date(message.created_at), "dd 'de' MMMM", {
                                  locale: ptBR,
                                })}
                          </span>
                        </div>
                      </div>
                    )}

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex items-start gap-2.5 ${isMine ? "justify-end" : "justify-start"}`}
                    >
                      {!isMine && (
                        <Avatar src={getUrl(otherUser?.avatar_url)} size="sm" className="flex-shrink-0" />
                      )}
                      
                      <div
                        className={`max-w-[75%] sm:max-w-[65%] rounded-2xl px-3.5 py-2 shadow-sm ${
                          isMine
                            ? "bg-[#25D366] text-white"
                            : "bg-white text-gray-900 border border-gray-200"
                        }`}
                      >
                        <p className="text-[14px] font-medium leading-[1.45] break-words">
                          {message.content}
                        </p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className={`text-[10px] font-semibold ${isMine ? "text-white/90" : "text-gray-500"}`}>
                            {format(new Date(message.created_at), "HH:mm", { locale: ptBR })}
                          </span>
                          {isMine && (
                            <svg className="w-3.5 h-3.5 text-white/90 flex-shrink-0" viewBox="0 0 16 15" fill="currentColor">
                              <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" />
                            </svg>
                          )}
                        </div>
                      </div>

                      {!isMine && <div className="w-8 flex-shrink-0" />}
                    </motion.div>
                  </div>
                );
              })}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 safe-bottom shadow-lg">
        <div className="px-4 sm:px-5 py-4">
          {/* Action buttons row - Always visible */}
          <div className="flex items-center gap-2 mb-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors text-sm font-medium"
              title="Enviar foto"
            >
              <ImageIcon className="w-4.5 h-4.5" />
              <span>Foto</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-600 transition-colors text-sm font-medium"
              title="Enviar arquivo"
            >
              <File className="w-4.5 h-4.5" />
              <span>Arquivo</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-600 transition-colors text-sm font-medium"
              title="Tirar foto"
            >
              <Camera className="w-4.5 h-4.5" />
              <span>Câmera</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-600 transition-colors text-sm font-medium"
              title="Emoji"
            >
              <Smile className="w-4.5 h-4.5" />
              <span className="hidden sm:inline">Emoji</span>
            </motion.button>
          </div>

          {/* Message input area - Textarea with integrated send button */}
          <div className="relative bg-gray-50 rounded-2xl border-2 border-gray-200 focus-within:border-[#25D366] focus-within:bg-white transition-all">
            <textarea
              ref={inputRef as any}
              placeholder="Digite sua mensagem..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              rows={3}
              className="w-full text-[15px] bg-transparent border-0 outline-none resize-none placeholder-gray-400 px-4 py-3 pr-16"
              style={{
                minHeight: '80px',
                maxHeight: '200px',
                scrollbarWidth: 'thin',
                scrollbarColor: '#cbd5e0 transparent'
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                const newHeight = Math.min(Math.max(target.scrollHeight, 80), 200);
                target.style.height = newHeight + 'px';
              }}
            />
            
            {/* Send button - Positioned absolutely inside textarea */}
            <div className="absolute right-2 bottom-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={!newMessage.trim() || sending}
                className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all shadow-md ${
                  newMessage.trim()
                    ? "bg-[#25D366] hover:bg-[#20BD5C] text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                title="Enviar mensagem (Enter)"
              >
                {sending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </motion.button>
            </div>

            {/* Bottom info bar */}
            <div className="px-4 pb-2.5 pt-1 flex items-center justify-between border-t border-gray-100 mt-1">
              <span className="text-xs text-gray-400">
                {newMessage.length > 0 ? `${newMessage.length} caracteres` : 'Shift+Enter para nova linha'}
              </span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
