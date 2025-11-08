import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ntncjdoeutfkkdkzaaif.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50bmNqZG9ldXRma2tka3phYWlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1Nzk3MDUsImV4cCI6MjA3ODE1NTcwNX0.AHz3vm6Wz9yLQjzrR0-LELv6V8s5Nacr0OmWt5IzHuo';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function getLondonBoroughs() {
  try {
    console.log('🔍 Analyzing imported London hotel data...\n');

    // Get unique boroughs (non-null values)
    const { data: boroughs, error: boroughError } = await supabase
      .from('hotels')
      .select('borough')
      .not('borough', 'is', null)
      .neq('borough', 'None');

    if (boroughError) {
      console.error('Error fetching boroughs:', boroughError);
      return;
    }

    // Get unique postal codes for area analysis
    const { data: postcodes, error: postcodeError } = await supabase
      .from('hotels')
      .select('postal_code')
      .not('postal_code', 'is', null);

    if (postcodeError) {
      console.error('Error fetching postcodes:', postcodeError);
      return;
    }

    // Process boroughs
    const uniqueBoroughs = [...new Set(boroughs.map(b => b.borough))].filter(b => b && b !== 'None');

    // Extract London areas from postal codes (first 2-3 characters)
    const londonAreas = [...new Set(postcodes.map(p => p.postal_code?.substring(0, 3)).filter(p => p))];

    console.log('📍 Found London Boroughs:');
    uniqueBoroughs.forEach((borough, index) => {
      console.log(`${index + 1}. ${borough}`);
    });

    console.log('\n🏘️ Found London Areas (by postcode):');
    londonAreas.sort().forEach((area, index) => {
      console.log(`${index + 1}. ${area}`);
    });

    // Get hotel counts per area
    const { data: areaStats, error: statsError } = await supabase
      .from('hotels')
      .select('postal_code, city')
      .not('postal_code', 'is', null);

    if (!statsError && areaStats) {
      const areaCounts = {};
      areaStats.forEach(hotel => {
        const area = hotel.postal_code?.substring(0, 3);
        if (area) {
          areaCounts[area] = (areaCounts[area] || 0) + 1;
        }
      });

      console.log('\n📊 Hotel counts by London area:');
      Object.entries(areaCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .forEach(([area, count]) => {
          console.log(`${area}: ${count} hotels`);
        });
    }

    console.log('\n✨ Analysis complete!');

  } catch (error) {
    console.error('Error analyzing data:', error);
  }
}

getLondonBoroughs();