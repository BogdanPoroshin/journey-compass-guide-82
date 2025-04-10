
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Bot, ArrowUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Message = {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
};

const initialMessages: Message[] = [
  {
    id: "welcome",
    text: "Привет! Я ваш помощник по маршрутам. Чем могу помочь?",
    isBot: true,
    timestamp: new Date(),
  },
];

const suggestedQuestions = [
  "Как найти маршруты?",
  "Как создать маршрут?",
  "Как добавить маршрут в избранное?",
  "Где посмотреть популярные маршруты?",
];

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (text: string = inputText) => {
    if (!text.trim()) return;

    // Добавляем сообщение пользователя
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      // Определение ответов на часто задаваемые вопросы
      let botResponse = "";
      const lowerText = text.toLowerCase();

      if (lowerText.includes("найти") || lowerText.includes("поиск")) {
        botResponse = "Для поиска маршрутов перейдите на страницу 'Маршруты' и используйте поисковую строку в верхней части страницы. Вы также можете фильтровать маршруты по категориям, продолжительности и сложности.";
      } else if (lowerText.includes("создать")) {
        botResponse = "Чтобы создать маршрут, сначала авторизуйтесь, затем нажмите на кнопку 'Создать маршрут' в верхней части страницы или в разделе 'Маршруты'.";
      } else if (lowerText.includes("избранное") || lowerText.includes("сохранить")) {
        botResponse = "Чтобы добавить маршрут в избранное, авторизуйтесь и нажмите на иконку сердечка на карточке маршрута или на странице с детальным описанием маршрута. Все избранные маршруты доступны в разделе 'Избранное'.";
      } else if (lowerText.includes("популярн")) {
        botResponse = "Популярные маршруты отображаются на главной странице сайта. Они сортируются по рейтингу на основе отзывов пользователей.";
      } else if (lowerText.includes("привет") || lowerText.includes("здравствуй")) {
        botResponse = "Привет! Чем могу помочь вам сегодня?";
      } else if (lowerText.includes("спасибо")) {
        botResponse = "Всегда рад помочь! Если у вас возникнут ещё вопросы, обращайтесь.";
      } else {
        // Попытка получить ответ от Telegram-бота через функцию
        try {
          const { data, error } = await supabase.functions.invoke('telegram-bot', {
            method: 'POST',
            headers: {
              'x-action': 'chat-query'
            },
            body: { query: text }
          });
          
          if (error) throw error;
          
          botResponse = data.response || "Извините, я не смог найти информацию по вашему запросу. Попробуйте задать вопрос иначе или обратитесь к разделу помощи.";
        } catch (err) {
          console.error("Error querying bot:", err);
          botResponse = "Извините, я не смог найти информацию по вашему запросу. Попробуйте задать вопрос иначе или обратитесь к разделу помощи.";
        }
      }

      // Добавляем сообщение бота с небольшой задержкой
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: botResponse,
          isBot: true,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsLoading(false);
      }, 700);
    } catch (error) {
      console.error("Error in chatbot:", error);
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Плавающая кнопка для открытия/закрытия чата */}
      <Button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-travel-primary shadow-lg hover:bg-travel-primary/90 z-50"
        onClick={toggleChatbot}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </Button>

      {/* Окно чат-бота */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-[350px] max-h-[500px] shadow-xl z-50 flex flex-col transition-all">
          <CardHeader className="py-3 px-4 border-b">
            <CardTitle className="text-base flex items-center">
              <Bot className="mr-2 h-5 w-5" />
              Чат-помощник
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex-grow overflow-y-auto max-h-[350px]">
            <div className="flex flex-col space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.isBot ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-lg ${
                      message.isBot
                        ? "bg-muted text-foreground"
                        : "bg-travel-primary text-white"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] p-3 rounded-lg bg-muted">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Предлагаемые вопросы в начале чата */}
            {messages.length === 1 && (
              <div className="mt-4">
                <p className="text-xs text-muted-foreground mb-2">Часто задаваемые вопросы:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs py-1 h-auto"
                      onClick={() => handleSendMessage(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="p-2 border-t">
            <div className="flex w-full items-center space-x-2">
              <Input
                className="flex-grow"
                placeholder="Введите сообщение..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
              <Button 
                size="icon" 
                className="bg-travel-primary hover:bg-travel-primary/90"
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputText.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </>
  );
};

export default ChatBot;
