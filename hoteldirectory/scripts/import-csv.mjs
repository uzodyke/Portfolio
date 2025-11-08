import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase configuration - update with your credentials
const SUPABASE_URL = 'https://ntncjdoeutfkkdkzaaif.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50bmNqZG9ldXRma2tka3phYWlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1Nzk3MDUsImV4cCI6MjA3ODE1NTcwNX0.AHz3vm6Wz9yLQjzrR0-LELv6V8s5Nacr0OmWt5IzHuo';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function generateSlug(name, city) {
  const combined = `${name} ${city}`;
  return combined
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function parseCSVRow(row) {
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

async function importCSVFile(csvContent) {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const errors = [];
  let success = 0;

  console.log(`Processing ${lines.length - 1} hotel records...`);

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
        if (success % 10 === 0) {
          console.log(`Imported ${success} hotels...`);
        }
      }
    } catch (e) {
      errors.push(`Row ${i + 1}: ${e.message}`);
    }
  }

  return { success, errors };
}

async function main() {
  try {
    console.log('🏨 Starting hotel data import...\n');

    // Read the CSV files
    const csvFiles = [
      path.join(__dirname, '../firstfive/first 5.csv'),
      path.join(__dirname, '../firstfive/expensivehotellondon.csv')
    ];

    let totalSuccess = 0;
    let totalErrors = [];

    for (const csvFile of csvFiles) {
      if (fs.existsSync(csvFile)) {
        console.log(`📁 Processing ${path.basename(csvFile)}...`);

        const csvContent = fs.readFileSync(csvFile, 'utf-8');
        const result = await importCSVFile(csvContent);

        console.log(`✅ Successfully imported: ${result.success} hotels`);
        if (result.errors.length > 0) {
          console.log(`❌ Errors: ${result.errors.length}`);
          result.errors.slice(0, 5).forEach(error => console.log(`   - ${error}`));
          if (result.errors.length > 5) {
            console.log(`   ... and ${result.errors.length - 5} more errors`);
          }
        }

        totalSuccess += result.success;
        totalErrors = totalErrors.concat(result.errors);
        console.log('');
      } else {
        console.log(`❌ File not found: ${csvFile}`);
      }
    }

    console.log('🎉 Import completed!');
    console.log(`✅ Total imported: ${totalSuccess} hotels`);
    console.log(`❌ Total errors: ${totalErrors.length}`);

    if (totalErrors.length > 0) {
      console.log('\n📝 Writing error log...');
      fs.writeFileSync(
        path.join(__dirname, 'import-errors.log'),
        totalErrors.join('\n')
      );
      console.log('Error details saved to import-errors.log');
    }

  } catch (error) {
    console.error('💥 Import failed:', error);
    process.exit(1);
  }
}

main();