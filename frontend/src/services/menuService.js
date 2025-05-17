import axios from 'axios';

// Support both backends - Express at /menu and Spring Boot at /menu
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const getMenuItems = async () => {
  try {
    console.log('Fetching menu from:', `${API_URL}/menu`);
    
    // Create a request with timeout
    const response = await axios.get(`${API_URL}/menu`, {
      withCredentials: true,
      timeout: 10000, // 10 second timeout
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    // If we get here, we have a response
    if (!response.data) {
      console.error('No data in response');
      return [];
    }
    
    return response.data;
  } catch (error) {
    // Log detailed error information
    console.error('Error fetching menu items:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
    
    // Try fallback first
    try {
      console.log('Trying fallback endpoint...');
      const fallbackResponse = await axios.get(`${API_URL}/fallback/menu`, {
        withCredentials: true,
        timeout: 5000
      });
      
      if (fallbackResponse.data && fallbackResponse.data.length > 0) {
        console.log('Successfully retrieved data from fallback endpoint');
        return fallbackResponse.data;
      }
    } catch (fallbackError) {
      console.error('Fallback endpoint also failed:', fallbackError);
    }
    
    // Finally, try hardcoded data as a last resort
    console.log('Using hardcoded menu data as last resort');
    return getHardcodedMenuItems();
  }
};

// Hardcoded menu items as a last resort
function getHardcodedMenuItems() {
  return [
    {
      id: 101,
      name: 'Garlic Bread',
      description: 'Toasted bread with garlic butter and herbs',
      price: 4.99,
      category: 'Appetizers',
      imageUrl: 'https://www.allrecipes.com/thmb/GrV_mWqrxIh9ysH8PELYfGXeSFg=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/4526061-24b9144c4f734b5c9433248c952ba5e6.jpg',
      available: true
    },
    {
      id: 201,
      name: 'Margherita Pizza',
      description: 'Classic pizza with tomato sauce, mozzarella, and basil',
      price: 12.99,
      category: 'Main Courses',
      imageUrl: 'https://www.allrecipes.com/thmb/tMhYAjIOyyHYgLJRkMYOPXN5cfs=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Pizza-Margherita-2000-ff105840fdbe4d818177bfcb3e840053.jpg',
      available: true
    },
    {
      id: 301,
      name: 'Chocolate Cake',
      description: 'Rich chocolate cake with ganache',
      price: 5.99,
      category: 'Desserts',
      imageUrl: 'https://www.allrecipes.com/thmb/beqM4NrWGNGbzM3U1D4OMi-m2D8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/8379761-triple-layer-chocolate-cake-with-chocolate-frostin-DDMFS-4x3-2000-d4344a929db44c69886dd50ec3ecb552.jpg',
      available: true
    },
    {
      id: 401,
      name: 'Coffee',
      description: 'Regular or decaf',
      price: 2.29,
      category: 'Beverages',
      imageUrl: 'https://www.allrecipes.com/thmb/Oag1_0cRg-_wmmHH0JygYFrwTLI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1225598339-2000-1c95377ac156498eb1e74a503a9dbbb2.jpg',
      available: true
    }
  ];
} 