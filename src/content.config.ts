import { defineCollection, z } from 'astro:content'
import { glob, file } from 'astro/loaders'

const sculptures = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/data/sculptures' }),
  schema: z.object({
    title: z.string(),
    impressivenessScore: z.number(),
    description: z.string(),
    context: z.string(),
    previewImageUrl: z.string(),
    images: z.object({
      url: z.string(),
      alt: z.string()
    }).array(),
  })
})

const comments = defineCollection({
  loader: file('./src/data/comments/index.json'),
  schema: z.object({
    id: z.number(),
    from: z.string(),
    text: z.string()
  })
})

export const collections = { sculptures, comments }
