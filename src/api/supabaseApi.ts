import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Category, PointOfInterest, Review, Route, RouteWithDetails, User } from "./types";

// Аутентификация
export const loginUser = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    
    // Получаем информацию о пользователе
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
      
    if (userError) throw userError;
    
    return { user: userData as User, session: data.session };
  } catch (error: any) {
    toast({
      title: "Ошибка входа",
      description: error.message || "Не удалось войти. Проверьте данные и попробуйте снова.",
      variant: "destructive"
    });
    return { user: null, session: null };
  }
};

// Автоматический вход демо-пользователя 
export const loginDemo = async () => {
  try {
    // Получаем данные о демо-пользователе
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('username', 'demo_user')
      .single();
      
    if (userError) throw userError;
    
    // Возвращаем информацию о демо-пользователе
    return { user: userData as User, session: { user: { id: userData?.id } } };
  } catch (error: any) {
    toast({
      title: "Ошибка входа в демо-режим",
      description: error.message || "Не удалось войти. Пожалуйста, попробуйте позже.",
      variant: "destructive"
    });
    return { user: null, session: null };
  }
};

// Получение маршрутов
export const getRoutes = async (filters?: any) => {
  try {
    let query = supabase
      .from('routes')
      .select(`
        *,
        route_categories!inner(category_id),
        categories:route_categories!inner(categories(*)),
        creator:users!routes_creator_id_fkey(*),
        reviews(rating),
        route_images(*)
      `);

    // Применяем фильтры
    if (filters) {
      if (filters.categories && filters.categories.length > 0) {
        query = query.in('route_categories.category_id', filters.categories);
      }
      
      if (filters.difficulty) {
        query = query.eq('difficulty_level', filters.difficulty);
      }
      
      if (filters.duration) {
        query = query.gte('duration', filters.duration[0])
                    .lte('duration', filters.duration[1]);
      }
      
      if (filters.cost) {
        query = query.gte('estimated_cost', filters.cost[0])
                    .lte('estimated_cost', filters.cost[1]);
      }
      
      if (filters.searchQuery) {
        query = query.or(`title.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`);
      }
    }

    const { data, error } = await query;

    if (error) throw error;

    // Преобразуем данные в нужный формат
    const formattedRoutes: RouteWithDetails[] = data?.map((route: any) => {
      // Вычисляем средний рейтинг
      const reviews = route.reviews || [];
      const totalRating = reviews.reduce((sum: number, review: any) => sum + review.rating, 0);
      const avgRating = reviews.length > 0 ? totalRating / reviews.length : 0;

      // Получаем основное изображение
      const primaryImage = route.route_images?.find((img: any) => img.is_primary) || route.route_images?.[0];
      
      // Категории маршрута
      const categories = route.categories?.map((item: any) => item.categories) || [];

      return {
        ...(route as Route),
        categories,
        rating: avgRating,
        review_count: reviews.length,
        image_url: primaryImage?.image_url,
        is_favorited: false
      };
    }) || [];

    return formattedRoutes;
  } catch (error: any) {
    toast({
      title: "Ошибка загрузки маршрутов",
      description: error.message || "Не удалось загрузить маршруты.",
      variant: "destructive"
    });
    return [];
  }
};

