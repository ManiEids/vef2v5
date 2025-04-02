import { GraphQLClient } from 'graphql-request';

export interface Category { 
  id: string; 
  title: string; 
  slug: string; 
  description: string; 
  questions?: Question[]; 
}
export interface Answer { id: string; text: string; iscorrect: boolean; }
export interface Question { id: string; text: string; category?: Category; answers: Answer[]; }
export interface HomePage { 
  title: string; 
  subtitle: string; 
  description: string; 
  headerImage?: { 
    url: string; 
    alt: string; 
    width?: number; 
    height?: number; 
    blurUpThumb?: string; 
    responsiveImage?: { src: string; width: number; height: number; alt: string; base64: string; }; 
  };
}
export interface TestLocation { 
  id: string; 
  name: string; 
  description?: string; 
  location: { latitude: number; longitude: number; }; 
  createdAt: string; 
}
interface RequestParams { 
  query: string; 
  variables?: Record<string, any>; 
  includeDrafts?: boolean; 
  excludeInvalid?: boolean; 
}

const isDev = process.env.NODE_ENV !== 'production';

// Use provided token if environment variable is not set
const DATOCMS_API_TOKEN = process.env.DATOCMS_API_TOKEN || 'e8582f6e14ff731e41a93b6457f001';

// F: request fall
export function request({ query, variables = {}, includeDrafts = false, excludeInvalid = false }: RequestParams): Promise<any> {
  const headers: Record<string, string> = { authorization: `Bearer ${DATOCMS_API_TOKEN}` };
  if (includeDrafts) { headers['X-Include-Drafts'] = 'true'; }
  if (excludeInvalid) { headers['X-Exclude-Invalid'] = 'true'; }
  const client = new GraphQLClient('https://graphql.datocms.com', { headers });
  return client.request(query, variables).catch((error: any) => {
    console.log('DatoCMS Request:', { endpoint: 'https://graphql.datocms.com', token: DATOCMS_API_TOKEN ? `${DATOCMS_API_TOKEN.substring(0, 5)}...` : 'Missing', query: query.substring(0, 100) + '...', error });
    throw error;
  });
}

// F: fetchAllCategories fall
export async function fetchAllCategories(): Promise<Category[]> {
  const QUERY = `
    query AllCategories {
      allCategories {
        id
        title
        slug
        description
      }
    }
  `;
  try {
    const data = await request({ query: QUERY });
    return data?.allCategories || [];
  } catch (error) { return []; }
}

// F: fetchCategoryBySlug fall - REMOVE questions field which doesn't exist
export async function fetchCategoryBySlug(slug: string): Promise<{ category: Category }> {
  const QUERY = `
    query CategoryBySlug($slug: String!) {
      category(filter: { slug: { eq: $slug } }) {
        id
        title
        slug
        description
      }
    }
  `;
  try {
    console.log(`Fetching category with slug: ${slug}`);
    const data = await request({ query: QUERY, variables: { slug } });
    console.log('Category data received:', data);
    
    if (!data?.category) { 
      console.error(`No category found with slug: ${slug}`);
      throw new Error(`Category with slug '${slug}' not found`); 
    }
    
    return { category: data.category };
  } catch (error) { 
    console.error(`Error fetching category by slug ${slug}:`, error);
    throw error; 
  }
}

// ADD a dedicated function to get questions for a category by slug
export async function fetchQuestionsByCategorySlug(categorySlug: string): Promise<Question[]> {
  // First get the category to get its ID
  const categoryData = await fetchCategoryBySlug(categorySlug);
  
  if (!categoryData.category) {
    return [];
  }
  
  // Use the category ID to fetch questions
  const QUERY = `
    query QuestionsByCategory($categoryId: ItemId) {
      allQuestions(filter: {category: {eq: ${categoryData.category.id}}}) {
        id
        text
        answers {
          id
          text
          iscorrect
        }
      }
    }
  `;
  
  try {
    console.log(`Fetching questions for category ID: ${categoryData.category.id}`);
    const data = await request({ query: QUERY });
    console.log('Questions data received:', data);
    return data?.allQuestions || [];
  } catch (error) {
    console.error('Error fetching questions for category:', error);
    return []; 
  }
}

