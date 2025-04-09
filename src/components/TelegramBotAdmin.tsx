
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const TelegramBotAdmin = () => {
  const [isLoading, setIsLoading] = useState(false);

  const setupWebhook = async () => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('telegram-bot', {
        url: '/setup-webhook',
        method: 'GET',
      });

      if (error) throw error;

      if (data.ok) {
        toast({
          title: "Webhook успешно настроен",
          description: "Telegram бот готов к работе",
        });
      } else {
        throw new Error(data.description || "Не удалось настроить webhook");
      }
    } catch (error) {
      console.error("Ошибка при настройке webhook:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось настроить webhook для бота. Проверьте консоль для деталей.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Telegram Бот
          <Badge variant="outline" className="ml-2">Beta</Badge>
        </CardTitle>
        <CardDescription>
          Управление Telegram ботом для вашего сервиса маршрутов
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Бот позволяет пользователям искать и просматривать маршруты через Telegram. 
          Доступны следующие команды:
        </p>
        <ul className="text-sm space-y-1 list-disc pl-5 mb-4">
          <li><code>/start</code> - Начать работу с ботом</li>
          <li><code>/popular</code> - Показать популярные маршруты</li>
          <li><code>/search [запрос]</code> - Поиск маршрутов</li>
          <li><code>/route [id]</code> - Подробная информация о маршруте</li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button onClick={setupWebhook} disabled={isLoading}>
          {isLoading ? "Настройка..." : "Настроить webhook"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TelegramBotAdmin;
