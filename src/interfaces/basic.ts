export interface Item {
  id?: number;
  category_id: number;
  imageUrl: string;
  name: string;
  price: number;
  category?: string;
}

export interface Category {
  id?: number;
  category: string;
  imageUrl: string;
}

export interface Printer {
  id?: number;
  description: string;
  ip: string;
}

export interface Room {
  id?: number;
  description: string;
  price: number;
  isAvailable: boolean;
}

export interface Order {
  order_id?: number;
  room_id: number;
  duration_hours: number;
  start_time: Date;
  end_time: Date;
  room_rate: number;
  room_total_price: number;
  grand_total_price: number;
  status: "completed" | "ongoing";
}

export interface OrderItem {
  id?: number;
  order_id: number;
  item_id: number;
  quantity: number;
  price: number;
  total_price: number;
}

export interface User {
  id?: number;
  username: string;
  password: string;
  role: "admin" | "user" | "staff";
}