import { defineConfig, createClient, createMockAuthStore } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { colorInput } from '@sanity/color-input'
import { schemaTypes } from './sanity/schemas'

// TEMP-LOCAL-INSPECT: mock sign-in so the sandbox browser can open the editor UI. Remove after check.
const mockClient = createClient({
  projectId: 'xczp11sl',
  dataset: 'production',
  apiVersion: '2024-10-01',
  useCdn: false,
})
const mockAuth = createMockAuthStore({
  client: mockClient,
  currentUser: {
    id: 'mock-user',
    name: 'Local Inspect',
    email: 'local@inspect',
    role: 'administrator',
    provider: 'mock',
  },
})

export default defineConfig({
  name: 'default',
  title: 'Dongbaek Studio',

  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'xczp11sl',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  basePath: '/studio',

  auth: mockAuth,

  plugins: [
    structureTool(),
    visionTool(),
    colorInput(),
  ],

  schema: {
    types: schemaTypes,
  },
})
