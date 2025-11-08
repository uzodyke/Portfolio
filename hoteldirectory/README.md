# Hotel Directory

A comprehensive, SEO-optimized hotel directory built with Astro, TypeScript, Tailwind CSS, and Supabase.

## 🏨 Features

### Core Functionality
- **Comprehensive Hotel Database** - Store and display hotel information with detailed metadata
- **Location-Based Search** - Dynamic city pages with optimized routing
- **CSV Data Import** - Bulk import hotel data from CSV files
- **Responsive Design** - Mobile-first, fully responsive interface
- **Real-time Search** - Client-side filtering and search functionality

### SEO Optimization
- **Schema.org Markup** - LocalBusiness, Hotel, and structured data
- **Dynamic Meta Tags** - Page-specific titles, descriptions, and OG tags
- **XML Sitemap** - Auto-generated sitemap with priority settings
- **Robots.txt** - Optimized for search engines and AI crawlers
- **Critical CSS** - Inline above-the-fold styles for performance
- **Image Optimization** - Responsive images with lazy loading
- **Core Web Vitals** - Performance monitoring and optimization

### Technical Stack
- **Astro** - Static site generation with optimal performance
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Supabase** - Backend database and real-time features
- **Google Analytics** - Comprehensive tracking and analytics

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone and install dependencies**
   ```bash
   cd hotel-directory
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your Supabase credentials:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Database Setup**
   - Create a new Supabase project
   - Run the SQL from `supabase-schema.sql` in your Supabase SQL editor
   - This creates the hotels table with proper indexes and security policies

4. **Import Hotel Data**
   ```bash
   npm run import-data
   ```
   This will import the CSV data from the `firstfive` folder into your Supabase database.

5. **Start Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:4321](http://localhost:4321) to view the site.

### Build for Production
```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── SEOHead.astro    # SEO metadata and structured data
│   ├── HotelCard.astro  # Hotel listing card component
│   ├── Breadcrumbs.astro # Navigation breadcrumbs
│   └── ImageOptimized.astro # Optimized image component
├── layouts/
│   └── BaseLayout.astro # Main page layout with header/footer
├── pages/
│   ├── index.astro      # Homepage
│   ├── hotels/
│   │   ├── index.astro  # All hotels listing
│   │   └── [slug].astro # Individual hotel pages
│   └── locations/
│       ├── index.astro  # All locations
│       └── [city].astro # City-specific hotel listings
├── lib/
│   ├── supabase.ts      # Supabase client and types
│   ├── csv-import.ts    # Data import functionality
│   └── analytics.ts     # Google Analytics integration
├── types/
│   └── hotel.ts         # TypeScript type definitions
└── styles/
    └── global.css       # Global styles and utilities
```

## 🗃️ Database Schema

The hotels table includes:
- **Basic Info**: name, site, phone, address details
- **Location**: latitude, longitude, city, country
- **Metadata**: reviews, photos, working hours
- **SEO**: slug for URL generation
- **Timestamps**: created_at, updated_at

Key indexes on city, borough, slug, and geographic coordinates for optimal performance.

## 📊 SEO Features

### Page Types
- **Homepage** - Brand and service overview
- **Hotel Detail Pages** - Individual hotel information with Schema.org markup
- **City Pages** - Location-specific landing pages
- **Directory Pages** - Complete hotel listings

### Schema Markup
- LocalBusiness for individual hotels
- BreadcrumbList for navigation
- WebSite with search functionality
- TouristDestination for city pages

### Performance
- Critical CSS inlined for above-the-fold content
- Progressive image loading with WebP support
- Prefetch for critical resources
- Code splitting and lazy loading

## 🔧 Configuration

### Google Analytics
Update `src/lib/analytics.ts` with your GA4 measurement ID:
```typescript
export const GA_TRACKING_ID = 'G-XXXXXXXXXX';
```

### Site Settings
Update `astro.config.mjs` with your domain:
```javascript
export default defineConfig({
  site: 'https://yourdomain.com',
  // ... other config
});
```

### SEO Customization
Global SEO settings in `src/components/SEOHead.astro`:
- Default meta tags
- Open Graph configuration
- Twitter Card settings
- Favicon and app icons

## 📈 Analytics & Tracking

### Events Tracked
- Hotel page views
- Booking button clicks
- Phone number clicks
- Search queries
- Location page views
- Core Web Vitals

### Custom Dimensions
- Hotel name and slug
- Search terms and results
- User location data
- Performance metrics

## 🛠️ Development

### Adding New Hotels
1. Add hotel data to CSV file in `firstfive/` folder
2. Run `npm run import-data` to sync with database
3. New pages will be automatically generated on next build

### Creating New Page Types
1. Add new page files in `src/pages/`
2. Use BaseLayout for consistent SEO and structure
3. Add appropriate Schema.org markup
4. Update sitemap configuration if needed

### Custom Components
All components follow Astro patterns with TypeScript support:
- Props interfaces for type safety
- SEO-optimized markup
- Accessibility features
- Performance considerations

## 📱 Mobile Optimization

- Mobile-first responsive design
- Touch-friendly interface elements
- Optimized images for different screen sizes
- Fast loading on mobile networks
- Progressive Web App features

## 🔒 Security

- Row Level Security (RLS) enabled on Supabase
- Input validation and sanitization
- HTTPS enforcement
- Secure cookie settings
- Content Security Policy headers

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run astro` - Run Astro CLI commands
- `npm run lint` - Lint and format code
- `npm run import-data` - Import CSV data to database

## 🌟 Key Benefits

### For Users
- Fast, responsive hotel search
- Comprehensive hotel information
- Direct booking capabilities
- Mobile-optimized experience

### For SEO
- Complete Schema.org markup
- Optimized page structures
- Fast Core Web Vitals scores
- Location-specific landing pages

### For Development
- Type-safe codebase
- Component-based architecture
- Easy data management
- Scalable design patterns

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For questions or support:
- Check the documentation
- Review existing GitHub issues
- Create a new issue with detailed information

---

Built with ❤️ using Astro, TypeScript, and modern web technologies.