import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { colorInput } from '@sanity/color-input'
import { schemaTypes } from './sanity/schemas'

export default defineConfig({
  name: 'default',
  title: 'Dongbaek Studio',

  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'xczp11sl',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  basePath: '/studio',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Preview Mode')
              .icon(() => '👁️')
              .action(() => {
                window.open('https://dong100.org/api/draft', '_blank');
              }),
            S.divider(),
            ...S.documentTypeListItems(),
          ]),
    }),
    visionTool(),
    colorInput(),
  ],

  schema: {
    types: schemaTypes,
  },
})
