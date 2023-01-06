import { toRef, reactive, Ref, unref } from '@nuxtjs/composition-api'
import { Instance, Options, createPopper, Modifier } from '@popperjs/core'
import { ModifierArguments } from '@popperjs/core/lib/types'

export type DropdownProps = {
  targetElement: Ref<HTMLElement> | HTMLElement
  popperElement: Ref<HTMLElement> | HTMLElement
  popperOptions: Options
}

export type DropdownState = {
  popperInstance: null | Instance
  isShown: boolean
}

export interface Dropdown {
  show(): void
  hide(): void
  toggleVisibility(): void
  isShown: Ref<boolean>
}

export function offsetModifier(offset: [number, number]): Partial<Modifier<any, any>> {
  return {
    name: 'offset',
    enabled: true,
    options: {
      offset,
    },
  }
}

export function widthAsReferenceModifier(): Partial<Modifier<any, any>> {
  return {
    name: 'setWidthAsReference',
    enabled: true,
    phase: 'beforeWrite',
    requires: ['computeStyles'],
    fn: ({ state }: ModifierArguments<Options>) => {
      state.styles.popper.width = `${state.rects.reference.width}px`
    },
  }
}

export default function useDropdown(initialProps: DropdownProps): Dropdown {
  const state = reactive({
    popperInstance: null,
    isShown: false,
  } as DropdownState)

  function createInstance() {
    if (state.popperInstance) {
      throw new Error('Дублирование компонента')
    }

    state.popperInstance = createPopper(
      unref(initialProps.targetElement),
      unref(initialProps.popperElement),
      initialProps.popperOptions,
    )
  }

  function destroyInstance() {
    if (state.popperInstance) {
      state.popperInstance.destroy()
      state.popperInstance = null
    }
  }

  function show() {
    if (state.isShown) {
      return
    }

    state.isShown = true
    // инстанс постоянно создается и удаляется по соображениям экономии памяти'
    createInstance()
  }

  function hide() {
    if (!state.isShown) {
      return
    }
    state.isShown = false
    destroyInstance()
  }

  function toggleVisibility() {
    state.isShown ? hide() : show()
  }

  return {
    show,
    hide,
    toggleVisibility,
    isShown: toRef(state, 'isShown'),
  }
}
