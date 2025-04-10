
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { loginDemo } from "@/api/supabaseApi";
import { User } from "@/api/types";
import { toast } from "@/hooks/use-toast";

interface UserContextProps {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loginAsDemoUser: () => Promise<boolean>;
  register: (username: string, email: string, password: string, full_name?: string) => Promise<boolean>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Проверяем сессию при загрузке
  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsLoading(true);
        
        // Для упрощения, автоматически входим как демо-пользователь
        const { user } = await loginDemo();
        setUser(user);
      } catch (error) {
        console.error("Ошибка сессии:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  // Вход в систему
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Получаем информацию о пользователе
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select()
        .eq('email', email)
        .single();
        
      if (userError) throw userError;
      
      setUser(userData as User);
      
      toast({
        title: "Вход выполнен",
        description: "Вы успешно вошли в систему."
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Ошибка входа",
        description: error.message || "Не удалось войти. Проверьте данные и попробуйте снова.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Регистрация нового пользователя
  const register = async (username: string, email: string, password: string, full_name: string = "") => {
    try {
      setIsLoading(true);
      
      // Проверяем, существует ли пользователь с таким email или username
      const { data: existingUser } = await supabase
        .from('users')
        .select()
        .or(`email.eq.${email},username.eq.${username}`)
        .maybeSingle();
        
      if (existingUser) {
        if (existingUser.email === email) {
          throw new Error("Пользователь с таким email уже существует");
        } else {
          throw new Error("Пользователь с таким именем уже существует");
        }
      }
      
      // Создаем нового пользователя
      const { data: newUser, error } = await supabase
        .from('users')
        .insert([
          { 
            username, 
            email, 
            password_hash: password, // В реальном приложении хеширование пароля должно выполняться на сервере
            full_name: full_name || null 
          }
        ])
        .select()
        .single();
        
      if (error) throw error;
      
      // Автоматически входим как новый пользователь
      setUser(newUser as User);
      
      toast({
        title: "Регистрация успешна",
        description: "Вы успешно зарегистрировались и вошли в систему."
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Ошибка регистрации",
        description: error.message || "Не удалось зарегистрироваться. Пожалуйста, попробуйте позже.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Выход из системы
  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Для упрощения, просто сбрасываем состояние пользователя
      setUser(null);
      
      toast({
        title: "Выход выполнен",
        description: "Вы успешно вышли из системы."
      });
    } catch (error: any) {
      toast({
        title: "Ошибка выхода",
        description: error.message || "Не удалось выйти из системы.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Вход как демо-пользователь
  const loginAsDemoUser = async () => {
    try {
      setIsLoading(true);
      
      const { user } = await loginDemo();
      
      if (!user) throw new Error("Не удалось войти как демо-пользователь");
      
      setUser(user);
      
      toast({
        title: "Демо-режим активирован",
        description: "Вы вошли как демо-пользователь."
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Ошибка входа в демо-режим",
        description: error.message || "Не удалось войти. Пожалуйста, попробуйте позже.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    loginAsDemoUser,
    register
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser должен использоваться внутри UserProvider");
  }
  return context;
};
