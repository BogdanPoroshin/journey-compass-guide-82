
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { supabaseClient } from "../_shared/supabase-client.ts";

// Получаем токен бота из переменных окружения
const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
const WEBHOOK_URL = `https://mobwtghjbdovunfbzyvy.functions.supabase.co/telegram-bot`;

// Базовый URL API Telegram
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

// CORS заголовки для возможности вызова из фронтенда
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-action",
};

// Функция для отправки сообщения пользователю
async function sendMessage(chat_id: number, text: string, parse_mode = "HTML") {
  try {
    const response = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id,
        text,
        parse_mode,
      }),
    });
    
    return await response.json();
  } catch (error) {
    console.error("Error sending message:", error);
    return { ok: false, error };
  }
}

// Получение топ-3 популярных маршрутов
async function getTopRoutes() {
  try {
    const { data, error } = await supabaseClient
      .from('routes')
      .select(`
        id,
        title,
        description,
        duration,
        difficulty_level,
        reviews(rating)
      `)
      .is('is_public', true)
      .limit(3);
    
    if (error) throw error;
    
    // Вычисляем средний рейтинг для каждого маршрута
    const routesWithRating = data.map(route => {
      const reviews = route.reviews || [];
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const avgRating = reviews.length > 0 ? totalRating / reviews.length : 0;
      
      return {
        ...route,
        rating: avgRating,
        review_count: reviews.length
      };
    });
    
    // Сортируем по рейтингу
    return routesWithRating.sort((a, b) => b.rating - a.rating);
  } catch (error) {
    console.error("Error fetching top routes:", error);
    return [];
  }
}

// Поиск маршрутов по запросу
async function searchRoutes(query: string) {
  try {
    const { data, error } = await supabaseClient
      .from('routes')
      .select(`
        id,
        title,
        description,
        duration,
        difficulty_level
      `)
      .is('is_public', true)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(5);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error searching routes:", error);
    return [];
  }
}

// Получение информации о маршруте по ID
async function getRouteById(routeId: string) {
  try {
    const { data, error } = await supabaseClient
      .from('routes')
      .select(`
        *,
        categories:route_categories(categories(*)),
        creator:users!routes_creator_id_fkey(*),
        reviews(rating)
      `)
      .eq('id', routeId)
      .single();
    
    if (error) throw error;
    
    // Вычисляем средний рейтинг
    const reviews = data?.reviews || [];
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = reviews.length > 0 ? totalRating / reviews.length : 0;
    
    // Категории маршрута
    const categories = data?.categories?.map(item => item.categories) || [];
    
    return {
      ...data,
      categories,
      rating: avgRating,
      review_count: reviews.length
    };
  } catch (error) {
    console.error("Error fetching route by ID:", error);
    return null;
  }
}

// Форматирование информации о маршруте для отображения в Telegram
function formatRouteInfo(route) {
  const stars = "⭐".repeat(Math.round(route.rating || 0));
  const difficultyEmoji = {
    "Easy": "🟢",
    "Moderate": "🟡",
    "Hard": "🟠",
    "Extreme": "🔴"
  };
  
  const difficulty = route.difficulty_level 
    ? `${difficultyEmoji[route.difficulty_level] || "❓"} ${route.difficulty_level}` 
    : "Не указано";
  
  return `<b>${route.title}</b>\n\n` +
    `📝 ${route.description.substring(0, 100)}${route.description.length > 100 ? '...' : ''}\n\n` +
    `⏱ Длительность: ${route.duration} дней\n` +
    `${difficulty}\n` +
    `${stars} (${route.review_count || 0} отзывов)\n\n` +
    `🆔 ${route.id}`;
}

