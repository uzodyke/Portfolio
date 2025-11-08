import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple CSV import script for Node.js environment
async function importHotelsFromCSV() {
  try {
    // Read the CSV files
    const csvFiles = [
      path.join(__dirname, '../firstfive/first 5.csv'),
      path.join(__dirname, '../firstfive/expensivehotellondon.csv')
    ];

    for (const csvFile of csvFiles) {
      if (fs.existsSync(csvFile)) {
        const csvContent = fs.readFileSync(csvFile, 'utf-8');
        console.log(`Processing ${csvFile}...`);

        // Here you would call your import function
        // For now, just show the first few lines
        const lines = csvContent.split('\n').slice(0, 5);
        console.log('Sample data:');
        lines.forEach((line, index) => {
          if (line.trim()) {
            console.log(`${index}: ${line.substring(0, 100)}...`);
          }
        });
        console.log(`\nFile contains ${csvContent.split('\n').length} lines\n`);
      }
    }
  } catch (error) {
    console.error('Error importing data:', error);
  }
}

importHotelsFromCSV();