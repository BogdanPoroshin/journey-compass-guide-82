import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, LogIn, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

// Схема для валидации логина
const loginSchema = z.object({
  email: z.string().email({ message: "Введите корректный email" }),
  password: z.string().min(6, { message: "Пароль должен содержать минимум 6 символов" }),
});

// Схема для валидации регистрации
const registerSchema = z.object({
  username: z.string().min(3, { message: "Имя пользователя должно содержать минимум 3 символа" }),
  email: z.string().email({ message: "Введите корректный email" }),
  password: z.string().min(6, { message: "Пароль должен содержать минимум 6 символов" }),
  full_name: z.string().optional(),
});

const Auth = () => {
  const { login, register, isLoading, user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>("login");

  // Устанавливаем активную вкладку на основе URL параметра
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get("tab");
    if (tab === "register") {
      setActiveTab("register");
    }
  }, [location]);

  // Если пользователь уже авторизован, перенаправляем на главную
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Форма для входа
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Форма для регистрации
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      full_name: "",
    },
  });

  // Обработчик логина
  const onLogin = async (values: z.infer<typeof loginSchema>) => {
    try {
      const success = await login(values.email, values.password);
      if (success) {
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Ошибка входа",
        description: error.message || "Не удалось войти. Пожалуйста, попробуйте снова.",
        variant: "destructive"
      });
    }
  };

  // Обработчик регистрации
  const onRegister = async (values: z.infer<typeof registerSchema>) => {
    const success = await register(values.username, values.email, values.password, values.full_name || "");
    if (success) {
      navigate("/");
    }
  };

  return (
    <div className="container max-w-md mx-auto py-10 px-4">
      <Link to="/" className="flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Вернуться на главную
      </Link>
      
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Journey Compass</h1>
        <p className="text-muted-foreground mt-2">
          Откройте для себя удивительные маршруты путешествий
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="login">Вход</TabsTrigger>
          <TabsTrigger value="register">Регистрация</TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="space-y-6">
          <div className="text-center mb-6">
            <LogIn className="h-8 w-8 mx-auto text-primary opacity-80" />
            <h2 className="text-xl font-medium mt-2">Вход в аккаунт</h2>
          </div>

          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="your@email.com" 
                        {...field} 
                        disabled={isLoading} 
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Пароль</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="••••••••" 
                        {...field} 
                        type="password" 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Вход..." : "Войти"}
              </Button>
            </form>
          </Form>

          <div className="mt-4 text-center">
            <Button 
              variant="link" 
              className="text-sm text-muted-foreground p-0" 
              onClick={() => setActiveTab("register")}
            >
              Нет аккаунта? Зарегистрироваться
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="register" className="space-y-6">
          <div className="text-center mb-6">
            <UserPlus className="h-8 w-8 mx-auto text-primary opacity-80" />
            <h2 className="text-xl font-medium mt-2">Создание аккаунта</h2>
          </div>

          <Form {...registerForm}>
            <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
              <FormField
                control={registerForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя пользователя</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="username" 
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={registerForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="your@email.com" 
                        {...field} 
                        disabled={isLoading} 
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={registerForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Пароль</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="••••••••" 
                        {...field} 
                        type="password" 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={registerForm.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Полное имя (необязательно)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Иван Иванов" 
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Регистрация..." : "Зарегистрироваться"}
              </Button>
            </form>
          </Form>

          <div className="mt-4 text-center">
            <Button 
              variant="link" 
              className="text-sm text-muted-foreground p-0" 
              onClick={() => setActiveTab("login")}
            >
              Уже есть аккаунт? Войти
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Auth;
