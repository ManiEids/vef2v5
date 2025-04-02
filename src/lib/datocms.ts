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
      homepage {
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
    console.log('Fetching homepage data from DatoCMS');
    const data = await request({ query: QUERY, variables: {} });
    console.log('Raw homepage data received:', JSON.stringify(data, null, 2));
    
    if (data?.homepage) {
      return {
        ...data.homepage,
        headerImage: data.homepage.headerimage
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
  const results: TestLocation[] = [];
  
  // Try to fetch the locationtest record with stadur field
  try {
    const LOCATION_QUERY = `
      query {
        locationtest {
          id
          _createdAt
          stadur {
            latitude
            longitude
          }
        }
      }
    `;
    
    console.log('Fetching locationtest with stadur field');
    const locationData = await request({ query: LOCATION_QUERY });
    
    if (locationData?.locationtest && locationData.locationtest.stadur) {
      console.log('Found locationtest with stadur field');
      results.push({
        id: locationData.locationtest.id,
        name: `Location at ${locationData.locationtest.stadur?.latitude?.toFixed(4) || 0}, ${locationData.locationtest.stadur?.longitude?.toFixed(4) || 0}`,
        description: `Staðsetning--> datocms Geolocation model (stadur field)`,
        location: {
          latitude: locationData.locationtest.stadur?.latitude || 0,
          longitude: locationData.locationtest.stadur?.longitude || 0
        },
        createdAt: locationData.locationtest._createdAt
      });
    }
  } catch (error) {
    console.log('Error fetching locationtest with stadur:', error);
  }
  
  // Try to fetch the locationtest record with berlin field (newly discovered field)
  try {
    const BERLIN_QUERY = `
      query {
        locationtest {
          id
          _createdAt
          berlin {
            latitude
            longitude
          }
        }
      }
    `;
    
    console.log('Fetching locationtest with berlin field');
    const berlinData = await request({ query: BERLIN_QUERY });
    
    if (berlinData?.locationtest && berlinData.locationtest.berlin) {
      console.log('Found locationtest with berlin field');
      results.push({
        id: `${berlinData.locationtest.id}-berlin`,
        name: `Berlin Location at ${berlinData.locationtest.berlin?.latitude?.toFixed(4) || 0}, ${berlinData.locationtest.berlin?.longitude?.toFixed(4) || 0}`,
        description: `Staðsetning--> datocms Geolocation model (berlin field)`,
        location: {
          latitude: berlinData.locationtest.berlin?.latitude || 0,
          longitude: berlinData.locationtest.berlin?.longitude || 0
        },
        createdAt: berlinData.locationtest._createdAt
      });
    }
  } catch (error) {
    console.log('Error fetching locationtest with berlin field:', error);
  }
  
  // If we found any locations, return them
  if (results.length > 0) {
    console.log(`Found ${results.length} locations in total`);
    return results;
  }
  
  // If all attempts failed, create a dummy location as fallback
  console.log('No location data found, returning dummy location');
  return [{
    id: 'demo-1',
    name: 'Example Location (Berlin)',
    description: 'This is a demo location. Please add real locations in DatoCMS by creating a "LocationTest" record with "stadur" or "berlin" field.',
    location: {
      latitude: 52.520008,
      longitude: 13.404954
    },
    createdAt: new Date().toISOString()
  }];
}

export async function fetchTestLocationById(id: string): Promise<TestLocation | null> {
  try {
    const LOCATION_TEST_QUERY = `
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
    
    const testData = await request({ query: LOCATION_TEST_QUERY, variables: { id } });
    if (testData?.locationtest && testData.locationtest.stadur) {
      return {
        id: testData.locationtest.id,
        name: `Location at ${testData.locationtest.stadur?.latitude.toFixed(4)}, ${testData.locationtest.stadur?.longitude.toFixed(4)}`,
        description: `Staðsetning--> datocms Geolocation model`,
        location: {
          latitude: testData.locationtest.stadur?.latitude || 0,
          longitude: testData.locationtest.stadur?.longitude || 0
        },
        createdAt: testData.locationtest._createdAt
      };
    }
  } catch (locationError) {
    console.log('Not found in LocationTest model', locationError);
  }
  
  try {
    const PROFA_QUERY = `
      query ProfaById($id: ItemId) {
        profa(filter: {id: {eq: $id}}) {
          id
          _createdAt
          berlinberlin {
            latitude
            longitude
          }
        }
      }
    `;
    
    const profaData = await request({ query: PROFA_QUERY, variables: { id } });
    if (profaData?.profa && profaData.profa.berlinberlin) {
      return {
        id: profaData.profa.id,
        name: `Berlin Location at ${profaData.profa.berlinberlin?.latitude.toFixed(4)}, ${profaData.profa.berlinberlin?.longitude.toFixed(4)}`,
        description: `A location from Profa model`,
        location: {
          latitude: profaData.profa.berlinberlin?.latitude || 0,
          longitude: profaData.profa.berlinberlin?.longitude || 0
        },
        createdAt: profaData.profa._createdAt
      };
    }
  } catch (profaError) {
    console.log('Not found in Profa model', profaError);
  }
  
  console.error(`No location found with id: ${id}`);
  return null;
}
