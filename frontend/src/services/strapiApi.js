import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';
const API_URL = `${STRAPI_URL}/api`;

// Helper to build Strapi image URLs
export function getStrapiMedia(url) {
  if (!url) return null;
  if (url.startsWith('http') || url.startsWith('//')) return url;
  return `${STRAPI_URL}${url}`;
}

export const strapiApi = createApi({
  reducerPath: 'strapiApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ['Article', 'Category', 'Global'],
  endpoints: (builder) => ({
    // Articles
    getArticles: builder.query({
      query: (params = {}) => ({
        url: '/articles',
        params: {
          'populate[cover]': true,
          'populate[category]': true,
          'populate[author][populate][avatar]': true,
          sort: 'createdAt:desc',
          ...params,
        },
      }),
      providesTags: ['Article'],
    }),

    getArticleBySlug: builder.query({
      query: (slug) => ({
        url: '/articles',
        params: {
          'filters[slug][$eq]': slug,
          'populate[cover]': true,
          'populate[category]': true,
          'populate[author][populate][avatar]': true,
          'populate[blocks][populate]': '*',
        },
      }),
      transformResponse: (response) => {
        // Return the first matching article
        return response.data?.[0] || null;
      },
      providesTags: (result) =>
        result ? [{ type: 'Article', id: result.id }] : ['Article'],
    }),

    // Categories
    getCategories: builder.query({
      query: () => ({
        url: '/categories',
        params: { populate: '*' },
      }),
      providesTags: ['Category'],
    }),

    // Global site settings
    getGlobal: builder.query({
      query: () => ({
        url: '/global',
        params: {
          'populate[favicon]': true,
          'populate[defaultSeo][populate]': '*',
        },
      }),
      providesTags: ['Global'],
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useGetArticleBySlugQuery,
  useGetCategoriesQuery,
  useGetGlobalQuery,
} = strapiApi;
