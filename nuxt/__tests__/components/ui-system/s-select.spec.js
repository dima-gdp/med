import { shallowMount } from '@vue/test-utils'
import Multiselect from 'vue-multiselect'
import { nextTick } from 'vue'
import SSelect from '~/components/ui-system/s-select'
import Tag from '~/components/ui-system/s-select/tag.vue'

describe('~/components/ui-system/s-select', () => {
  jest.useFakeTimers()
  let wrapper
  const PLACEHOLDER_TEXT = 'Введите название'
  const TOGGLE_BTN_TEXT = 'chevron-down'
  const EMPTY_LIST_TEXT = 'Список пуст'
  const NO_MATCHES_TEXT = 'Совпадений не найдено'
  const ClientOnlyStub = {
    template: '<div><slot></slot></div>',
  }
  const EvaIconStub = {
    template: `<span @click="$emit('click')">${TOGGLE_BTN_TEXT}</span>`,
  }

  const findElementByText = (selector, text) =>
    wrapper.findAll(selector).wrappers.find((w) => w.text() === text)

  const createComponent = (props) => {
    wrapper = shallowMount(SSelect, {
      propsData: props,
      stubs: {
        ClientOnly: ClientOnlyStub,
        Multiselect,
        Tag,
        EvaIcon: EvaIconStub,
      },
    })
  }

  afterEach(() => {
    wrapper.destroy()
  })

  it('Показывает placeholder, если изначально не передано значение(value)', () => {
    createComponent({
      placeholder: PLACEHOLDER_TEXT,
      label: 'title',
      trackBy: 'title',
    })
    expect(findElementByText('span', PLACEHOLDER_TEXT).isVisible()).toBe(true)
  })

  it('Показывает значение(value), если оно изначально передано', () => {
    createComponent({
      placeholder: PLACEHOLDER_TEXT,
      label: 'title',
      trackBy: 'title',
      initialValue: { title: 'Space Pirate', desc: 'More space battles!' },
    })
    expect(findElementByText('span', 'Space Pirate').isVisible()).toBe(true)
  })

  it('По клику на селект раскрывает список опций', async () => {
    createComponent({
      placeholder: PLACEHOLDER_TEXT,
      label: 'title',
      trackBy: 'title',
      initialOptions: [
        { title: 'Space Pirate', desc: 'More space battles!' },
        { title: 'Merchant', desc: 'PROFIT!' },
        { title: 'EXPLORER', desc: 'Discovering new species!' },
        { title: 'Miner1', desc: 'We need to go deeper!' },
        { title: 'Miner2', desc: 'We need to go deeper!' },
      ],
    })

    await findElementByText('span', PLACEHOLDER_TEXT).trigger('mousedown')
    expect(findElementByText('span', 'Space Pirate').isVisible()).toBe(true)
    expect(findElementByText('span', 'Merchant').isVisible()).toBe(true)
  })

  it('По клику на селект закрывает список опций, когда селект был открыт', async () => {
    createComponent({
      placeholder: PLACEHOLDER_TEXT,
      label: 'title',
      trackBy: 'title',
      initialOptions: [
        { title: 'Space Pirate', desc: 'More space battles!' },
        { title: 'Merchant', desc: 'PROFIT!' },
        { title: 'EXPLORER', desc: 'Discovering new species!' },
        { title: 'Miner1', desc: 'We need to go deeper!' },
        { title: 'Miner2', desc: 'We need to go deeper!' },
      ],
    })

    await findElementByText('span', PLACEHOLDER_TEXT).trigger('mousedown')
    await findElementByText('span', PLACEHOLDER_TEXT).trigger('mousedown')
    expect(findElementByText('span', 'Space Pirate').isVisible()).toBe(false)
    expect(findElementByText('span', 'Merchant').isVisible()).toBe(false)
  })

  it('По клику на стрелочку раскрывает список', async () => {
    createComponent({
      placeholder: PLACEHOLDER_TEXT,
      label: 'title',
      trackBy: 'title',
      initialOptions: [
        { title: 'Space Pirate', desc: 'More space battles!' },
        { title: 'Merchant', desc: 'PROFIT!' },
        { title: 'EXPLORER', desc: 'Discovering new species!' },
        { title: 'Miner1', desc: 'We need to go deeper!' },
        { title: 'Miner2', desc: 'We need to go deeper!' },
      ],
    })
    await findElementByText('span', TOGGLE_BTN_TEXT).trigger('mousedown')
    expect(findElementByText('span', 'Space Pirate').isVisible()).toBe(true)
    expect(findElementByText('span', 'Merchant').isVisible()).toBe(true)
  })

  it('По клику на стрелочку закрывает список, если он был открыт', async () => {
    createComponent({
      placeholder: PLACEHOLDER_TEXT,
      label: 'title',
      trackBy: 'title',
      initialOptions: [
        { title: 'Space Pirate', desc: 'More space battles!' },
        { title: 'Merchant', desc: 'PROFIT!' },
        { title: 'EXPLORER', desc: 'Discovering new species!' },
        { title: 'Miner1', desc: 'We need to go deeper!' },
        { title: 'Miner2', desc: 'We need to go deeper!' },
      ],
    })
    await findElementByText('span', TOGGLE_BTN_TEXT).trigger('mousedown')
    await findElementByText('span', TOGGLE_BTN_TEXT).trigger('mousedown')
    expect(findElementByText('span', 'Space Pirate').isVisible()).toBe(false)
    expect(findElementByText('span', 'Merchant').isVisible()).toBe(false)
  })

  it('По клику на опцию, передает value наверх', async () => {
    createComponent({
      placeholder: PLACEHOLDER_TEXT,
      label: 'title',
      trackBy: 'title',
      initialOptions: [
        { title: 'Space Pirate', desc: 'More space battles!' },
        { title: 'Merchant', desc: 'PROFIT!' },
        { title: 'EXPLORER', desc: 'Discovering new species!' },
        { title: 'Miner1', desc: 'We need to go deeper!' },
        { title: 'Miner2', desc: 'We need to go deeper!' },
      ],
    })
    await findElementByText('span', TOGGLE_BTN_TEXT).trigger('mousedown')
    await findElementByText('span', 'Space Pirate').trigger('click')
    expect(wrapper.emitted('change-select')[0]).toEqual([
      { title: 'Space Pirate', desc: 'More space battles!' },
    ])
  })

  it('По клику на выбранную опцию, убирает ее из value', async () => {
    createComponent({
      placeholder: PLACEHOLDER_TEXT,
      label: 'title',
      trackBy: 'title',
      initialOptions: [
        { title: 'Space Pirate', desc: 'More space battles!' },
        { title: 'Merchant', desc: 'PROFIT!' },
        { title: 'EXPLORER', desc: 'Discovering new species!' },
        { title: 'Miner1', desc: 'We need to go deeper!' },
        { title: 'Miner2', desc: 'We need to go deeper!' },
      ],
    })
    await findElementByText('span', TOGGLE_BTN_TEXT).trigger('mousedown')
    await findElementByText('span', 'Space Pirate').trigger('click')
    await findElementByText('span', TOGGLE_BTN_TEXT).trigger('mousedown')
    await findElementByText('span', 'Space Pirate').trigger('click')
    expect(wrapper.emitted('change-select')[0]).not.toContain([
      { title: 'Space Pirate', desc: 'More space battles!' },
    ])
  })

  it('При поиске (вводе в инпут) отображает найденные опции', async () => {
    createComponent({
      placeholder: PLACEHOLDER_TEXT,
      label: 'title',
      trackBy: 'title',
      searchable: true,
      initialOptions: [
        { title: 'Space Pirate', desc: 'More space battles!' },
        { title: 'Merchant', desc: 'PROFIT!' },
        { title: 'EXPLORER', desc: 'Discovering new species!' },
        { title: 'Miner1', desc: 'We need to go deeper!' },
        { title: 'Miner2', desc: 'We need to go deeper!' },
      ],
    })

    const input = wrapper
      .findAll('input')
      .wrappers.find((i) => i.attributes().placeholder === PLACEHOLDER_TEXT)
    await findElementByText('span', PLACEHOLDER_TEXT).trigger('mousedown')
    input.element.value = 'sp'
    await input.trigger('input')
    expect(
      wrapper
        .find('ul')
        .findAll('li')
        .wrappers.filter((li) => li.text() !== EMPTY_LIST_TEXT && li.text() !== NO_MATCHES_TEXT)
        .length,
    ).toBe(1)
  })

  it('При поиске (вводе в инпут) выделяет цветом совпадающий текст', async () => {
    createComponent({
      placeholder: PLACEHOLDER_TEXT,
      label: 'title',
      trackBy: 'title',
      searchable: true,
      initialOptions: [
        { title: 'Space Pirate', desc: 'More space battles!' },
        { title: 'Merchant', desc: 'PROFIT!' },
        { title: 'EXPLORER', desc: 'Discovering new species!' },
        { title: 'Miner1', desc: 'We need to go deeper!' },
        { title: 'Miner2', desc: 'We need to go deeper!' },
      ],
    })

    const input = wrapper
      .findAll('input')
      .wrappers.find((i) => i.attributes().placeholder === PLACEHOLDER_TEXT)
    await findElementByText('span', PLACEHOLDER_TEXT).trigger('mousedown')
    input.element.value = 'sp'
    await input.trigger('input')
    expect(findElementByText('div', 'Space Pirate').html()).toContain(
      '<span>Sp</span>ace Pirate</span>',
    )
  })

  it('Показывает сообщение "совпадений не найдено", если при поиске совпадений не найдено', async () => {
    createComponent({
      placeholder: PLACEHOLDER_TEXT,
      label: 'title',
      trackBy: 'title',
      searchable: true,
      initialOptions: [
        { title: 'Space Pirate', desc: 'More space battles!' },
        { title: 'Merchant', desc: 'PROFIT!' },
        { title: 'EXPLORER', desc: 'Discovering new species!' },
        { title: 'Miner1', desc: 'We need to go deeper!' },
        { title: 'Miner2', desc: 'We need to go deeper!' },
      ],
    })

    const input = wrapper
      .findAll('input')
      .wrappers.find((i) => i.attributes().placeholder === PLACEHOLDER_TEXT)
    await findElementByText('span', PLACEHOLDER_TEXT).trigger('mousedown')
    input.element.value = 'spm'
    await input.trigger('input')
    expect(
      wrapper
        .find('ul')
        .findAll('li')
        .wrappers.filter((li) => li.text() !== EMPTY_LIST_TEXT).length,
    ).toBe(1)
    expect(
      wrapper
        .find('ul')
        .findAll('li')
        .wrappers.find((li) => li.text() === NO_MATCHES_TEXT)
        .isVisible(),
    ).toBe(true)
  })

  it('По клику на опцию выбирает несколько значений, если это мультиселект', async () => {
    createComponent({
      placeholder: PLACEHOLDER_TEXT,
      label: 'title',
      trackBy: 'title',
      searchable: true,
      multiple: true,
      initialOptions: [
        { title: 'Space Pirate', desc: 'More space battles!' },
        { title: 'Merchant', desc: 'PROFIT!' },
        { title: 'EXPLORER', desc: 'Discovering new species!' },
        { title: 'Miner1', desc: 'We need to go deeper!' },
        { title: 'Miner2', desc: 'We need to go deeper!' },
      ],
    })

    await findElementByText('span', TOGGLE_BTN_TEXT).trigger('mousedown')
    await findElementByText('span', 'Space Pirate').trigger('click')
    await findElementByText('span', TOGGLE_BTN_TEXT).trigger('mousedown')
    await findElementByText('span', 'Merchant').trigger('click')
    expect(wrapper.emitted('change-select')).toEqual([
      [[{ title: 'Space Pirate', desc: 'More space battles!' }]],
      [[{ title: 'Merchant', desc: 'PROFIT!' }]],
    ])
  })

  it('Отображает несколько значений, если это мультиселект', () => {
    const initialValue = [
      { title: 'Space Pirate', desc: 'More space battles!' },
      { title: 'Merchant', desc: 'PROFIT!' },
    ]
    createComponent({
      placeholder: PLACEHOLDER_TEXT,
      label: 'title',
      trackBy: 'title',
      searchable: true,
      multiple: true,
      initialOptions: [
        { title: 'Space Pirate', desc: 'More space battles!' },
        { title: 'Merchant', desc: 'PROFIT!' },
        { title: 'EXPLORER', desc: 'Discovering new species!' },
        { title: 'Miner1', desc: 'We need to go deeper!' },
        { title: 'Miner2', desc: 'We need to go deeper!' },
      ],
      initialValue,
    })

    const tags = wrapper.findAllComponents(Tag).wrappers

    expect(tags.length).toBe(initialValue.length)
  })

  it('По клику в выбранной опции на крестик, удаляет данное значение', async () => {
    const initialValue = [
      { title: 'Space Pirate', desc: 'More space battles!' },
      { title: 'Merchant', desc: 'PROFIT!' },
    ]

    createComponent({
      placeholder: PLACEHOLDER_TEXT,
      label: 'title',
      trackBy: 'title',
      searchable: true,
      multiple: true,
      initialOptions: [
        { title: 'Space Pirate', desc: 'More space battles!' },
        { title: 'Merchant', desc: 'PROFIT!' },
        { title: 'EXPLORER', desc: 'Discovering new species!' },
        { title: 'Miner1', desc: 'We need to go deeper!' },
        { title: 'Miner2', desc: 'We need to go deeper!' },
      ],
      initialValue,
    })
    const tagForRemove = wrapper
      .findAllComponents(Tag)
      .wrappers.find((tag) => tag.props('label') === initialValue[1].title)
    const closeBtn = tagForRemove.findComponent(EvaIconStub)
    await closeBtn.trigger('click')

    expect(wrapper.emitted('change-select')).toEqual([[[initialValue[0]]]])
  })

  it('Если селект асинхронный, при поиске выдает опции', async () => {
    const mockAsyncFunction = jest.fn((query) => {
      return new Promise((resolve) => {
        const optionsObject = [
          { title: 'ASYNCSpace Pirate', desc: 'More space battles!' },
          { title: 'ASYNCMerchant', desc: 'PROFIT!' },
          { title: 'ASYNCExplorer77', desc: 'Discovering new species!' },
          { title: 'ASYNCMiner7', desc: 'We need to go deeper!' },
        ]
        setTimeout(() => {
          const filteredOptions = optionsObject.filter((el) =>
            el.title.toLowerCase().includes(query.toLowerCase()),
          )
          resolve(filteredOptions)
        }, 200)
      })
    })
    createComponent({
      placeholder: PLACEHOLDER_TEXT,
      label: 'title',
      trackBy: 'title',
      searchable: true,
      asyncFunction: mockAsyncFunction,
    })

    const input = wrapper
      .findAll('input')
      .wrappers.find((i) => i.attributes().placeholder === PLACEHOLDER_TEXT)
    await findElementByText('span', PLACEHOLDER_TEXT).trigger('mousedown')
    input.element.value = 'sp'
    await input.trigger('input')
    jest.runAllTimers()
    await nextTick()
    expect(mockAsyncFunction).toHaveBeenCalled()
  })

  // TODO: тест на чекбокс
})
