import {
  kebabToCamel,
  snakeToCamel,
  camelToKebab,
  camelize,
  parseCookie,
  isComplexType,
  roundElementWidth,
  decOfNum,
  throttle,
} from '~/utils'

const mockThrottleCb = jest.fn((x) => 42 + x)

describe('/utils', () => {
  jest.useFakeTimers()

  afterEach(() => {
    mockThrottleCb.mockClear()
  })

  it('kebabToCamel переводит строку из стиля написания kebab-case в сamelCase', () => {
    expect(kebabToCamel('kebab-to-camel')).toBe('kebabToCamel')
  })

  it('snakeToCamel переводит строку из стиля написания snake_case в сamelCase', () => {
    expect(snakeToCamel('snake_to_camel')).toBe('snakeToCamel')
  })

  it('camelToKebab переводит строку из стиля написания сamelCase в kebab-case', () => {
    expect(camelToKebab('camelToKebab')).toBe('camel-to-kebab')
  })

  it('camelize переводит ключи объекта из стиля написания kebab-case/snake_case в сamelСase', () => {
    const objSnake = {
      fee_fie_foe: 'fum',
      beep_boop: [{ abc_xyz: 'mno' }, { 'foo-bar': 'baz' }],
    }
    const objSnakeResult = {
      feeFieFoe: 'fum',
      beepBoop: [{ abcXyz: 'mno' }, { fooBar: 'baz' }],
    }
    expect(camelize(objSnake)).toEqual(objSnakeResult)

    // Проверка перевода ключей объекта из kebab case case в сamel case
    const objKebab = {
      'fee-fie-foe': 'fum',
      'beep-boop': [{ 'abc-xyz': 'mno' }, { 'foo-bar': 'baz' }],
    }
    const objKebabResult = {
      feeFieFoe: 'fum',
      beepBoop: [{ abcXyz: 'mno' }, { fooBar: 'baz' }],
    }
    expect(camelize(objKebab)).toEqual(objKebabResult)
  })

  it('parseCookie преобразует строку(cookie) в объект ключ/значение', () => {
    const cookie =
      'create-tg-visit=true; _ga=GA1.2.126532696.1498716380; tg-visit=36d6de91c84fefeb40db7955cbdaaa415e2476c9; token=DulTLMYJLjuuC.wRnyD0QKIGGbkCtRaBJJQupQcz9QlWhWctqQ.XQvhD-EShV6F8jyO9ewWUJg3YRCIBcef10psMxmLKBGwje9SFfT8wY9cdSzFFV9oIfrP.ntYk8mvYS9sURvJRFXycmqL3tfCfEwBjvfkVbHCMiMc-c37LIvLNa9bL; platform=Desktop; referrer="https://foo.bar.com/"; beaker.session.id=9cc01370a32cdafda7dcdd096c6809b3fd5a6d6b405e7afaf8194717855e6246f68f545e'
    const cookieResult = {
      'create-tg-visit': 'true',
      _ga: 'GA1.2.126532696.1498716380',
      'tg-visit': '36d6de91c84fefeb40db7955cbdaaa415e2476c9',
      token:
        'DulTLMYJLjuuC.wRnyD0QKIGGbkCtRaBJJQupQcz9QlWhWctqQ.XQvhD-EShV6F8jyO9ewWUJg3YRCIBcef10psMxmLKBGwje9SFfT8wY9cdSzFFV9oIfrP.ntYk8mvYS9sURvJRFXycmqL3tfCfEwBjvfkVbHCMiMc-c37LIvLNa9bL',
      platform: 'Desktop',
      referrer: 'https://foo.bar.com/',
      'beaker.session.id':
        '9cc01370a32cdafda7dcdd096c6809b3fd5a6d6b405e7afaf8194717855e6246f68f545e',
    }
    expect(parseCookie(cookie)).toEqual(cookieResult)
  })

  it('isComplexType вернет значение (true/false) является ли аргумент массивом или объектом', () => {
    const string = 'string'
    const arr = ['[object Object]', '[object Array]']
    const object = {
      value: '[object Object]',
    }
    expect(isComplexType(string)).toBe(false)
    expect(isComplexType(arr)).toBe(true)
    expect(isComplexType(object)).toBe(true)
  })

  it('roundElementWidth округляет ширину данного элемента в большую сторону', () => {
    const ELEMENT = document.createElement('div')
    ELEMENT.style.width = '121.34px'

    roundElementWidth(ELEMENT)

    const finalStyles = window.getComputedStyle(ELEMENT)

    expect(finalStyles).toEqual(
      expect.objectContaining({
        width: '122px',
      }),
    )
  })

  it('decOfNum склоняет слово по грамматическим категориям числа', () => {
    expect(decOfNum(1, ['врач', 'врача', 'врачей'])).toBe('врач')
    expect(decOfNum(2, ['врач', 'врача', 'врачей'])).toBe('врача')
    expect(decOfNum(5, ['врач', 'врача', 'врачей'])).toBe('врачей')
  })

  it('throttle при первом вызове, вызывает функцию', () => {
    const throttleFunc = throttle(mockThrottleCb, 5000)
    throttleFunc(1)
    expect(mockThrottleCb).toHaveBeenCalled()
  })

  it('throttle, если был уже вызван колбек, то в течении заданной задержки(5 сек.), не вызывает колбек', () => {
    const throttleFunc = throttle(mockThrottleCb, 5000)
    jest.runAllTimers()
    throttleFunc(1)
    throttleFunc(1)
    jest.advanceTimersByTime(3000)
    throttleFunc(1)
    expect(mockThrottleCb).toHaveBeenCalledTimes(1)
  })

  it('throttle, когда вызвали колбек, и прошла заданная задержка, то колбек можно вызвать еще раз', () => {
    const throttleFunc = throttle(mockThrottleCb, 5000)
    jest.runAllTimers()
    throttleFunc(1)
    jest.runAllTimers()
    throttleFunc(1)
    expect(mockThrottleCb).toHaveBeenCalledTimes(2)
  })

  it('throttle передает в функцию-колбек аргументы', () => {
    const throttleFunc = throttle(mockThrottleCb, 5000)
    jest.runAllTimers()
    throttleFunc(1)
    expect(mockThrottleCb).toHaveBeenCalledWith(1)
  })
})