// Получение маршрута по ID
export const getRouteById = async (id: string, userId?: string) => {
  try {
    const { data, error } = await supabase
      .from('routes')
      .select(`
        *,
        route_categories(category_id),
        categories:route_categories(categories(*)),
        creator:users!routes_creator_id_fkey(*),
        reviews(*, user:users!reviews_user_id_fkey(username, profile_image_url)),
        route_images(*),
        route_points(*, point:points_of_interest(*))
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    // Проверяем, добавлен ли маршрут в избранное
    let isFavorited = false;
    if (userId) {
      const { data: favData } = await supabase
        .from('favorites')
        .select('*')
        .eq('route_id', id)
        .eq('user_id', userId);
      
      isFavorited = favData && favData.length > 0;
    }

    // Вычисляем средний рейтинг
    const reviews = data?.reviews || [];
    const totalRating = reviews.reduce((sum: number, review: any) => sum + review.rating, 0);
    const avgRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    // Категории маршрута
    const categories = data?.categories?.map((item: any) => item.categories) || [];

    // Получаем основное изображение
    const primaryImage = data?.route_images?.find((img: any) => img.is_primary) || data?.route_images?.[0];

    // Подготавливаем точки маршрута
    const routePoints = data?.route_points
      ?.sort((a: any, b: any) => a.sequence_order - b.sequence_order)
      ?.map((point: any) => point.point) || [];

    const routeWithDetails: RouteWithDetails = {
      ...(data as Route),
      categories,
      rating: avgRating,
      review_count: reviews.length,
      image_url: primaryImage?.image_url,
      is_favorited: isFavorited,
      points: routePoints as PointOfInterest[],
      creator: data?.creator as User
    };

    return routeWithDetails;
  } catch (error: any) {
    toast({
      title: "Ошибка загрузки маршрута",
      description: error.message || "Не удалось загрузить данные маршрута.",
      variant: "destructive"
    });
    return null;
  }
};

// Получение категорий
export const getCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data as Category[];
  } catch (error: any) {
    toast({
      title: "Ошибка загрузки категорий",
      description: error.message || "Не удалось загрузить категории.",
      variant: "destructive"
    });
    return [];
  }
};

// Добавление маршрута в избранное
export const toggleFavorite = async (routeId: string, userId: string) => {
  try {
    // Проверяем, есть ли уже этот маршрут в избранном
    const { data: existingFav } = await supabase
      .from('favorites')
      .select('*')
      .eq('route_id', routeId)
      .eq('user_id', userId);
    
    if (existingFav && existingFav.length > 0) {
      // Удаляем из избранного
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('route_id', routeId)
        .eq('user_id', userId);
      
      if (error) throw error;
      
      toast({
        title: "Удалено из избранного",
        description: "Маршрут удален из избранного."
      });
      
      return false;
    } else {
      // Добавляем в избранное
      const { error } = await supabase
        .from('favorites')
        .insert([{ route_id: routeId, user_id: userId }]);
      
      if (error) throw error;
      
      toast({
        title: "Добавлено в избранное",
        description: "Маршрут добавлен в избранное."
      });
      
      return true;
    }
  } catch (error: any) {
    toast({
      title: "Ошибка",
      description: error.message || "Не удалось изменить избранное.",
      variant: "destructive"
    });
    return null;
  }
};

// Добавление отзыва
export const addReview = async (routeId: string, userId: string, rating: number, comment: string, visitedDate?: string) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert([{ 
        route_id: routeId,
        user_id: userId,
        rating,
        comment,
        visited_date: visitedDate
      }])
      .select();

    if (error) throw error;
    
    toast({
      title: "Отзыв добавлен",
      description: "Ваш отзыв успешно добавлен."
    });
    
    return data?.[0] as Review;
  } catch (error: any) {
    toast({
      title: "Ошибка добавления отзыва",
      description: error.message || "Не удалось добавить отзыв.",
      variant: "destructive"
    });
    return null;
  }
};

// Получение избранных маршрутов
export const getFavoriteRoutes = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        route_id,
        routes:route_id(
          *,
          route_categories!inner(category_id),
          categories:route_categories!inner(categories(*)),
          creator:users!routes_creator_id_fkey(*),
          reviews(rating),
          route_images(*)
        )
      `)
      .eq('user_id', userId);

    if (error) throw error;

    // Преобразуем данные в нужный формат
    const formattedRoutes: RouteWithDetails[] = data?.map((item: any) => {
      const route = item.routes;
      
      // Вычисляем средний рейтинг
      const reviews = route.reviews || [];
      const totalRating = reviews.reduce((sum: number, review: any) => sum + review.rating, 0);
      const avgRating = reviews.length > 0 ? totalRating / reviews.length : 0;

      // Получаем основное изображение
      const primaryImage = route.route_images?.find((img: any) => img.is_primary) || route.route_images?.[0];
      
      // Категории маршрута
      const categories = route.categories?.map((cat: any) => cat.categories) || [];

      return {
        ...(route as Route),
        categories,
        rating: avgRating,
        review_count: reviews.length,
        image_url: primaryImage?.image_url,
        is_favorited: true,
        creator: route.creator as User
      };
    }) || [];

    return formattedRoutes;
  } catch (error: any) {
    toast({
      title: "Ошибка загрузки избранного",
      description: error.message || "Не удалось загрузить избранные маршруты.",
      variant: "destructive"
    });
    return [];
  }
};

