import { defineCollection, z } from 'astro:content'
import { glob, file } from 'astro/loaders'

const commentSchema = z.object({
  id: z.number(),
  from: z.string(),
  text: z.string()
})

const sculptureSchema = z.object({
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

const sculpturesNl = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/data/sculptures/nl' }),
  schema: sculptureSchema
})

const sculpturesEn = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/data/sculptures/en' }),
  schema: sculptureSchema
})

const commentsNl = defineCollection({
  loader: file('./src/data/comments/nl/index.json'),
  schema: commentSchema
})

const commentsEn = defineCollection({
  loader: file('./src/data/comments/en/index.json'),
  schema: commentSchema
})

export const collections = { sculpturesNl, sculpturesEn, commentsNl, commentsEn }
