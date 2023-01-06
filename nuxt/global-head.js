import { getCDNHost } from './build-vars'
const ENV = process.env.ENV

export default {
  title: 'Med.Studio - портал медицинского онлайн образования',
  meta: [
    { charset: 'utf-8' },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
    },
    { name: 'developer', content: 'Разработано в СТУДИЯ 256 - https://studio256.ru' },
    {
      name: 'description',
      content:
        'Полезные курсы, открытые лекции, тематические проекты для врачей от ведущих экспертов',
    },
    { name: 'msapplication-TileColor', content: '#40b526' },
    { name: 'theme-color', content: '#40b526' },
    { name: 'msapplication-navbutton-color', content: '#40b526' },
    { name: 'apple-mobile-web-app-status-bar-style', content: '#40b526' },
    { name: 'apple-mobile-web-app-status-bar-style', content: '#40b526' },
    {
      hid: 'og:title',
      property: 'og:title',
      content: 'Med.Studio - портал медицинского онлайн образования',
    },
    {
      hid: 'og:description',
      property: 'og:description',
      content:
        'Полезные курсы, открытые лекции, тематические проекты для врачей от ведущих экспертов',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'MED.STUDIO' },
    { hid: 'og:url', property: 'og:url', content: 'https://med.studio' },
    { property: 'og:image:type', content: 'image/jpg' },
    { property: 'og:image:width', content: '968' },
    { property: 'og:image:height', content: '504' },
    { property: 'twitter:card', content: 'summary_large_image' },
    { name: 'yandex-verification', content: 'c9f5786e3dd7e73c' },
    {
      hid: 'og:image',
      property: 'og:image',
      content: getCDNHost(ENV) + '/static/jpg/logo.jpg',
    },
    {
      hid: 'twitter:image',
      property: 'twitter:image',
      content: getCDNHost(ENV) + '/static/jpg/logo.jpg',
    },
  ],
  link: [{ rel: 'apple-touch-icon', href: '/static/favicon/apple-touch-icon-180x180.png' }],
}