// Обработка команд бота
async function handleCommand(message) {
  const chatId = message.chat.id;
  const text = message.text || '';
  
  if (text.startsWith('/start')) {
    return sendMessage(
      chatId, 
      `Привет! Я бот для поиска маршрутов путешествий. 🌍✈️\n\n` +
      `Доступные команды:\n` +
      `/popular - Показать популярные маршруты\n` +
      `/search [запрос] - Поиск маршрутов\n` +
      `/route [id] - Информация о конкретном маршруте`
    );
  }
  
  else if (text.startsWith('/popular')) {
    const topRoutes = await getTopRoutes();
    
    if (topRoutes.length === 0) {
      return sendMessage(chatId, "К сожалению, не удалось найти популярные маршруты.");
    }
    
    let response = "<b>🏆 Топ популярных маршрутов:</b>\n\n";
    
    for (const route of topRoutes) {
      response += formatRouteInfo(route) + "\n\n";
    }
    
    response += "Для получения подробной информации о маршруте используйте команду /route [id]";
    
    return sendMessage(chatId, response);
  }
  
  else if (text.startsWith('/search')) {
    const query = text.replace('/search', '').trim();
    
    if (!query) {
      return sendMessage(chatId, "Пожалуйста, укажите поисковый запрос. Например: /search горы");
    }
    
    const routes = await searchRoutes(query);
    
    if (routes.length === 0) {
      return sendMessage(chatId, `По запросу "${query}" ничего не найдено. Попробуйте другой запрос.`);
    }
    
    let response = `<b>🔍 Результаты поиска по запросу "${query}":</b>\n\n`;
    
    for (const route of routes) {
      response += formatRouteInfo(route) + "\n\n";
    }
    
    response += "Для получения подробной информации о маршруте используйте команду /route [id]";
    
    return sendMessage(chatId, response);
  }
  
  else if (text.startsWith('/route')) {
    const routeId = text.replace('/route', '').trim();
    
    if (!routeId) {
      return sendMessage(chatId, "Пожалуйста, укажите ID маршрута. Например: /route 123");
    }
    
    const route = await getRouteById(routeId);
    
    if (!route) {
      return sendMessage(chatId, `Маршрут с ID ${routeId} не найден.`);
    }
    
    const stars = "⭐".repeat(Math.round(route.rating || 0));
    const difficultyEmoji = {
      "Easy": "🟢",
      "Moderate": "🟡",
      "Hard": "🟠",
      "Extreme": "🔴"
    };
    
    const difficulty = route.difficulty_level 
      ? `${difficultyEmoji[route.difficulty_level] || "❓"} ${route.difficulty_level}` 
      : "Не указано";
    
    const categories = route.categories.map(cat => cat.name).join(", ") || "Не указаны";
    
    let response = `<b>${route.title}</b>\n\n` +
      `📝 ${route.description}\n\n` +
      `⏱ Длительность: ${route.duration} дней\n` +
      `${difficulty}\n` +
      `💰 Примерная стоимость: ${route.estimated_cost ? route.estimated_cost + ' ₽' : 'Не указана'}\n` +
      `🏷️ Категории: ${categories}\n` +
      `${stars} (${route.review_count || 0} отзывов)\n` +
      `👤 Автор: ${route.creator.username}\n`;
    
    return sendMessage(chatId, response);
  }
  
  else {
    return sendMessage(
      chatId, 
      `Я не понимаю эту команду. Доступные команды:\n` +
      `/popular - Показать популярные маршруты\n` +
      `/search [запрос] - Поиск маршрутов\n` +
      `/route [id] - Информация о конкретном маршруте`
    );
  }
}

