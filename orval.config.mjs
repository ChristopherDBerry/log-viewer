import { config } from 'dotenv';
config();

const API_URL = process.env.VITE_API_URL;
const SWAGGER_URL = `${API_URL}/swagger.json`;

export default {
  api: {
    input: SWAGGER_URL, // URL to the Swagger API
    output: {
      target: './src/api/generated', // Ensure a directory-based generation
      client: 'react-query', // Generates API hooks with React Query
      mode: 'tags-split', // Splits each endpoint into its own file
      override: {
        mutator: {
          path: './src/api/mutator.ts', // Custom Axios fetch function
          name: 'customFetcher',
        },
      },
    },
  },
};
