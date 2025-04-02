import { GraphQLClient } from 'graphql-request';

export interface Category { 
  id: string; 
  title: string; 
  slug: string; 
  description: string; 
  questions?: Question[]; 
}

export interface Answer { 
  id: string; 
  text: string; 
  iscorrect: boolean; 
}

export interface Question { 
  id: string; 
  text: string; 
  category?: Category; 
  answers: Answer[]; 
}

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
    responsiveImage?: { 
      src: string; 
      width: number; 
      height: number; 
      alt: string; 
      base64: string; 
    }; 
  };
  headerimage?: { 
    url: string; 
    alt: string; 
    width?: number; 
    height?: number; 
    blurUpThumb?: string; 
    responsiveImage?: { 
      src: string; 
      width: number; 
      height: number; 
      alt: string; 
      base64: string; 
    }; 
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
const DATOCMS_API_TOKEN = process.env.DATOCMS_API_TOKEN || 'e8582f6e14ff731e41a93b6457f001';

export function request({ query, variables = {}, includeDrafts = false, excludeInvalid = false }: RequestParams): Promise<any> {
  const headers: Record<string, string> = { authorization: `Bearer ${DATOCMS_API_TOKEN}` };
  if (includeDrafts) { headers['X-Include-Drafts'] = 'true'; }
  if (excludeInvalid) { headers['X-Exclude-Invalid'] = 'true'; }
  
  const client = new GraphQLClient('https://graphql.datocms.com', { headers });
  return client.request(query, variables).catch((error: any) => {
    console.log('DatoCMS Request:', { 
      endpoint: 'https://graphql.datocms.com', 
      token: DATOCMS_API_TOKEN ? `${DATOCMS_API_TOKEN.substring(0, 5)}...` : 'Missing', 
      query: query.substring(0, 100) + '...', 
      error 
    });
    throw error;
  });
}

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
  } catch (error) { 
    return []; 
  }
}

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

export async function fetchQuestionsByCategorySlug(categorySlug: string): Promise<Question[]> {
  const categoryData = await fetchCategoryBySlug(categorySlug);
  if (!categoryData.category) {
    return [];
  }
  
  const QUERY = `
    query QuestionsByCategory($categoryId: ItemId) {
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
    console.log(`Fetching questions for category ID: ${categoryData.category.id}`);
    const data = await request({ 
      query: QUERY, 
      variables: { categoryId: categoryData.category.id }
    });
    console.log('Questions data received:', data);
    
    if (!data?.allQuestions || data.allQuestions.length === 0) {
      console.log('No questions found for this category. Trying alternative query...');
      
      const ALL_QUESTIONS = `
        query {
          allQuestions {
            id
            text
            category {
              id
            }
            answers {
              id
              text
              iscorrect
            }
          }
        }
      `;
      
      const allData = await request({ query: ALL_QUESTIONS });
      console.log('All questions data:', allData);
      
      if (allData?.allQuestions) {
        const filteredQuestions = allData.allQuestions.filter(
          (q: Question) => q.category && q.category.id === categoryData.category.id
        );
        console.log(`Found ${filteredQuestions.length} questions by manual filtering`);
        return filteredQuestions;
      }
    }
    
    return data?.allQuestions || [];
  } catch (error) {
    console.error('Error fetching questions for category:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return []; 
  }
}

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
  } catch (error) { 
    return []; 
  }
}

export async function fetchHomePage(): Promise<HomePage> {
  const QUERY = `
    query {
      allHomePages {
        title
        subtitle
        description
        headerimage {
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
    console.log('Homepage data:', data);
    
    if (data?.allHomePages && data.allHomePages.length > 0) {
      return {
        ...data.allHomePages[0],
        headerImage: data.allHomePages[0].headerimage
      };
    }
    
    return { 
      title: 'Quiz App - Mani Eiðsson', 
      subtitle: 'Spurningar - Eitthvað random smíða á DatoCMS', 
      description: 'veldu flokk til að byrja' 
    };
  } catch (error) {
    console.error('Error fetching homepage:', error);
    return { 
      title: 'Quiz App - Mani Eiðsson', 
      subtitle: 'Spurningar - Eitthvað random smíða á DatoCMS', 
      description: 'veldu flokk til að byrja' 
    };
  }
}

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
  } catch (error) { 
    return []; 
  }
}

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
  } catch (error) { 
    return []; 
  }
}

export async function fetchAllTestLocations(): Promise<TestLocation[]> {
  const queryOptions = [
    'allLocationtest',
    'allLocationTests',
    'allLocationtests',
    'allLocationTestRecords'
  ];

  for (const fieldName of queryOptions) {
    const QUERY = `
      query {
        ${fieldName} {
          id
          _createdAt
          stadur {
            latitude
            longitude
          }
        }
      }
    `;
    
    try {
      console.log(`Trying location query with field: ${fieldName}`);
      const data = await request({ query: QUERY });
      
      if (data && data[fieldName]) {
        console.log(`Success! Found location data using ${fieldName}`);
        return data[fieldName].map((item: any) => ({
          id: item.id,
          name: `Location at ${item.stadur?.latitude?.toFixed(4) || 0}, ${item.stadur?.longitude?.toFixed(4) || 0}`,
          description: `A location in Iceland`,
          location: {
            latitude: item.stadur?.latitude || 0,
            longitude: item.stadur?.longitude || 0
          },
          createdAt: item._createdAt
        }));
      }
    } catch (error) {
      console.log(`Query with ${fieldName} failed:`, error);
    }
  }
  
  console.log('Attempting to find the correct model name with introspection...');
  
  try {
    const SCHEMA_QUERY = `{
      __schema {
        queryType {
          fields {
            name
            description
          }
        }
      }
    }`;
    
    const schema = await request({ query: SCHEMA_QUERY });
    const queryFields = schema?.__schema?.queryType?.fields || [];
    
    console.log('Available query fields:', queryFields.map((f: any) => f.name));
    
    const locationFields = queryFields.filter((f: any) => 
      f.name.toLowerCase().includes('location') || 
      f.name.toLowerCase().includes('test')
    );
    
    console.log('Potential location-related fields:', locationFields);
    
    if (locationFields.length > 0) {
      const mostLikelyField = locationFields[0].name;
      console.log(`Trying most likely field: ${mostLikelyField}`);
      
      const TEST_QUERY = `{
        ${mostLikelyField} {
          id
          _createdAt
        }
      }`;
      
      const testData = await request({ query: TEST_QUERY });
      console.log(`Data from ${mostLikelyField}:`, testData);
    }
  } catch (error) {
    console.error('Schema introspection failed:', error);
  }
  
  return [];
}

export async function fetchTestLocationById(id: string): Promise<TestLocation | null> {
  const QUERY = `
    query LocationTestById($id: ItemId) {
      locationtest(filter: {id: {eq: $id}}) {
        id
        _createdAt
        stadur {
          latitude
          longitude
        }
      }
    }
  `;
  try {
    const data = await request({ query: QUERY, variables: { id } });
    if (!data?.locationtest) { return null; }
    
    return {
      id: data.locationtest.id,
      name: `Location at ${data.locationtest.stadur?.latitude.toFixed(4)}, ${data.locationtest.stadur?.longitude.toFixed(4)}`,
      description: `A location in Iceland`,
      location: {
        latitude: data.locationtest.stadur?.latitude || 0,
        longitude: data.locationtest.stadur?.longitude || 0
      },
      createdAt: data.locationtest._createdAt
    };
  } catch (error) { 
    console.error('Error fetching test location by ID:', error);
    return null; 
  }
}
