<template>
  <footer class="footer">
    <div class="footer__content container">
      <nav class="footer__nav">
        <div class="footer__nav-logo">
          <nuxt-link to="/" class="footer__link-logo">
            <img src="~assets/svg/logo.svg" alt="logo" />
          </nuxt-link>
        </div>
        <div class="footer__nav-links footer__nav-links_1">
          <h3 class="t-m-cat">Обучение</h3>
          <ul class="ul-no-style">
            <li>
              <a href="/schedule" class="t-menu color--kiwi-green"> Расписание </a>
            </li>
            <li>
              <a href="/course" class="t-menu color--kiwi-green"> Курсы </a>
            </li>
            <li>
              <a href="/program" class="t-menu color--kiwi-green"> Проекты </a>
            </li>
          </ul>
        </div>
        <div class="footer__nav-links footer__nav-links_2">
          <h3 class="t-m-cat">Медиатека</h3>
          <ul class="ul-no-style">
            <li>
              <a href="/material/theses" class="t-menu color--kiwi-green"> Конспекты </a>
            </li>
            <li>
              <a href="/material/video" class="t-menu color--kiwi-green"> Видеоархив </a>
            </li>
            <li>
              <a href="/material/podcast" class="t-menu color--kiwi-green"> Подкасты </a>
            </li>
          </ul>
        </div>
        <div class="footer__nav-links footer__nav-links_3">
          <h3 class="t-m-cat">О Med.Studio</h3>
          <ul class="ul-no-style">
            <li>
              <a href="/lector" class="t-menu color--kiwi-green"> Лекторы </a>
            </li>
            <li>
              <a href="/partner" class="t-menu color--kiwi-green"> Партнёры </a>
            </li>
            <li>
              <a href="/about" class="t-menu color--kiwi-green"> О компании </a>
            </li>
          </ul>
        </div>
        <SCollapse class="footer__collapse-menu" center>
          <SCollapseItem center name="training">
            <template #header>
              <span class="t-m-cat">Обучение</span>
            </template>
            <div class="t-menu">
              <ul class="ul-no-style">
                <li>
                  <a href="/schedule" class="t-menu color--kiwi-green"> Расписание </a>
                </li>
                <li>
                  <a href="/course" class="t-menu color--kiwi-green"> Курсы </a>
                </li>
                <li>
                  <a href="/program" class="t-menu color--kiwi-green"> Проекты </a>
                </li>
              </ul>
            </div>
          </SCollapseItem>
          <SCollapseItem center name="media">
            <template #header>
              <span class="t-m-cat">Медиатека</span>
            </template>
            <div class="t-menu">
              <ul class="ul-no-style">
                <li>
                  <a href="/material/theses" class="t-menu color--kiwi-green"> Конспекты </a>
                </li>
                <li>
                  <a href="/material/video" class="t-menu color--kiwi-green"> Видеоархив </a>
                </li>
                <li>
                  <a href="/material/podcast" class="t-menu color--kiwi-green"> Подкасты </a>
                </li>
              </ul>
            </div>
          </SCollapseItem>
          <SCollapseItem center name="about">
            <template #header>
              <span class="t-m-cat">О Med.Studio</span>
            </template>
            <div class="t-menu">
              <ul class="ul-no-style">
                <li>
                  <a href="/lector" class="t-menu color--kiwi-green"> Лекторы </a>
                </li>
                <li>
                  <a href="/partner" class="t-menu color--kiwi-green"> Партнеры </a>
                </li>
                <li>
                  <a href="/about" class="t-menu color--kiwi-green"> О компании </a>
                </li>
              </ul>
            </div>
          </SCollapseItem>
        </SCollapse>

        <div class="footer__nav-social">
          <div class="footer__links">
            <a href="tel:+788005002692" class="footer__phone-link t-menu color--cobalt-black"
              >8 800 500 26 92</a
            >
            <a href="tel:+74951203692" class="footer__phone-link t-menu color--cobalt-black"
              >+7 495 120 36 92</a
            >
            <a href="mailto:info@med.studio" class="footer__phone-link t-menu color--kiwi-green"
              >info@med.studio</a
            >
          </div>
          <div class="footer__social-links">
            <a href="https://vk.com/med.studio.official" target="_blank">
              <IconVkCircle class="footer__social-item" />
            </a>
            <a href="https://t.me/medstudi0" target="_blank">
              <IconTelegram class="footer__social-item" />
            </a>
          </div>
        </div>
      </nav>
      <div class="footer__copyright">
        <span class="t-c color--cool-grey footer__copyright-text"
          >ООО «Мед.Студио», {{ currentY }} · Все права защищены</span
        >
      </div>
    </div>
  </footer>
