export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: 'customer' | 'store_owner' | 'admin'
          full_name: string
          phone: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role?: 'customer' | 'store_owner' | 'admin'
          full_name: string
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: 'customer' | 'store_owner' | 'admin'
          full_name?: string
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      stores: {
        Row: {
          id: string
          owner_id: string
          name: string
          description: string | null
          address: string
          location: unknown
          image_url: string | null
          is_kosher: boolean
          wolt_link: string | null
          status: 'pending' | 'active' | 'rejected'
          is_approved: boolean
          created_at: string
          updated_at: string
          average_rating: number
          review_count: number
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          description?: string | null
          address: string
          location?: unknown
          image_url?: string | null
          is_kosher?: boolean
          wolt_link?: string | null
          status?: 'pending' | 'active' | 'rejected'
          is_approved?: boolean
          created_at?: string
          updated_at?: string
          average_rating?: number
          review_count?: number
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          description?: string | null
          address?: string
          location?: unknown
          image_url?: string | null
          is_kosher?: boolean
          wolt_link?: string | null
          status?: 'pending' | 'active' | 'rejected'
          is_approved?: boolean
          created_at?: string
          updated_at?: string
          average_rating?: number
          review_count?: number
        }
      }
      items: {
        Row: {
          id: string
          store_id: string
          name: string
          description: string | null
          image_url: string | null
          original_price: number
          discount_price: number
          quantity: number
          status: 'available' | 'sold_out' | 'expired'
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          store_id: string
          name: string
          description?: string | null
          image_url?: string | null
          original_price: number
          discount_price: number
          quantity?: number
          status?: 'available' | 'sold_out' | 'expired'
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          store_id?: string
          name?: string
          description?: string | null
          image_url?: string | null
          original_price?: number
          discount_price?: number
          quantity?: number
          status?: 'available' | 'sold_out' | 'expired'
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          customer_id: string
          store_id: string
          item_id: string
          quantity: number
          total_amount: number
          status: 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled'
          qr_code_hash: string | null
          created_at: string
          updated_at: string
          collected_at: string | null
        }
        Insert: {
          id?: string
          customer_id: string
          store_id: string
          item_id: string
          quantity?: number
          total_amount: number
          status?: 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled'
          qr_code_hash?: string | null
          created_at?: string
          updated_at?: string
          collected_at?: string | null
        }
        Update: {
          id?: string
          customer_id?: string
          store_id?: string
          item_id?: string
          quantity?: number
          total_amount?: number
          status?: 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled'
          qr_code_hash?: string | null
          created_at?: string
          updated_at?: string
          collected_at?: string | null
        }
      }
      reviews: {
        Row: {
          id: string
          order_id: string
          store_id: string
          customer_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          store_id: string
          customer_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          store_id?: string
          customer_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'customer' | 'store_owner' | 'admin'
      store_status: 'pending' | 'active' | 'rejected'
      item_status: 'available' | 'sold_out' | 'expired'
      order_status: 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled'
      item_tag: 'meaty' | 'dairy' | 'vegan' | 'vegetarian' | 'gluten_free' | 'kosher' | 'halal'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
