import React, { useState, useEffect, useRef } from 'react';
import { FiMessageSquare, FiX, FiSend, FiCoffee, FiPlus, FiRefreshCw } from 'react-icons/fi';
import { chatbotApi } from '../../api/chatbot.api';
import type { Product, SelectedOption } from '../../types';
import { formatVND } from '../../utils/formatters';
import { useCartStore } from '../../stores/useCartStore';
import { ProductOptionModal } from '../ProductOptionModal';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  products?: Product[];
  suggestedQuestions?: string[];
  timestamp: Date;
}

export const DrinkChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [quickPrompts, setQuickPrompts] = useState<string[]>([]);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [hasUnreadAlert, setHasUnreadAlert] = useState<boolean>(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const addItem = useCartStore((state) => state.addItem);

  // Khởi tạo tin nhắn chào mừng và tải gợi ý
  useEffect(() => {
    const welcomeMsg: Message = {
      id: 'welcome',
      sender: 'bot',
      text: 'Dạ chào bạn! Mình là Barista Ảo của quán ☕. Bạn đang muốn tìm đồ uống có hương vị thế nào hôm nay (thanh mát giải nhiệt, béo ngậy kem mây, ít đường giữ dáng hay món signature)? Hãy chia sẻ với mình nhé!',
      timestamp: new Date(),
    };
    setMessages([welcomeMsg]);

    chatbotApi
      .getQuickPrompts()
      .then((prompts) => {
        if (prompts && prompts.length > 0) {
          setQuickPrompts(prompts);
        } else {
          setQuickPrompts([
            'Món thanh mát giải nhiệt',
            'Trà sữa béo ngậy kem cheese',
            'Món ít calo cho người ăn kiêng',
            'Best Seller của quán',
          ]);
        }
      })
      .catch(() => {
        setQuickPrompts([
          'Món thanh mát giải nhiệt',
          'Trà sữa béo ngậy kem cheese',
          'Món ít calo cho người ăn kiêng',
          'Best Seller của quán',
        ]);
      });
  }, []);

  // Tự động cuộn xuống cuối đoạn chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Focus input khi mở chat
  useEffect(() => {
    if (isOpen) {
      setHasUnreadAlert(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    setInputMessage('');

    // Thêm tin nhắn user
    const userMsg: Message = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Chuẩn bị lịch sử trò chuyện
      const history = messages.slice(-6).map((m) => ({
        role: (m.sender === 'user' ? 'user' : 'model') as 'user' | 'model',
        text: m.text,
      }));

      const res = await chatbotApi.sendMessage(query, history);

      const botMsg: Message = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: res.text,
        products: res.products || [],
        suggestedQuestions: res.suggestedQuestions || [],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('[ChatbotWidget] Error:', err);
      const errorMsg: Message = {
        id: 'err-' + Date.now(),
        sender: 'bot',
        text: 'Ôi, có vẻ đường truyền mạng của mình vừa gián đoạn một chút. Bạn thử gửi lại tin nhắn giúp mình nhé!',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    const welcomeMsg: Message = {
      id: 'welcome-' + Date.now(),
      sender: 'bot',
      text: 'Dạ mình đã sẵn sàng cho buổi tư vấn mới! Bạn đang có gu đồ uống gì trong đầu không nè?',
      timestamp: new Date(),
    };
    setMessages([welcomeMsg]);
  };

  const handleAddToCartFromModal = (
    product: Product,
    size: 'S' | 'M' | 'L',
    sugarLevel: '0%' | '30%' | '50%' | '100%',
    iceLevel: 'Không đá' | 'Ít đá' | 'Vừa đá' | 'Nhiều đá',
    selectedOptions: SelectedOption[],
    quantity: number,
    note: string,
    discountAmount?: number
  ) => {
    addItem(product, size, sugarLevel, iceLevel, selectedOptions, quantity, note, discountAmount);
    setSelectedProductForModal(null);
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 left-6 z-40 flex flex-col items-start">
        {!isOpen && hasUnreadAlert && (
          <div className="mb-2.5 bg-stone-900 text-white text-xs px-3.5 py-1.5 rounded-full shadow-lg border border-amber-400/30 flex items-center gap-1.5 animate-bounce">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Trợ lý Barista AI gợi ý món!</span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`group flex items-center gap-2.5 px-4 py-3 rounded-full shadow-2xl transition-all duration-300 transform active:scale-95 ${
            isOpen
              ? 'bg-stone-800 text-stone-300 hover:bg-stone-900'
              : 'bg-gradient-to-r from-[#1c4d79] via-[#245b8e] to-[#0f3456] text-white hover:shadow-[#1c4d79]/40 hover:-translate-y-0.5'
          }`}
          aria-label="Tư vấn chọn đồ uống AI"
        >
          {isOpen ? (
            <>
              <FiX className="w-6 h-6 text-stone-200" />
              <span className="text-xs font-bold uppercase tracking-wider">Đóng chat</span>
            </>
          ) : (
            <>
              <div className="relative">
                <FiCoffee className="w-5 h-5 text-amber-200 group-hover:rotate-12 transition-transform" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping"></span>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full"></span>
              </div>
              <span className="text-xs font-bold tracking-wide">Tư vấn đồ uống AI</span>
            </>
          )}
        </button>
      </div>

      {/* Chat Window Dialog */}
      {isOpen && (
        <div className="fixed bottom-22 left-4 sm:left-6 z-40 w-[92vw] sm:w-[410px] h-[580px] max-h-[82vh] bg-white rounded-3xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 text-stone-900">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#1c4d79] via-[#275e91] to-[#3474ad] text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-amber-200 text-xl shadow-inner">
                ☕
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide flex items-center gap-1.5">
                  <span>Barista Ảo Bồng Biêng</span>
                  <span className="text-[10px] bg-amber-400/30 text-amber-100 border border-amber-300/40 px-1.5 py-0.5 rounded-full font-semibold">
                    AI
                  </span>
                </h3>
                <p className="text-[11px] text-blue-100/90 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Trực tuyến • Tư vấn món chuẩn gu</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-white/80">
              <button
                onClick={handleResetChat}
                title="Làm mới hội thoại"
                className="p-2 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              >
                <FiRefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Thu nhỏ"
                className="p-2 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick suggestions bar */}
          <div className="bg-stone-50/90 px-3 py-2 border-b border-stone-100 overflow-x-auto no-scrollbar flex items-center gap-2">
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider shrink-0">
              Gợi ý:
            </span>
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                disabled={isLoading}
                onClick={() => handleSendMessage(prompt)}
                className="shrink-0 text-[11px] bg-white hover:bg-[#e3eff8] hover:text-[#1c4d79] hover:border-[#8eb7d8] text-stone-700 font-medium px-2.5 py-1 rounded-full border border-stone-200 transition-all shadow-xs"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Message List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-stone-50/40">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-[#1c4d79] text-white rounded-br-none'
                      : 'bg-white text-stone-800 border border-stone-200 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>

                {/* Product Recommendations Cards */}
                {msg.products && msg.products.length > 0 && (
                  <div className="w-full mt-2.5 space-y-2">
                    <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1 pl-1">
                      <FiCoffee className="w-3.5 h-3.5 text-amber-700" />
                      <span>Món nước phù hợp gợi ý cho bạn:</span>
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {msg.products.map((prod) => (
                        <div
                          key={prod.id}
                          className="bg-white border border-stone-200 hover:border-[#8eb7d8] rounded-2xl p-2.5 flex items-center justify-between gap-3 shadow-xs hover:shadow-md transition-all group"
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <img
                              src={
                                prod.image ||
                                'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&q=80'
                              }
                              alt={prod.name}
                              className="w-13 h-13 rounded-xl object-cover border border-stone-100 shrink-0 group-hover:scale-105 transition-transform"
                            />
                            <div className="overflow-hidden">
                              <h4 className="font-bold text-xs text-stone-900 truncate">
                                {prod.name}
                              </h4>
                              <p className="text-xs font-extrabold text-[#1c4d79]">
                                {formatVND(prod.price)}
                              </p>
                              {prod.description && (
                                <p className="text-[10px] text-stone-500 truncate max-w-[180px]">
                                  {prod.description}
                                </p>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => setSelectedProductForModal(prod)}
                            className="shrink-0 bg-[#e3eff8] hover:bg-[#1c4d79] text-[#1c4d79] hover:text-white font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                          >
                            <FiPlus className="w-3.5 h-3.5" />
                            <span>Chọn món</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Follow-up question chips */}
                {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                  <div className="w-full mt-2.5 pl-1 space-y-1.5">
                    <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                      <span>💡 Gợi ý câu hỏi tiếp theo:</span>
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestedQuestions.map((sq, i) => (
                        <button
                          key={i}
                          disabled={isLoading}
                          onClick={() => handleSendMessage(sq)}
                          className="text-[11px] bg-white hover:bg-[#e3eff8] hover:text-[#1c4d79] hover:border-[#8eb7d8] text-stone-700 px-2.5 py-1 rounded-full transition-all border border-stone-200 shadow-xs cursor-pointer active:scale-95 text-left"
                        >
                          {sq}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="bg-white border border-stone-200 rounded-2xl rounded-bl-none p-3 shadow-xs flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#1c4d79] animate-bounce"></span>
                    <span
                      className="w-2 h-2 rounded-full bg-[#1c4d79] animate-bounce"
                      style={{ animationDelay: '0.15s' }}
                    ></span>
                    <span
                      className="w-2 h-2 rounded-full bg-[#1c4d79] animate-bounce"
                      style={{ animationDelay: '0.3s' }}
                    ></span>
                  </div>
                  <span className="text-xs text-stone-500 font-medium">
                    Barista đang tra cứu menu và pha chế lời khuyên...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-stone-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2 bg-stone-50 border border-stone-300 focus-within:border-[#1c4d79] rounded-2xl px-3 py-1.5 transition-colors"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Nhắn gu của bạn (vd: Món chua thanh, ít ngọt...)"
                disabled={isLoading}
                className="flex-1 bg-transparent text-xs text-stone-900 placeholder-stone-400 focus:outline-none py-1.5"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="p-2 rounded-xl bg-[#1c4d79] text-white hover:bg-[#153a5c] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0"
              >
                <FiSend className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal chỉnh tuỳ chọn đường/đá/size để thêm vào giỏ hàng */}
      {selectedProductForModal && (
        <ProductOptionModal
          product={selectedProductForModal}
          onClose={() => setSelectedProductForModal(null)}
          onAddToCart={handleAddToCartFromModal}
        />
      )}
    </>
  );
};
