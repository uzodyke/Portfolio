import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Database = {
  public: {
    Tables: {
      hotels: {
        Row: {
          id: number;
          name: string;
          site: string | null;
          phone: string | null;
          full_address: string;
          borough: string | null;
          street: string | null;
          city: string;
          postal_code: string | null;
          state: string | null;
          country: string;
          latitude: number;
          longitude: number;
          reviews: number | null;
          reviews_tags: string | null;
          photo: string | null;
          street_view: string | null;
          working_hours: string | null;
          slug: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          site?: string | null;
          phone?: string | null;
          full_address: string;
          borough?: string | null;
          street?: string | null;
          city: string;
          postal_code?: string | null;
          state?: string | null;
          country: string;
          latitude: number;
          longitude: number;
          reviews?: number | null;
          reviews_tags?: string | null;
          photo?: string | null;
          street_view?: string | null;
          working_hours?: string | null;
          slug: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          site?: string | null;
          phone?: string | null;
          full_address?: string;
          borough?: string | null;
          street?: string | null;
          city?: string;
          postal_code?: string | null;
          state?: string | null;
          country?: string;
          latitude?: number;
          longitude?: number;
          reviews?: number | null;
          reviews_tags?: string | null;
          photo?: string | null;
          street_view?: string | null;
          working_hours?: string | null;
          slug?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};