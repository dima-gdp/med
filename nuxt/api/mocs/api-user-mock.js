/**
 * @module api-mocs
 */

import { Deserializer } from 'jsonapi-serializer'
const jsonApiOpts = { keyForAttribute: 'camelCase', dataLinks: {} }
const deserializer = new Deserializer(jsonApiOpts)

export const mockUserDataFixture = {
  id: 9,
  email: 'alexandr.anciferov@gmail.com',
  emailValidate: true,
  phoneValidate: true,
  external: false,
  profile: {
    userId: 9,
    positionId: 1,
    companyId: 213,
    firstName: 'Александр',
    middleName: 'Николаевич',
    lastName: 'Анциферов',
    avatar: null,
    id: '9',
  },
}

export const mockUserMenuFixture = [
  {
    type: 'panel',
    visible: true,
  },
  {
    type: 'profile',
    visible: true,
  },
  {
    type: 'subscribe',
    visible: true,
  },
  {
    type: 'certificate',
    visible: false,
  },
  {
    type: 'curator',
    visible: false,
  },
  {
    type: 'course',
    visible: false,
  },
  {
    type: 'orders',
    visible: true,
  },
  {
    type: 'logout',
    visible: true,
  },
]

export const mockPossibleMenuItemsFixture = [
  {
    type: 'panel',
    url: '/admin',
    title: 'Панель управления',
    sort: 1,
  },
  {
    type: 'profile',
    url: '/user',
    title: 'Профиль',
    sort: 2,
  },
  {
    type: 'subscribe',
    url: '/mysubscribe',
    title: 'Подписки',
    sort: 3,
  },
  {
    type: 'orders',
    url: '/orders/list',
    title: 'Мои заказы',
    sort: 7,
  },
  {
    type: 'logout',
    url: '/user/sign-in/logout',
    title: 'Выйти',
    sort: 8,
  },
]

export const mockUserAuthFixture = {
  identity: 'admin@s256.dev',
  token: 'eVLcXHtojhi3AB5tHC0wQSdAzl979qystHGTBysb',
  userId: 1,
}

export async function GET_STATS() {
  const responseData = {
    data: {
      id: 'user',
      type: 'stats',
      attributes: {
        'internal-count': 150940,
      },
    },
  }

  return {
    data: await deserializer.deserialize(responseData),
  }
}

export async function GET_USER_AND_PROFILE(userId) {
  const responseData = {
    data: {
      id: '' + userId,
      type: 'user',
      attributes: {
        id: userId,
        email: 'alexandr.anciferov@gmail.com',
        'email-validate': true,
        'phone-validate': true,
        external: false,
      },
      relationships: {
        profile: {
          data: {
            id: '' + userId,
            type: 'profile',
          },
        },
      },
    },
    included: [
      {
        id: '' + userId,
        type: 'profile',
        attributes: {
          'user-id': userId,
          'position-id': 1,
          company_id: 213,
          firstName: 'Александр',
          middleName: 'Николаевич',
          lastName: 'Анциферов',
          avatar: null,
        },
      },
    ],
  }

  return {
    data: await deserializer.deserialize(responseData),
  }
}

export async function GET_USER_MENU(userId) {
  const responseData = {
    data: {
      id: '' + userId,
      type: 'menu',
      attributes: {
        id: '' + userId,
        items: [
          {
            type: 'panel',
            visible: true,
          },
          {
            type: 'profile',
            visible: true,
          },
          {
            type: 'subscribe',
            visible: true,
          },
          {
            type: 'certificate',
            visible: true,
          },
          {
            type: 'curator',
            visible: false,
          },
          {
            type: 'course',
            visible: true,
          },
          {
            type: 'logout',
            visible: true,
          },
        ],
      },
    },
  }

  return {
    data: await deserializer.deserialize(responseData),
  }
}
