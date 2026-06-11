import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: '사이트 설정',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '홈페이지 제목',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: '홈페이지 설명',
      type: 'text',
    }),
    defineField({
      name: 'heroTitle',
      title: '메인 배너 제목',
      type: 'string',
    }),
    defineField({
      name: 'heroSubtitle',
      title: '메인 배너 부제목',
      type: 'string',
    }),
    defineField({
      name: 'heroDescription',
      title: '메인 배너 설명',
      type: 'text',
    }),
    defineField({
      name: 'kakaoBannerTitle',
      title: '카카오 배너 제목',
      type: 'string',
    }),
    defineField({
      name: 'kakaoBannerDescription',
      title: '카카오 배너 설명',
      type: 'string',
    }),
    defineField({
      name: 'coopBannerTitle',
      title: '조합원 배너 제목',
      type: 'string',
    }),
    defineField({
      name: 'coopBannerDescription',
      title: '조합원 배너 설명',
      type: 'string',
    }),
  ],
})
