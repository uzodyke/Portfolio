import { supabase } from './supabase';
import type { HotelCSVRow } from '@/types/hotel';

function generateSlug(name: string, city: string): string {
  const combined = `${name} ${city}`;
  return combined
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function parseCSVRow(row: string): HotelCSVRow | null {
  const columns = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      columns.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  columns.push(current.trim());

  if (columns.length < 17) return null;

  return {
    name: columns[0].replace(/^"|"$/g, ''),
    site: columns[1],
    phone: columns[2],
    full_address: columns[3].replace(/^"|"$/g, ''),
    borough: columns[4],
    street: columns[5],
    city: columns[6],
    postal_code: columns[7],
    state: columns[8],
    country: columns[9],
    latitude: columns[10],
    longitude: columns[11],
    reviews: columns[12],
    reviews_tags: columns[13],
    photo: columns[14],
    street_view: columns[15],
    working_hours: columns[16]
  };
}

export async function importCSVFile(csvContent: string): Promise<{ success: number; errors: string[] }> {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const errors: string[] = [];
  let success = 0;

  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVRow(lines[i]);

    if (!row || !row.name || !row.city) {
      errors.push(`Row ${i + 1}: Invalid data`);
      continue;
    }

    try {
      const lat = parseFloat(row.latitude);
      const lng = parseFloat(row.longitude);
      const reviewCount = row.reviews ? parseInt(row.reviews) : null;

      if (isNaN(lat) || isNaN(lng)) {
        errors.push(`Row ${i + 1}: Invalid coordinates`);
        continue;
      }

      const slug = generateSlug(row.name, row.city);

      const { error } = await supabase
        .from('hotels')
        .upsert({
          name: row.name,
          site: row.site || null,
          phone: row.phone || null,
          full_address: row.full_address,
          borough: row.borough === 'None' ? null : row.borough,
          street: row.street || null,
          city: row.city,
          postal_code: row.postal_code || null,
          state: row.state || null,
          country: row.country,
          latitude: lat,
          longitude: lng,
          reviews: reviewCount,
          reviews_tags: row.reviews_tags || null,
          photo: row.photo || null,
          street_view: row.street_view || null,
          working_hours: row.working_hours || null,
          slug
        }, {
          onConflict: 'slug'
        });

      if (error) {
        errors.push(`Row ${i + 1}: ${error.message}`);
      } else {
        success++;
      }
    } catch (e) {
      errors.push(`Row ${i + 1}: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  }

  return { success, errors };
}

export async function getAllHotels() {
  const { data, error } = await supabase
    .from('hotels')
    .select('*')
    .order('name');

  if (error) {
    throw new Error(`Failed to fetch hotels: ${error.message}`);
  }

  return data || [];
}

export async function getHotelBySlug(slug: string) {
  const { data, error } = await supabase
    .from('hotels')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Hotel not found
    }
    throw new Error(`Failed to fetch hotel: ${error.message}`);
  }

  return data;
}

export async function getHotelsByCity(city: string) {
  const { data, error } = await supabase
    .from('hotels')
    .select('*')
    .ilike('city', `%${city}%`)
    .order('name');

  if (error) {
    throw new Error(`Failed to fetch hotels by city: ${error.message}`);
  }

  return data || [];
}