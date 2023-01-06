export const mockTokenIdSuccessFixture = {
  id: '237457',
  userId: null,
  type: 'password_reset',
  sendMethod: 'call',
  sendTo: '79115746172',
  isUsed: false,
  usedAt: null,
  expireAt: 1626345855,
  createdAt: 1626259455,
  updatedAt: 1626259455,
}

export const mockTokenIdFailFixture = {
  errors: [
    {
      source: {
        pointer: '/data/attributes/sendTo',
      },
      detail: 'Введите номер в формате 79990001111',
      status: '422',
    },
  ],
}

export const mockValidateSuccessFixture = {
  id: '237457',
  validate: true,
}

export const mockValidateFailFixture = {
  id: '237457',
  validate: false,
}

export const mockPasswordResetSuccessFixture = {
  id: '49',
  userId: 49,
}

export const mockPasswordResetFailFixture = {
  errors: [
    {
      code: '0',
      status: '500',
      title: 'Internal Server Error',
      detail: 'Возникла внутренняя ошибка сервера.',
    },
  ],
}
