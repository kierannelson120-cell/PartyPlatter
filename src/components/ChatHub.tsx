import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, ChevronLeft, Plus, Image as ImageIcon, MessageSquare, 
  Check, CheckCheck, ShoppingBag, Sparkles, AlertCircle, Cloud, Upload 
} from 'lucide-react';
import { ChatThread, ChatMessage, CustomQuote } from '../types';
import { sendMessageToFirestore, getOrInitUserId } from '../firebase';
import CloudUploadModal from './CloudUploadModal';

interface ChatHubProps {
  threads: ChatThread[];
  setThreads: React.Dispatch<React.SetStateAction<ChatThread[]>>;
  activeThreadId: string | null;
  onBackToInbox: () => void;
  onAddCustomQuoteToCart: (vendorId: string, quote: CustomQuote) => void;
  onOpenThread: (threadId: string) => void;
}

export default function ChatHub({
  threads,
  setThreads,
  activeThreadId,
  onBackToInbox,
  onAddCustomQuoteToCart,
  onOpenThread
}: ChatHubProps) {
  const [inputText, setInputText] = useState('');
  const [showCloudModal, setShowCloudModal] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const activeThread = threads.find(t => t.id === activeThreadId);

  // Auto scroll to bottom
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeThread?.messages]);

  // Handle message sending
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeThreadId || !activeThread) return;

    const userText = inputText.trim();
    setInputText('');
    const userId = getOrInitUserId();

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toISOString()
    };

    // Send to Google Cloud Firestore real-time DB
    await sendMessageToFirestore(
      activeThreadId, 
      activeThread.vendorId, 
      activeThread.vendorName, 
      activeThread.vendorImageUrl, 
      newMsg, 
      userId
    );

    // Simulate vendor fast auto-response/follow up
    setTimeout(async () => {
      let responseText = `Grazie for writing! I've received your request and am checking my cooking calendar. Let me review your menu specifics and I'll send over details shortly! 👨‍🍳`;
      let quote: CustomQuote | undefined = undefined;

      if (activeThreadId === 'chef_1' && userText.toLowerCase().includes('quote')) {
        responseText = "Perfect! I've constructed a Custom Menu Package for your tableside GF Italian meal. Tap the digital receipt below to proceed directly to Checkout!";
        quote = {
          title: 'GF Birthday Feast (6 Guests)',
          amount: 510,
          items: [
            'Handmade chickpea flour Gnocchi Pomodoro',
            'Flourless Caprese chocolate cake',
            'Full clean, plating, & tableside services'
          ]
        };
      }

      const vendorMsg: ChatMessage = {
        id: `msg_auto_${Date.now()}`,
        sender: 'vendor',
        text: responseText,
        timestamp: new Date().toISOString(),
        customQuote: quote
      };

      await sendMessageToFirestore(
        activeThreadId, 
        activeThread.vendorId, 
        activeThread.vendorName, 
        activeThread.vendorImageUrl, 
        vendorMsg, 
        userId
      );
    }, 1500);
  };

  const formatMessageTime = (isoString: string) => {
    const d = new Date(isoString);
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  return (
    <div className="absolute inset-0 bg-slate-50 z-30 flex flex-col">
      <AnimatePresence mode="wait">
        {!activeThreadId ? (
          /* INBOX VIEW */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            {/* Header */}
            <div className="bg-slate-900 text-white p-4 pt-6 shrink-0 flex items-center justify-between shadow">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-[#FFC72C]" />
                <h3 className="text-base font-bold tracking-tight">Party Chat</h3>
              </div>
              <span className="text-[10px] bg-white/10 text-amber-300 font-extrabold px-2.5 py-0.5 rounded-full border border-amber-300/20">
                Direct
              </span>
            </div>

            {/* List of Chat Threads */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar bg-slate-50">
              {threads.length === 0 ? (
                <div className="text-center py-24 text-slate-400 flex flex-col items-center">
                  <MessageSquare className="w-10 h-10 text-slate-300 mb-2" />
                  <p className="text-xs">No active chats yet.</p>
                  <p className="text-[10px] text-slate-400 mt-1">Visit vendor pages and tap "Message Vendor" to chat!</p>
                </div>
              ) : (
                threads.map((thread) => {
                  const lastMsg = thread.messages[thread.messages.length - 1];
                  return (
                    <div
                      key={thread.id}
                      onClick={() => onOpenThread(thread.id)}
                      className="bg-white hover:bg-slate-50 rounded-2xl p-4 border border-slate-200/60 shadow-sm flex items-center space-x-3.5 cursor-pointer active:scale-[0.99] transition-all"
                    >
                      {/* Vendor Circle Photo */}
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                        <img src={thread.vendorImageUrl} className="w-full h-full object-cover" />
                      </div>

                      {/* Thread info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-extrabold text-slate-900 truncate">{thread.vendorName}</h4>
                          <span className="text-[10px] text-slate-400">
                            {formatMessageTime(thread.lastMessageTime)}
                          </span>
                        </div>
                        
                        <p className={`text-xs mt-0.5 truncate ${thread.unreadCount > 0 ? 'text-slate-950 font-bold' : 'text-slate-500'}`}>
                          {lastMsg ? lastMsg.text : 'No messages yet.'}
                        </p>
                      </div>

                      {/* Unread badge */}
                      {thread.unreadCount > 0 && (
                        <div className="w-4.5 h-4.5 rounded-full bg-[#7A0019] flex items-center justify-center font-bold text-[9px] text-white">
                          {thread.unreadCount}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        ) : (
          /* THREAD CHAT VIEW */
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="flex-1 flex flex-col h-full overflow-hidden"
          >
            {/* Header */}
            <div className="bg-slate-900 text-white p-3 pt-6 shrink-0 flex items-center border-b border-slate-800 shadow">
              <button
                onClick={onBackToInbox}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400"
              >
                <ChevronLeft className="w-6 h-6 text-slate-300" />
              </button>

              <div className="flex items-center space-x-2.5 ml-2">
                <div className="w-9 h-9 rounded-lg overflow-hidden bg-slate-800 shrink-0">
                  <img src={activeThread?.vendorImageUrl} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-xs font-bold">{activeThread?.vendorName}</h4>
                  <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-0.5">
                    <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Message bubbles list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar bg-slate-100 flex flex-col">
              {activeThread?.messages.map((msg, idx) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[78%] p-3 px-4 rounded-2xl text-xs leading-relaxed shadow-sm ${
                        isUser
                          ? 'bg-[#7A0019] text-white rounded-tr-none'
                          : 'bg-white text-slate-800 rounded-tl-none border border-slate-200'
                      }`}
                    >
                      <p>{msg.text}</p>

                      {/* Display Custom Quote/Receipt Attachment */}
                      {msg.customQuote && (
                        <div className="mt-3 bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 text-xs space-y-2 shadow-inner">
                          <div className="flex items-center space-x-1.5 text-[#7A0019] font-extrabold text-[10px] tracking-wide uppercase">
                            <Sparkles className="w-4 h-4 fill-amber-50" />
                            <span>Custom Digital Invoice</span>
                          </div>

                          <div className="border-b border-slate-200/80 pb-1.5">
                            <h5 className="font-bold text-slate-900">{msg.customQuote.title}</h5>
                            <span className="font-black text-slate-900 text-base mt-1 block">${msg.customQuote.amount}</span>
                          </div>

                          <div className="space-y-1 text-[11px] text-slate-500 font-medium">
                            {msg.customQuote.items.map((it, i) => (
                              <div key={i} className="flex items-start gap-1">
                                <span className="text-[#FFC72C] shrink-0">•</span>
                                <span>{it}</span>
                              </div>
                            ))}
                          </div>

                          {msg.customQuote.isAddedToCart ? (
                            <div className="w-full mt-2.5 bg-emerald-100 text-emerald-800 py-2 rounded-xl text-[10px] font-extrabold flex items-center justify-center space-x-1 border border-emerald-200">
                              <Check className="w-3.5 h-3.5" />
                              <span>Quote Applied to Cart</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => onAddCustomQuoteToCart(activeThreadId, msg.customQuote!)}
                              className="w-full mt-2.5 bg-[#7A0019] hover:bg-[#5E0012] active:scale-95 text-white py-2.5 rounded-xl text-[10px] font-extrabold transition-transform shadow-md flex items-center justify-center space-x-1"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Accept & Add to Cart</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Timestamp & Read receipts */}
                    <div className="text-[9px] text-slate-400 mt-1 px-1 flex items-center space-x-1">
                      <span>{formatMessageTime(msg.timestamp)}</span>
                      {isUser && (
                        <span className="text-[#FFC72C]">
                          {idx === activeThread.messages.length - 1 ? (
                            <CheckCheck className="w-3.5 h-3.5" />
                          ) : (
                            <Check className="w-3.5 h-3.5" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={chatBottomRef}></div>
            </div>

            {/* Chat message composer input bar */}
            <form
              onSubmit={handleSendMessage}
              className="p-3.5 bg-white border-t border-slate-200 shrink-0 flex items-center space-x-2"
            >
              <button
                type="button"
                onClick={() => setShowCloudModal(true)}
                className="p-2 text-[#7A0019] hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
                title="Upload & attach document / photo via Google Cloud"
              >
                <Cloud className="w-5 h-5 text-[#7A0019]" />
              </button>
              
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message or attach a Google Cloud file..."
                className="flex-1 bg-slate-100 rounded-full py-2 px-4 text-xs text-slate-800 focus:outline-none focus:ring-1.5 focus:ring-[#7A0019] focus:bg-white border border-slate-200/60"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2 bg-[#7A0019] text-white rounded-full disabled:bg-slate-100 disabled:text-slate-400 active:scale-90 transition-transform cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Google Cloud Upload Modal for Chat attachments */}
      <CloudUploadModal
        isOpen={showCloudModal}
        onClose={() => setShowCloudModal(false)}
        onSelectFileUrl={(url) => {
          setInputText((prev) => (prev ? `${prev} [Attachment: ${url}]` : `[Attachment: ${url}]`));
        }}
      />
    </div>
  );
}