// Новая функция для обработки запросов из веб-чата
async function handleChatQuery(query: string) {
  try {
    // Начинаем с общих ответов на запросы
    if (query.toLowerCase().includes("маршрут") || query.toLowerCase().includes("маршруты")) {
      // Если пользователь спрашивает о маршрутах
      const routes = await getTopRoutes();
      if (routes.length > 0) {
        let response = "Вот несколько популярных маршрутов:\n\n";
        for (const route of routes) {
          response += `• ${route.title} - ${route.description.substring(0, 50)}...\n`;
        }
        return response;
      }
    }
    
    // Проверяем, не является ли запрос поиском
    if (query.toLowerCase().includes("найти") || query.toLowerCase().includes("поиск")) {
      const searchTerm = query.replace(/найти|поиск/gi, "").trim();
      if (searchTerm) {
        const results = await searchRoutes(searchTerm);
        if (results.length > 0) {
          let response = `По запросу "${searchTerm}" найдено ${results.length} маршрутов:\n\n`;
          for (const route of results) {
            response += `• ${route.title} - ${route.description.substring(0, 50)}...\n`;
          }
          return response;
        } else {
          return `По запросу "${searchTerm}" ничего не найдено. Попробуйте другие ключевые слова.`;
        }
      }
    }
    
    // Общая информация о сервисе
    if (query.toLowerCase().includes("что такое") || query.toLowerCase().includes("о сервисе") || query.toLowerCase().includes("о сайте")) {
      return "Наш сервис помогает путешественникам находить и создавать маршруты для путешествий. Пользователи могут публиковать свои маршруты, делиться опытом и оставлять отзывы о местах, которые они посетили.";
    }
    
    // Ответы на приветствия
    if (query.toLowerCase().includes("привет") || query.toLowerCase().includes("здравствуй")) {
      return "Привет! Я чат-бот помощник по маршрутам. Спрашивайте меня о популярных маршрутах, категориях или о том, как пользоваться сервисом!";
    }
    
    // Ответы на благодарности
    if (query.toLowerCase().includes("спасибо") || query.toLowerCase().includes("благодар")) {
      return "Рад был помочь! Если у вас возникнут еще вопросы, обращайтесь.";
    }
    
    // Если не смогли определить запрос
    return "Извините, я не совсем понял ваш запрос. Попробуйте спросить о популярных маршрутах, о том, как создать маршрут или как пользоваться сервисом.";
  } catch (error) {
    console.error("Error handling chat query:", error);
    return "Произошла ошибка при обработке запроса. Пожалуйста, попробуйте позже.";
  }
}

// Установка webhook для бота
async function setWebhook() {
  try {
    const response = await fetch(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`);
    const data = await response.json();
    console.log("Webhook setup response:", data);
    return data;
  } catch (error) {
    console.error("Error setting webhook:", error);
    return { ok: false, error };
  }
}

// Основной обработчик запросов
serve(async (req) => {
  // Обработка CORS для preflight запросов
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Проверка наличия токена бота
  if (!TELEGRAM_BOT_TOKEN) {
    return new Response(
      JSON.stringify({ error: "TELEGRAM_BOT_TOKEN is missing" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
  
  // Проверяем заголовок x-action
  const action = req.headers.get('x-action');
  
  // Маршрут для установки webhook
  if (action === 'setup-webhook') {
    const result = await setWebhook();
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
  
  // Новый маршрут для запросов из веб-чата
  if (action === 'chat-query') {
    try {
      const { query } = await req.json();
      
      if (!query || typeof query !== 'string') {
        return new Response(
          JSON.stringify({ error: "Query parameter is required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const response = await handleChatQuery(query);
      
      return new Response(
        JSON.stringify({ response }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("Error handling chat query:", error);
      return new Response(
        JSON.stringify({ error: "Failed to process query" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  }

  try {
    // Проверяем, пустой ли запрос, чтобы избежать ошибки при парсинге JSON
    const contentLength = req.headers.get('content-length');
    if (!contentLength || parseInt(contentLength) === 0) {
      return new Response(
        JSON.stringify({ ok: true, message: "Empty request body" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  
    // Пробуем разобрать JSON только если есть данные
    try {
      // Обработка входящих обновлений от Telegram
      const update = await req.json();
      console.log("Received update:", JSON.stringify(update));
      
      // Обработка сообщений
      if (update.message) {
        await handleCommand(update.message);
      }
    } catch (jsonError) {
      console.error("Error parsing JSON:", jsonError);
      return new Response(
        JSON.stringify({ ok: false, error: "Invalid JSON in request body" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error handling Telegram update:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
