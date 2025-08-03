import type { APIRoute } from 'astro';
import { getPosts } from '../../lib/creeble';

export const GET: APIRoute = async ({ url }) => {
  const offset = parseInt(url.searchParams.get('offset') || '0');
  const limit = parseInt(url.searchParams.get('limit') || '2');
  
  try {
    // Get all posts and apply client-side pagination
    const allPosts = await getPosts();
    
    // Sort posts by creation date (newest first)
    const sortedPosts = allPosts.sort((a: any, b: any) => {
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);
      return dateB.getTime() - dateA.getTime();
    });
    
    // Apply pagination
    const paginatedPosts = sortedPosts.slice(offset, offset + limit);
    const hasMore = offset + limit < sortedPosts.length;
    
    return new Response(JSON.stringify({
      posts: paginatedPosts,
      hasMore,
      total: sortedPosts.length
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch posts' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};