// Создание маршрута
export const createRoute = async (routeData: any, userId: string) => {
  try {
    // Добавляем маршрут
    const { data: route, error: routeError } = await supabase
      .from('routes')
      .insert([{
        title: routeData.title,
        description: routeData.description,
        creator_id: userId,
        duration: routeData.duration,
        distance: routeData.distance,
        difficulty_level: routeData.difficulty_level,
        estimated_cost: routeData.estimated_cost,
        is_public: routeData.is_public !== false
      }])
      .select()
      .single();
    
    if (routeError) throw routeError;
    
    // Добавляем категории
    if (routeData.categories && routeData.categories.length > 0) {
      const categoryInserts = routeData.categories.map((categoryId: number) => ({
        route_id: route!.id,
        category_id: categoryId
      }));
      
      const { error: categoryError } = await supabase
        .from('route_categories')
        .insert(categoryInserts);
      
      if (categoryError) throw categoryError;
    }
    
    // Добавляем изображение, если оно есть
    if (routeData.image_url) {
      const { error: imageError } = await supabase
        .from('route_images')
        .insert([{
          route_id: route!.id,
          image_url: routeData.image_url,
          caption: routeData.title,
          is_primary: true
        }]);
      
      if (imageError) throw imageError;
    }
    
    // Добавляем точки интереса, если они есть
    if (routeData.points && routeData.points.length > 0) {
      for (let i = 0; i < routeData.points.length; i++) {
        const point = routeData.points[i];
        
        // Создаем или находим точку интереса
        let pointId;
        
        if (point.id) {
          pointId = point.id;
        } else {
          const { data: newPoint, error: pointError } = await supabase
            .from('points_of_interest')
            .insert([{
              name: point.name,
              description: point.description,
              latitude: point.latitude,
              longitude: point.longitude,
              address: point.address,
              type: point.type
            }])
            .select()
            .single();
          
          if (pointError) throw pointError;
          pointId = newPoint!.id;
        }
        
        // Привязываем точку к маршруту
        const { error: routePointError } = await supabase
          .from('route_points')
          .insert([{
            route_id: route!.id,
            point_id: pointId,
            sequence_order: i + 1,
            stay_duration: point.stay_duration,
            notes: point.notes
          }]);
        
        if (routePointError) throw routePointError;
      }
    }
    
    toast({
      title: "Маршрут создан",
      description: "Ваш маршрут успешно создан."
    });
    
    return route as Route;
  } catch (error: any) {
    toast({
      title: "Ошибка создания маршрута",
      description: error.message || "Не удалось создать маршрут.",
      variant: "destructive"
    });
    return null;
  }
};

// Создание ссылки для совместного использования
export const createShareLink = async (routeId: string, userId: string, expiresIn?: number) => {
  try {
    // Генерируем уникальный код
    const shareCode = Math.random().toString(36).substring(2, 10);
    
    // Определяем срок действия, если указан
    let expiresAt = null;
    if (expiresIn) {
      const date = new Date();
      date.setHours(date.getHours() + expiresIn);
      expiresAt = date.toISOString();
    }
    
    const { data, error } = await supabase
      .from('share_links')
      .insert([{
        route_id: routeId,
        share_code: shareCode,
        created_by: userId,
        expires_at: expiresAt
      }])
      .select();
    
    if (error) throw error;
    
    toast({
      title: "Ссылка создана",
      description: "Ссылка для совместного использования создана успешно."
    });
    
    return data?.[0];
  } catch (error: any) {
    toast({
      title: "Ошибка создания ссылки",
      description: error.message || "Не удалось создать ссылку для совместного использования.",
      variant: "destructive"
    });
    return null;
  }
};