// F: fetchQuestionsByCategoryId fall
export async function fetchQuestionsByCategoryId(categoryId: string): Promise<Question[]> {
  const QUERY = `
    query QuestionsByCategoryId($categoryId: ItemId) {
      allQuestions(filter: {category: {eq: $categoryId}}) {
        id
        text
        answers {
          id
          text
          iscorrect
        }
      }
    }
  `;
  try {
    const data = await request({ query: QUERY, variables: { categoryId } });
    return data?.allQuestions || [];
  } catch (error) { return []; }
}

// F: fetchHomePage fall
export async function fetchHomePage(): Promise<HomePage> {
  const QUERY = `
    query {
      allHomePages {
        title
        subtitle
        description
        headerImage {
          url
          alt
          width
          height
        }
      }
    }
  `;
  try {
    const data = await request({ query: QUERY, variables: {} });
    if (data?.allHomePages && data.allHomePages.length > 0) {
      return data.allHomePages[0];
    }
    return { title: 'Quiz App - Mani Eiðsson', subtitle: 'Spurningar - Eitthvað random smíða á DatoCMS', description: 'veldu flokk til að byrja' };
  } catch (error) {
    return { title: 'Quiz App - Mani Eiðsson', subtitle: 'Spurningar - Eitthvað random smíða á DatoCMS', description: 'veldu flokk til að byrja' };
  }
}

// F: fetchAllQuestions fall
export async function fetchAllQuestions(): Promise<Question[]> {
  const QUERY = `
    query AllQuestions {
      allQuestions {
        id
        text
        category {
          id
          title
          slug
        }
        answers {
          id
          text
          iscorrect
        }
      }
    }
  `;
  try {
    const data = await request({ query: QUERY, variables: {} });
    return data?.allQuestions || [];
  } catch (error) { return []; }
}

// F: fetchQuestionsByCategory fall
export async function fetchQuestionsByCategory(categoryId: string): Promise<Question[]> {
  const QUERY = `
    query QuestionsByCategory($categoryId: ItemId) {
      allQuestions(filter: {category: {eq: $categoryId}}) {
        id
        text
        category {
          id
          title
          slug
        }
        answers {
          id
          text
          iscorrect
        }
      }
    }
  `;
  try {
    const data = await request({ query: QUERY, variables: { categoryId } });
    return data?.allQuestions || [];
  } catch (error) { return []; }
}

// F: fetchAllTestLocations fall - updated to use Stadur instead of TestLocations
export async function fetchAllTestLocations(): Promise<TestLocation[]> {
  const QUERY = `
    query AllTestLocations {
      allStadurs {
        id
        name
        description
        location {
          latitude
          longitude
        }
        createdAt
      }
    }
  `;
  try {
    const data = await request({ query: QUERY, variables: {} });
    console.log('Test locations data received:', data);
    // Check what fields are actually in the response
    if (data && Object.keys(data).length > 0) {
      const firstKey = Object.keys(data)[0];
      console.log(`Data accessed via key: ${firstKey}`, data[firstKey]);
      return data[firstKey] || [];
    }
    return data?.allStadurs || [];
  } catch (error) { 
    console.error('Error fetching test locations:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return []; 
  }
}

// F: fetchTestLocationById fall - updated to use stadur instead of test
export async function fetchTestLocationById(id: string): Promise<TestLocation | null> {
  const QUERY = `
    query TestLocationById($id: ItemId) {
      stadur(filter: {id: {eq: $id}}) {
        id
        name
        description
        location {
          latitude
          longitude
        }
        createdAt
      }
    }
  `;
  try {
    const data = await request({ query: QUERY, variables: { id } });
    if (!data?.stadur) { return null; }
    return data.stadur;
  } catch (error) { return null; }
}
