import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://baramaja.com';

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  try {
    // Attempt to fetch categories to create anchor-link map entries for Google index
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiUrl}/categories`, {
      next: { revalidate: 3600 }
    });
    const categoriesData = await res.json();
    
    if (categoriesData.success && Array.isArray(categoriesData.data)) {
      categoriesData.data.forEach((cat: any) => {
        routes.push({
          url: `${baseUrl}/#${cat.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      });
    }
  } catch (e) {
    console.error('Error generating dynamic sitemap links:', e);
  }

  return routes;
}
