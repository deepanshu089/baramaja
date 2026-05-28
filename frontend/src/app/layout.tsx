import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ShopProvider } from '@/context/ShopContext';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://baramaja.com';

export const viewport: Viewport = {
  themeColor: '#78350f', // Amber-900 matching the brand's primary color
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'Baramaja India | Authentic Regional Indian Foods',
  description: 'Handcrafted premium delicacies sourced directly from the authentic kitchens of Odisha and Kolkata. 100% natural, direct-to-consumer sweets, snacks, pickles, and spices.',
  keywords: [
    'Baramaja', 'Baramaja India', 'Odisha food', 'Kolkata food', 'Chhena Poda online', 
    'Nolen Gur sweets', 'Pahala Rasagola online', 'authentic Indian food D2C', 
    'traditional sweets Odisha', 'Bengal snacks', 'terracotta sweets brand'
  ],
  authors: [{ name: 'Baramaja India' }],
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Baramaja India | Authentic Regional Indian Foods',
    description: 'Handcrafted premium delicacies sourced directly from the authentic kitchens of Odisha and Kolkata. 100% natural, direct-to-consumer sweets, snacks, pickles, and spices.',
    url: SITE_URL,
    siteName: 'Baramaja India',
    images: [
      {
        url: '/images/hero-heritage-bg.jpg', // Main high-quality brand image
        width: 1200,
        height: 630,
        alt: 'Baramaja India Authentic Foods',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Baramaja India | Authentic Regional Indian Foods',
    description: 'Premium delicacies sourced directly from the authentic kitchens of Odisha and Kolkata.',
    images: ['/images/hero-heritage-bg.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // E-commerce Structured Data Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    'name': 'Baramaja India',
    'url': SITE_URL,
    'logo': 'https://res.cloudinary.com/dieef3h1w/image/upload/v1779975413/cropped_circle_image_jpnao1.png',
    'image': 'https://res.cloudinary.com/dieef3h1w/image/upload/v1779975413/cropped_circle_image_jpnao1.png',
    'description': 'Handcrafted premium delicacies sourced directly from the authentic kitchens of Odisha and Kolkata. 100% natural, direct-to-consumer sweets, snacks, pickles, and spices.',
    'telephone': '+91-XXXX-XXXXXX',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Bhubaneswar and Kolkata',
      'addressLocality': 'Bhubaneswar',
      'addressRegion': 'Odisha',
      'postalCode': '751001',
      'addressCountry': 'IN',
    },
    'priceRange': '₹₹',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': `${SITE_URL}/#search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <ShopProvider>
          {children}
        </ShopProvider>
      </body>
    </html>
  );
}
