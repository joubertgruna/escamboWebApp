export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  city?: string;
  state?: string;
  created_at?: string;
}

export interface Item {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  category: string;
  condition: string;
  trade_for?: string;
  status: "active" | "inactive" | "traded";
  photos: ItemPhoto[];
  user?: User;
  created_at: string;
  updated_at?: string;
}

export interface ItemPhoto {
  id: number;
  item_id: number;
  url: string;
  is_primary: boolean;
}

export interface Match {
  id: number;
  user_1_id: number;
  user_2_id: number;
  item_1_id: number;
  item_2_id: number;
  status: "pending" | "active" | "accepted" | "rejected" | "completed";
  ad_shown?: number;
  created_at: string;
  updated_at?: string;
  // Dados populados pelo backend
  user_1?: User;
  user_2?: User;
  item_1?: Item;
  item_2?: Item;
  // Campos legados para compatibilidade
  other_user?: User;
  my_item?: Item;
  other_item?: Item;
  last_message?: Message;
  unread_count?: number;
}

export interface Message {
  id: number;
  match_id: number;
  sender_id: number;
  content: string;
  read_at?: string;
  created_at: string;
}

export interface Like {
  id: number;
  user_id: number;
  item_id: number;
  created_at: string;
  item?: Item;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
