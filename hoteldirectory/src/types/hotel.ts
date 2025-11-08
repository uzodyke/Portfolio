export interface Hotel {
  id: number;
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
  created_at: string;
  updated_at: string;
}

export interface HotelCSVRow {
  name: string;
  site: string;
  phone: string;
  full_address: string;
  borough: string;
  street: string;
  city: string;
  postal_code: string;
  state: string;
  country: string;
  latitude: string;
  longitude: string;
  reviews: string;
  reviews_tags: string;
  photo: string;
  street_view: string;
  working_hours: string;
}