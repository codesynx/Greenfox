// Debug utility to test API endpoints directly
import axios from 'axios';

const BASE_URL = 'https://octopus-app-6egtt.ondigitalocean.app/api/v1';

export const testResortsEndpoint = async () => {
  try {
    console.log('Testing resorts endpoint without auth...');

    // Test 1: No parameters
    const response1 = await axios.get(`${BASE_URL}/resorts`, {
      params: { page: 0, size: 20 },
    });
    console.log('✅ Test 1 (no params) - Success:', response1.data);

    // Test 2: With city filter
    const response2 = await axios.get(`${BASE_URL}/resorts`, {
      params: { page: 0, size: 20, city: 'Almaty' },
    });
    console.log('✅ Test 2 (with city) - Success:', response2.data);

    return { success: true };
  } catch (error: any) {
    console.error('❌ API Test Failed:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        params: error.config?.params,
      },
    });
    return { success: false, error };
  }
};

export const testPromos = async () => {
  try {
    console.log('Testing promos endpoint...');
    const response = await axios.get(`${BASE_URL}/promos`);
    console.log('✅ Promos - Success:', response.data);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('❌ Promos Test Failed:', error.response?.data);
    return { success: false, error };
  }
};

export const testCities = async () => {
  try {
    console.log('Testing cities endpoint...');
    const response = await axios.get(`${BASE_URL}/resorts/cities`);
    console.log('✅ Cities - Success:', response.data);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('❌ Cities Test Failed:', error.response?.data);
    return { success: false, error };
  }
};