</template>
<script>
import Vue from 'vue'
import { IconTelegram, IconVkCircle } from '~/components/icons'
import { SCollapse, SCollapseItem } from '~/components/ui-system/index'
export default Vue.extend({
  components: {
    IconTelegram,
    IconVkCircle,
    SCollapse,
    SCollapseItem,
  },
  data() {
    return {
      currentY: new Date().getFullYear(),
    }
  },
})
</script>
<style lang="scss">
.footer {
  &__nav {
    padding-top: 40px;
    padding-bottom: 30px;
    border-top: 1px solid $color-neutral-ice-grey;
    display: grid;
    grid-template-columns: repeat(4, 2fr [col-footer-nav]) 4fr;
    @include media-breakpoint-down(xl) {
      grid-template-rows: auto 1fr;
      grid-template-columns: repeat(3, 2fr [col-footer-nav]) 4fr;
    }
    @include media-breakpoint-down(md) {
      grid-template-rows: 1fr;
      grid-template-columns: 1fr;
    }
  }
  &__copyright {
    padding: 15px;
    text-align: center;
    border-top: 1px solid $color-neutral-ice-grey;
  }
  &__nav-logo {
    @include media-breakpoint-down(xl) {
      grid-column-start: 1;
      grid-column-end: 12;
      grid-row-start: 1;
      grid-row-end: 1;
      text-align: center;
      margin-bottom: 32px;
    }
    @include media-breakpoint-down(md) {
      grid-column-start: 1;
      grid-column-end: 12;
      grid-row-start: 1;
      grid-row-end: 1;
      text-align: center;
      margin-bottom: 32px;
    }
  }
  &__nav-links {
    @include media-breakpoint-down(xl) {
      grid-row-start: 2;
      grid-row-end: 2;
    }
    @include media-breakpoint-down(md) {
      text-align: center;
      grid-column-start: 1;
      grid-column-end: 12;
      display: none;
    }
  }
  &__nav-social {
    text-align: right;
    display: inline-flex;
    flex-direction: column;
    @include media-breakpoint-down(xl) {
      grid-row-start: 2;
      grid-row-end: 2;
    }
    @include media-breakpoint-down(md) {
      text-align: center;
      grid-row-start: 5;
      grid-row-end: 5;
      grid-column-start: 1;
      grid-column-end: 12;
    }
  }
  &__links {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-end;
    margin-bottom: 12px;
    @include media-breakpoint-down(md) {
      align-items: center;
    }
  }
  &__phone-link {
    display: inline-flex;
  }
  &__social-item {
    cursor: pointer;
    margin-left: 8px;
    color: $color-main-kiwi-green;
    @include anim-hover;
    &:hover {
      color: $color-status-green-hover;
    }
    &:active {
      color: $color-status-green-active;
    }
  }
  &__link-logo {
    display: inline-flex;
  }
  &__copyright-text {
    display: inline-flex;
    @include media-breakpoint-down(md) {
      max-width: 200px;
    }
  }
  &__collapse-menu {
    display: none;
    margin-bottom: 40px;
    text-align: center;
    @include media-breakpoint-down(md) {
      display: block;
      grid-row-start: 2;
      grid-row-end: 2;
    }
  }
}
</style>
