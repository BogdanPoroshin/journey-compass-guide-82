
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Константы для подключения к Supabase
const supabaseUrl = "https://mobwtghjbdovunfbzyvy.supabase.co";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Создаем клиент Supabase с сервисным ключом для доступа к данным
export const supabaseClient = createClient(supabaseUrl, supabaseKey);
