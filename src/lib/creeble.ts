import { Creeble } from 'creeble-js';

const apiKey = import.meta.env.PUBLIC_CREEBLE_API_KEY;
const projectEndpoint = import.meta.env.PROJECT_ENDPOINT || 'creeble-sample-RlkahByz';

if (!apiKey) {
  throw new Error('CREEBLE_API_KEY is not defined in environment variables');
}

export const creebleClient = new Creeble(apiKey);
export const endpoint = projectEndpoint;

export async function testConnection() {
  try {
    const status = await creebleClient.ping();
    return status;
  } catch (error) {
    console.error('Failed to connect to Creeble:', error);
    throw error;
  }
}

// New helper methods
export async function getPosts() {
  try {
    // Use pagination method which properly fetches all posts from the Posts database
    const response = await creebleClient.data.paginate(endpoint, 1, 25, {
      type: 'rows',
      database: 'Posts'
    });
    
    // Filter for posts with slugs (though all should have them)
    const postsWithSlugs = (response.data || []).filter((post: any) => post.properties?.slug?.value);
    
    return postsWithSlugs;
  } catch (error) {
    console.error('Failed to get posts:', error);
    throw error;
  }
}

export async function getPostsPaginated(page: number = 1, limit: number = 6) {
  try {
    // Use the SDK's paginate method with API-level filtering
    const response = await creebleClient.data.paginate(endpoint, page, limit, {
      type: 'rows',
      database: 'Posts' // This filters at the API level
    });

    // Filter for posts with slugs (if needed)
    const postsWithSlugs = (response.data || []).filter((post: any) =>
      post.properties?.slug?.value
    );

    return {
      data: postsWithSlugs,
      pagination: response.pagination // Use the API's pagination metadata
    };
  } catch (error) {
    console.error('Failed to get paginated posts:', error);
    throw error;
  }
}

export async function getPages() {
  try {
    return await creebleClient.getRowsByDatabase(endpoint, 'Pages');
  } catch (error) {
    console.error('Failed to get pages:', error);
    throw error;
  }
}

export async function getPostBySlug(slug: string) {
  try {
    return await creebleClient.getRowByField(endpoint, 'Posts', 'slug', slug);
  } catch (error) {
    console.error(`Failed to get post by slug ${slug}:`, error);
    throw error;
  }
}

export async function getPageBySlug(slug: string) {
  try {
    return await creebleClient.getRowByField(endpoint, 'Pages', 'slug', slug);
  } catch (error) {
    console.error(`Failed to get page by slug ${slug}:`, error);
    throw error;
  }
}

export async function getDatabaseNames() {
  try {
    return await creebleClient.getDatabaseNames(endpoint);
  } catch (error) {
    console.error('Failed to get database names:', error);
    throw error;
  }
}

export async function getAllContent() {
  try {
    return await creebleClient.getAllRows(endpoint);
  } catch (error) {
    console.error('Failed to get all content:', error);
    throw error;
  }
}

// Transform helper
export function simplifyItem(item: any) {
  return (creebleClient.constructor as any).simplifyItem(item);
}