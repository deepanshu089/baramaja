import type { Metadata } from 'next';
import './globals.css';
import { ShopProvider } from '@/context/ShopContext';

export const metadata: Metadata = {
  title: 'Baramaja India | Authentic Regional Indian Foods',
  description: 'Handcrafted premium delicacies sourced directly from the kitchens of Odisha and Kolkata. 100% natural, direct-to-consumer sweets, snacks, pickles, and spices.',
  keywords: ['Baramaja', 'Odisha food', 'Kolkata food', 'Chhena Poda', 'Nolen Gur', 'Pahala Rasagola', 'authentic Indian food'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased min-h-screen flex flex-col">
        <ShopProvider>
          {children}
        </ShopProvider>
      </body>
    </html>
  );
}
