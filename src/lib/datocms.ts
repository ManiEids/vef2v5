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

export interface Screenshot {
  id: string;
  myndir: FileField[];  // The asset gallery field
  _createdAt: string;
}

export interface FileField {
  id: string;
  url: string;
  alt?: string;
  title?: string;
  width?: number;
  height?: number;
  responsiveImage?: {
    src: string;
    width: number;
    height: number;
    alt?: string;
    base64?: string;
  };
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
  
  try {
    // Modified query to ensure we get all location data properly
    const COMBINED_QUERY = `
      query {
        locationtest {
          id
          _createdAt
          stadur {
            latitude
            longitude
          }
          berlin {
            latitude
            longitude
          }
        }
      }
    `;
    
    console.log('Sæki staðsetningar frá DatoCMS...');
    const data = await request({ query: COMBINED_QUERY });
    console.log('Raw location data received:', JSON.stringify(data, null, 2));
    
    if (data?.locationtest) {
      // Add stadur location if it exists
      if (data.locationtest.stadur && 
          typeof data.locationtest.stadur.latitude === 'number' && 
          typeof data.locationtest.stadur.longitude === 'number') {
        console.log('Fann staðsetningu á Íslandi:', data.locationtest.stadur);
        results.push({
          id: `${data.locationtest.id}-iceland`,
          name: `Ísland: ${data.locationtest.stadur.latitude.toFixed(4)}, ${data.locationtest.stadur.longitude.toFixed(4)}`,
          description: `Staðsetning--> DatoCMS staðsetningarmódel (stadur reitur)`,
          location: {
            latitude: data.locationtest.stadur.latitude,
            longitude: data.locationtest.stadur.longitude
          },
          createdAt: data.locationtest._createdAt
        });
      }
      
      // Add berlin location if it exists
      if (data.locationtest.berlin && 
          typeof data.locationtest.berlin.latitude === 'number' && 
          typeof data.locationtest.berlin.longitude === 'number') {
        console.log('Fann staðsetningu í Berlín:', data.locationtest.berlin);
        results.push({
          id: `${data.locationtest.id}-berlin`,
          name: `Berlín: ${data.locationtest.berlin.latitude.toFixed(4)}, ${data.locationtest.berlin.longitude.toFixed(4)}`,
          description: `Staðsetning--> DatoCMS staðsetningarmódel (berlín reitur)`,
          location: {
            latitude: data.locationtest.berlin.latitude,
            longitude: data.locationtest.berlin.longitude
          },
          createdAt: data.locationtest._createdAt
        });
      }
    }
    
    console.log(`Fann ${results.length} staðsetningar alls`);
  } catch (error) {
    console.error('Villa við að sækja staðsetningar:', error);
  }
  
  // If we found any locations, return them
  if (results.length > 0) {
    return results;
  }
  
  // If all attempts failed, create a dummy location as fallback
  console.log('Engar staðsetningar fundust, skila sýnidæmi');
  return [{
    id: 'demo-1',
    name: 'Sýnidæmi (Berlín)',
    description: 'Þetta er sýnidæmi. Vinsamlegast bættu við raunverulegum staðsetningum í DatoCMS með því að búa til "LocationTest" færslu með "stadur" eða "berlin" reit.',
    location: {
      latitude: 52.520008,
      longitude: 13.404954
    },
    createdAt: new Date().toISOString()
  }];
}

export async function fetchTestLocationById(id: string): Promise<TestLocation | null> {
  // Extract the location type from the ID
  const locationParts = id.split('-');
  const baseId = locationParts[0];
  const locationType = locationParts.length > 1 ? locationParts[1] : 'iceland';
  
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
          berlin {
            latitude
            longitude
          }
        }
      }
    `;
    
    const testData = await request({ query: LOCATION_TEST_QUERY, variables: { id: baseId } });
    
    if (testData?.locationtest) {
      // Return berlin location
      if (locationType === 'berlin' && testData.locationtest.berlin) {
        return {
          id: `${testData.locationtest.id}-berlin`,
          name: `Berlín: ${testData.locationtest.berlin.latitude.toFixed(4)}, ${testData.locationtest.berlin.longitude.toFixed(4)}`,
          description: `Staðsetning--> DatoCMS staðsetningarmódel (berlín reitur)`,
          location: {
            latitude: testData.locationtest.berlin.latitude || 0,
            longitude: testData.locationtest.berlin.longitude || 0
          },
          createdAt: testData.locationtest._createdAt
        };
      } 
      // Return stadur location
      else if (testData.locationtest.stadur) {
        return {
          id: `${testData.locationtest.id}-iceland`,
          name: `Ísland: ${testData.locationtest.stadur.latitude.toFixed(4)}, ${testData.locationtest.stadur.longitude.toFixed(4)}`,
          description: `Staðsetning--> DatoCMS staðsetningarmódel (stadur reitur)`,
          location: {
            latitude: testData.locationtest.stadur.latitude || 0,
            longitude: testData.locationtest.stadur.longitude || 0
          },
          createdAt: testData.locationtest._createdAt
        };
      }
    }
  } catch (error) {
    console.error('Villa við að sækja staðsetningu með ID:', error);
  }
  
  console.error(`Engin staðsetning fannst með ID: ${id}`);
  return null;
}

export async function fetchAllScreenshots(): Promise<Screenshot[]> {
  const QUERY = `
    query {
      allScreenshots {
        id
        _createdAt
        myndir {
          id
          url
          alt
          title
          width
          height
          responsiveImage(imgixParams: { 
            fit: max,
            w: 800, 
            h: 600,
            auto: format,
            q: 80
          }) {
            src
            width
            height
            alt
            base64
          }
        }
      }
    }
  `;
  try {
    console.log('Fetching screenshots from DatoCMS');
    const data = await request({ query: QUERY });
    console.log(`Fetched ${data?.allScreenshots?.length || 0} screenshots`);
    return data?.allScreenshots || [];
  } catch (error) {
    console.error('Error fetching screenshots:', error);
    return [];
  }
}