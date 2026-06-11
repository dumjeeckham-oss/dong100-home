import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { colorInput } from '@sanity/color-input'
import { presentationTool } from '@sanity/presentation'
import { schemaTypes } from './sanity/schemas'

export default defineConfig({
  name: 'default',
  title: 'Dongbaek Studio',

  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'xczp11sl',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  basePath: '/studio',

  plugins: [
    structureTool(),
    visionTool(),
    colorInput(),
    presentationTool({
      previewUrl: {
        origin: typeof location !== 'undefined' ? location.origin : 'http://localhost:5173',
        previewMode: {
          enable: '/api/draft',
        },
      },
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
