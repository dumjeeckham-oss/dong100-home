import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { table } from '@sanity/table'
import { colorInput } from '@sanity/color-input'
import { schemaTypes } from './sanity/schemas'

export default defineConfig({
  name: 'default',
  title: 'Dongbaek Studio',

  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'xczp11sl',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  basePath: '/studio',

  plugins: [structureTool(), visionTool(), colorInput()],

  schema: {
    types: schemaTypes,
  },
})
