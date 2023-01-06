import useGlobalAlert from '@/domain/composables/useGlobalAlert'

describe('domain/composables/useGlobalAlert', () => {
  let globalAlert
  let state

  const TEST_ALERT = {
    message: 'test',
    type: 'warning',
    time: 2000,
  }

  beforeEach(() => {
    jest.useFakeTimers()
    globalAlert = useGlobalAlert()
    state = globalAlert.getAlertState()
  })

  describe('createAlert выбрасывает TypeError в случае неверных типов входных аргументов', () => {
    it('message должен быть string | number', () => {
      // два теста в одном, потому что они проверяют одно и то же

      expect(() => globalAlert.createAlert([], TEST_ALERT.type, TEST_ALERT.time)).toThrow(TypeError)

      expect(() => globalAlert.createAlert({}, TEST_ALERT.type, TEST_ALERT.time)).toThrow(TypeError)
    })

    it("type должен быть 'error' | 'warning' | 'success' | 'info'", () => {
      expect(() =>
        globalAlert.createAlert(TEST_ALERT.message, 'wrong type', TEST_ALERT.time),
      ).toThrow(TypeError)

      expect(() =>
        globalAlert.createAlert(TEST_ALERT.message, { type: 'wrong type' }, TEST_ALERT.time),
      ).toThrow(TypeError)
    })

    it('time должен быть number | null', () => {
      expect(() => globalAlert.createAlert(TEST_ALERT.message, TEST_ALERT.type, '1233')).toThrow(
        TypeError,
      )

      expect(() =>
        globalAlert.createAlert(TEST_ALERT.message, TEST_ALERT.type, { time: 1233 }),
      ).toThrow(TypeError)
    })
  })

  it('после вызова createAlert новый объект добавляется в состояние алерта', () => {
    globalAlert.createAlert(TEST_ALERT.message, TEST_ALERT.type, TEST_ALERT.time)

    expect(state).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ...TEST_ALERT,
        }),
      ]),
    )
  })

  it('функция createAlert возвращает новый созданный алерт', () => {
    const alert = globalAlert.createAlert(TEST_ALERT.message, TEST_ALERT.type, TEST_ALERT.time)

    expect(alert).toEqual(
      expect.objectContaining({
        ...TEST_ALERT,
      }),
    )
  })

  it('у создаваемого алерта генерятся поля id, isShown === true, timer', () => {
    const alert = globalAlert.createAlert(TEST_ALERT.message, TEST_ALERT.type, TEST_ALERT.time)

    expect(alert).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        isShown: true,
        timer: expect.any(Number),
      }),
    )
  })

  it('если при создании алерта указан time, вызывать setTimeout c этим временем', () => {
    globalAlert.createAlert(TEST_ALERT.message, TEST_ALERT.type, TEST_ALERT.time)

    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), TEST_ALERT.time)
  })

  it('если при создании алерта указан time === null, не вызывать setTimeout', () => {
    globalAlert.createAlert(TEST_ALERT.message, TEST_ALERT.type, null)

    expect(setTimeout).not.toHaveBeenCalled()
  })

  it('при создании алерта с таймером, таймер должен удаляет данный алерт из state после завершения', () => {
    const alert = globalAlert.createAlert(TEST_ALERT.message, TEST_ALERT.type, TEST_ALERT.time)

    jest.advanceTimersByTime(TEST_ALERT.time)

    expect(state).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: alert.id,
        }),
      ]),
    )
  })

  it('функция hideAlert удаляет данный алерт из state', () => {
    const alert = globalAlert.createAlert(TEST_ALERT.message, TEST_ALERT.type, TEST_ALERT.time)

    globalAlert.hideAlert(alert.id)

    expect(state).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: alert.id,
        }),
      ]),
    )
  })

  it('функция hideAlert очищает связанный setTimeout', () => {
    const alert = globalAlert.createAlert(TEST_ALERT.message, TEST_ALERT.type, TEST_ALERT.time)

    globalAlert.hideAlert(alert.id)

    expect(clearTimeout).toHaveBeenCalledWith(alert.timer)
  })
})
