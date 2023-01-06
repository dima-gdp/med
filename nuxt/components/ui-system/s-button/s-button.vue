<script lang="js">
/**
 * Для этого компонента куда лучше бы подошел
 * императивный utility-first подход:
 * При таком то сочетании типов - примени такие то классы
 *
 * На данный момент была предпринята попытка описать компонент
 * декларативно (не смотря на рендер-функцию), что привело
 * к неочевидным приемам в css-части
 */

import EvaIcon from '@/components/base/eva-icon'

const AVAILABLE_ICON_PLACEMENT_MAP = {
  NO: 'no',
  LEFT: 'left',
  RIGHT: 'right',
}

const VALIDATION = {
  AVAILABLE_TYPES: ['solid', 'ghost', 'arrowed'],
  AVAILABLE_COLORS: ['green', 'blue', 'yellow'],
  AVAILABLE_ICON_PLACEMENT: Object.values(AVAILABLE_ICON_PLACEMENT_MAP),
}

export default {
  components: {
    EvaIcon,
  },

  props: {
    type: {
      type: String,
      default: 'solid',
      validator: val =>
        VALIDATION.AVAILABLE_TYPES.includes(val),
    },
    color: {
      type: String,
      default: 'green',
      validator: val =>
        VALIDATION.AVAILABLE_COLORS.includes(val),
    },
    icon: {
      type: String,
      default: 'no',
      validator: val =>
        VALIDATION.AVAILABLE_ICON_PLACEMENT.includes(val),
    },
    compressed: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    iconName: { type: String, default: '' },
    link: { type: [String, null], default: null },
  },

  computed: {
    btnClasses () {
      return [
        't-b-l',
        's-btn',
        `s-btn--c-${this.color}`,
        `s-btn--t-${this.type}`,
        this.compressed ? 's-btn--compressed' : '',
      ]
    },
  },

  created () {
    if (
      this.icon === AVAILABLE_ICON_PLACEMENT_MAP.NO &&
      this.iconName !== ''
    ) {
      console.error('Чтобы разместить иконку на кнопке , нужно задать значение icon')
    }
  },

  methods: {
    onClick () {
      this.$emit('click')
    },
  },

  render (h) {
    const renderEvaIcon = () => {
      const eva = h('eva-icon', {
        props: {
          name: this.iconName,
        },
        class: [
          's-btn__icon',
          this.icon !== AVAILABLE_ICON_PLACEMENT_MAP.NO
            ? `s-btn__icon--${this.icon}`
            : '',
        ],
      })

      return h('client-only', {}, [eva])
    }

    const renderButtonContent = () => {
      let buttonContent

      switch (this.icon) {
        case AVAILABLE_ICON_PLACEMENT_MAP.NO:
          buttonContent = [this.$slots.default]
          break

        case AVAILABLE_ICON_PLACEMENT_MAP.LEFT:
          buttonContent = [
            renderEvaIcon(),
            this.$slots.default,
          ]
          break

        case AVAILABLE_ICON_PLACEMENT_MAP.RIGHT:
          buttonContent = [
            this.$slots.default,
            renderEvaIcon(),
          ]
          break
      }

      return buttonContent
    }

    return h(
      this.link ? 'a' : 'button',
      {
        class: [...this.btnClasses],
        attrs: {
          disabled: this.disabled,
          href: this.disabled ? null : this.link,
          target: this.link ? '_blank' : null,
        },
        on: {
          click: this.onClick,
        },
      },
      [
        h(
          'span',
          { class: 's-btn__content d-f f-c' },
          renderButtonContent(),
        ),
      ],
    )
  },
}
</script>

<style lang="scss">
@import 's-button';
</style>
