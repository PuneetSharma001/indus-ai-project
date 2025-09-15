import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://536e08056f0a.ngrok-free.app',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  }
});

export const apiService = {
  async processQuery(query) {
    const response = await apiClient.post('/process_query', {
      natural_language_query: query,
      conversation_context: ''
    });
    return response.data;
  },

  async getSQL(queryId) {
    const response = await apiClient.get(`/get_sql/${queryId}`);
    return response.data;
  },

  async getTables(queryId) {
    const response = await apiClient.get(`/get_tables/${queryId}`);
    return response.data;
  },

  async getDescription(queryId) {
    const response = await apiClient.get(`/get_description/${queryId}`);
    return response.data;
  },

  async getGraph(queryId) {
    const response = await apiClient.get(`/get_graph/${queryId}`);
    return response.data;
  }
};
