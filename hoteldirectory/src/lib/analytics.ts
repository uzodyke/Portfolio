// Google Analytics 4 configuration and tracking functions

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const GA_TRACKING_ID = 'GA_MEASUREMENT_ID'; // Replace with actual ID

// Initialize Google Analytics
export const initGA = () => {
  // Load Google Analytics script
  const gtagScript = document.createElement('script');
  gtagScript.async = true;
  gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  document.head.appendChild(gtagScript);

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };

  // Configure GA
  window.gtag('js', new Date());
  window.gtag('config', GA_TRACKING_ID, {
    page_title: document.title,
    page_location: window.location.href,
    send_page_view: true,
    anonymize_ip: true,
    cookie_flags: 'SameSite=Strict;Secure'
  });
};

// Track page views
export const trackPageView = (url?: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url || window.location.pathname,
      page_title: document.title,
      page_location: window.location.href
    });
  }
};

// Track events
export const trackEvent = (
  eventName: string,
  eventCategory: string,
  eventLabel?: string,
  value?: number
) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, {
      event_category: eventCategory,
      event_label: eventLabel,
      value: value
    });
  }
};

// Track hotel-specific events
export const trackHotelView = (hotelName: string, hotelSlug: string) => {
  trackEvent('hotel_view', 'engagement', hotelName);

  // Enhanced ecommerce for hotel views
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'view_item', {
      currency: 'USD',
      value: 0,
      items: [{
        item_id: hotelSlug,
        item_name: hotelName,
        item_category: 'hotel',
        quantity: 1
      }]
    });
  }
};

export const trackHotelBookingClick = (hotelName: string, hotelSlug: string) => {
  trackEvent('booking_click', 'conversion', hotelName);

  // Enhanced ecommerce for booking clicks
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'begin_checkout', {
      currency: 'USD',
      value: 0,
      items: [{
        item_id: hotelSlug,
        item_name: hotelName,
        item_category: 'hotel',
        quantity: 1
      }]
    });
  }
};

export const trackPhoneClick = (hotelName: string, phoneNumber: string) => {
  trackEvent('phone_click', 'contact', `${hotelName} - ${phoneNumber}`);
};

export const trackSearch = (searchTerm: string, resultsCount: number) => {
  trackEvent('search', 'engagement', searchTerm, resultsCount);

  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'search', {
      search_term: searchTerm,
      number_of_results: resultsCount
    });
  }
};

export const trackLocationView = (location: string, hotelCount: number) => {
  trackEvent('location_view', 'navigation', location, hotelCount);
};

// Performance tracking
export const trackPerformance = () => {
  if ('performance' in window && 'timing' in window.performance) {
    window.addEventListener('load', () => {
      // Track page load time
      setTimeout(() => {
        const navigation = window.performance.getEntriesByType('navigation')[0] as any;
        const loadTime = navigation ? navigation.loadEventEnd - navigation.startTime : 0;

        trackEvent('page_load_time', 'performance', 'load_time', Math.round(loadTime / 1000));
      }, 0);
    });
  }

  // Track Core Web Vitals if supported
  if ('PerformanceObserver' in window) {
    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        trackEvent('lcp', 'web_vitals', 'largest_contentful_paint', Math.round(entry.startTime));
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const perfEntry = entry as any;
        const fid = perfEntry.processingStart - perfEntry.startTime;
        trackEvent('fid', 'web_vitals', 'first_input_delay', Math.round(fid));
      }
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    let clsValue = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const perfEntry = entry as any;
        if (!perfEntry.hadRecentInput) {
          clsValue += perfEntry.value;
        }
      }
      trackEvent('cls', 'web_vitals', 'cumulative_layout_shift', Math.round(clsValue * 1000));
    }).observe({ entryTypes: ['layout-shift'] });
  }
};

// Cookie consent handling
export const setCookieConsent = (consent: boolean) => {
  localStorage.setItem('ga_consent', consent.toString());

  if (typeof window.gtag !== 'undefined') {
    window.gtag('consent', 'update', {
      analytics_storage: consent ? 'granted' : 'denied'
    });
  }
};

export const getCookieConsent = (): boolean => {
  const consent = localStorage.getItem('ga_consent');
  return consent === 'true';
};

// Initialize analytics with consent check
export const initAnalytics = () => {
  const hasConsent = getCookieConsent();

  if (hasConsent) {
    initGA();
    trackPerformance();
  }
};