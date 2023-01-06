<template>
  <div class="main-page">
    <section class="main-page__main-about main-about">
      <div class="main-about__img-block">
        <div class="main-about__main-img"></div>
      </div>
      <div class="main-about__content container">
        <div class="main-about__video-block">
          <div class="main-about__btn-play" @click="showVideo = !showVideo">
            <IconPlayBtnBig class="main-about__btn-play-icon"></IconPlayBtnBig>
          </div>
        </div>
        <div class="main-about__info-block">
          <div class="main-about__label sp-m-h align-items-center color--cool-grey">
            <IconNmo></IconNmo>
            <AppSpacer :max-size="10"></AppSpacer>
            Провайдер НМО
          </div>
          <div class="main-about__title sp-b-h">Портал медицинского онлайн-образования</div>
          <p class="main-about__description t-sp">
            Полезные курсы, открытые лекции, тематические проекты для врачей от ведущих экспертов
          </p>
          <div class="main-about__nav">
            <SButton v-if="!$auth.isLoggedIn" link="/user" class="main-about__btn">
              Стать участником портала
            </SButton>
            <SButton v-else class="main-about__btn" link="/schedule">
              К расписанию трансляций
            </SButton>
            <div class="main-about__nav-more">
              <span
                class="main-about__nav-more-video t-b-l color--kiwi-green"
                @click="showVideo = !showVideo"
                >Узнать больше</span
              >
              <span class="main-about__nav-timer t-c color--cool-grey">Видео · 01:32</span>
            </div>
          </div>
        </div>
      </div>
      <AppModalVideo v-model="showVideo"></AppModalVideo>
    </section>
    <section class="main-page__main-education main-education">
      <div class="main-education__content container">
        <div class="main-education__info-block">
          <div class="main-education__label sp-m-h align-items-center color--cool-grey">
            Бесплатное обучение
          </div>
          <div class="main-education__title sp-h-h">
            Тысячи часов мероприятий, курсов и&nbsp;лекций по
            <AppAnimText
              :data="animSpeciality"
              class="main-education__anim-text color--king-blue"
            ></AppAnimText>
          </div>
          <p class="main-education__description t-sp">
            Хранятся в&nbsp;нашей медиатеке и&nbsp;доступны для просмотра онлайн в&nbsp;любое
            удобное время
          </p>
        </div>
      </div>
    </section>
    <section class="main-page__main-cards main-cards">
      <div class="main-cards__content container">
        <AppCard
          v-for="(item, index) in cards"
          :key="index"
          class="main-cards__item"
          :data="item"
        ></AppCard>
      </div>
    </section>
    <section class="main-page__main-users main-users">
      <div class="main-users__content container">
        <div class="main-users__image-block">
          <img src="~assets/images/main-page/phone.png" alt="" />
        </div>
        <div class="main-users__info-block">
          <div v-if="usersQuantity" class="main-users__quantity o-d sp-mammoth color--king-blue">
            {{ usersQuantity.quantity }}
          </div>
          <div v-if="usersQuantity" class="main-users__title sp-b-h">
            {{ usersQuantity.declination }} уже с&nbsp;нами
          </div>
          <p class="main-users__description t-sp">
            Наши пользователи могут задавать вопросы лектору, общаться с другими врачами, оставлять
            комментарии, участвовать в онлайн-голосованиях и опросах.
          </p>
          <p class="main-users__description t-sp">
            Служба поддержки пользователей на связи в чате, почте или по бесплатной телефонной
            линии.
          </p>
          <SButton v-if="!$auth.isLoggedIn" class="main-users__link" link="/user/sign-in/login">
            Присоединиться к Med.Studio
          </SButton>
          <SButton v-else class="main-users__link" link="/schedule">
            К расписанию трансляций
          </SButton>
        </div>
      </div>
    </section>
    <section class="main-page__main-audience main-audience">
      <div class="main-audience__content container">
        <div class="main-audience__info-block">
          <div class="main-audience__label sp-m-h color--cool-grey">Аудитория</div>
          <div class="main-audience__title sp-b-h">Для кого подходит Med.Studio?</div>
        </div>
        <div class="main-audience__list-audience">
          <AppCardMedium
            v-for="(item, index) in audience"
            :key="index"
            :data="item"
          ></AppCardMedium>
        </div>
      </div>
    </section>
    <section class="main-page__main-partners main-partners">
      <div class="main-partners__content container">
        <div class="main-partners__list-partners">
          <div class="main-partners__partners-grid">
            <AppPartner
              v-for="(item, index) in partners"
              :key="index"
              class="main-partners__item"
              :data="item"
            ></AppPartner>
          </div>
        </div>
        <div class="main-partners__info-block">
          <div class="main-partners__label sp-m-h color--cool-grey">Вместе сильнее</div>
          <div class="main-partners__title sp-b-h">Наши партнёры</div>
          <p class="main-partners__description t-sp">
            Контент на портале создается медицинскими ассоциациями и обществами, ключевыми
            экспертами. Вместе мы создаем актуальный, стоящий продукт!
          </p>
        </div>
      </div>
    </section>
    <section class="main-page__main-sponsors main-sponsors">
      <div class="main-sponsors__content container">
        <div class="main-sponsors__title sp-b-h">Наши спонсоры</div>
      </div>
      <div class="main-sponsors__slider">
        <AppSliderSponsors :sponsors="sponsors"></AppSliderSponsors>
      </div>
    </section>
    <section class="main-page__main-license main-license">
      <div class="main-license__content container">
        <div class="main-license__info-block">
          <div class="main-license__title sp-b-h">Лицензия на образовательную деятельность</div>
          <p class="main-license__description t-sp">
            Портал Med.Studio является провайдером образовательных мероприятий в системе НМО.
            Лицензия позволяет проводить мероприятия с баллами НМО и курсы тематического
            усовершенствования.
          </p>
        </div>
        <div class="main-license__image-block">
          <img
            src="~/assets/images/main-page/license.png"
            alt="license"
            class="main-license__image"
          />
          <a
            href="https://storage.yandexcloud.net/med.studio/official_doc/license.pdf"
            target="_blank"
          >
            <IconLicense class="main-license__btn-show-license"></IconLicense>
          </a>
        </div>
      </div>
    </section>
    <AppParallax class="main-page__parallax"></AppParallax>
  </div>
</template>

<script lang="js">
import Vue
  from "vue";
import AppSpacer
  from "~/components/common/app-spacer";
import AppCard
  from "~/components/base/app-card";
import AppCardMedium
  from "~/components/base/app-card-medium";
import AppPartner
  from "~/components/common/app-partner";

import AppAnimText
  from "~/components/common/app-anim-text";
import AppParallax
  from "~/components/common/app-parallax";
import AppModalVideo
  from "~/components/common/app-modal-video";

import {
  IconLicense,
  IconNmo,
  IconPlayBtnBig
} from "~/components/icons/index";
import { SButton } from "~/components/ui-system/index";
import useUsersCount
  from "~/domain/composables/useUsersCount";

import { decOfNum } from "~/utils";
import {livechatWidget} from "~/utils/livechat-widget";

const AppSliderSponsors = () => import("~/components/common/app-slider-sponsors");

export default Vue.extend({
  components: {
    AppSpacer,
    IconPlayBtnBig,
    IconNmo,
    AppCard,
    AppCardMedium,
    AppPartner,
    IconLicense,
    AppSliderSponsors,
    AppAnimText,
    AppParallax,
    SButton,
    AppModalVideo,
  },
  layout: 'without-bg',
  data () {
    return {
      showVideo: false,
      cards: [
        {
          title: 'Проекты',
          description: 'Циклы лекций, объединенные одной темой. Созданы совместно с ассоциациями, обществами и федеральными центрами.',
          image: '/images/main-page/card-projects.png',
          textLink: 'Подробнее',
          link: '/program',
        },
        {
          title: 'Курсы',
          description: 'Раздел с контентом полезным для практики от признанных специалистов в своей области.',
          image: '/images/main-page/card-courses.png',
          textLink: 'Выбрать курс',
          link: '/course',
        },
        {
          title: 'Архив',
          description: 'Каждый день мы пополняем архив нашей библиотеки. Видеозаписи и аудиоверсии прошедших мероприятий и краткие конспекты.',
          image: '/images/main-page/card-archive.png',
          textLink: 'Подробнее',
          link: '/module',
        },
      ],
      audience: [
        {
          title: 'Слушатели',
          description: 'Всегда под рукой источник знаний, идей и рекомендаций от вдохновляющих экспертов, готовых делиться своими знаниями и практическим опытом.',
          image: '/images/main-page/audience/audience_1.png',
        },
        {
          title: 'Спикеры',
          description: 'Помогаем создавать авторские курсы и проекты, чтобы вести за собой людей, распространять новые знания и внедрять высокие стандарты лечения. ',
          image: '/images/main-page/audience/audience_2.png',
        },
        {
          title: 'Медицинские учреждения',
          description: 'Портал предоставляет комплекс полезных функций: систему дистанционного обучения, тренингов и курсов, инструменты для автоматизированной оценки знаний.',
          image: '/images/main-page/audience/audience_3.png',
        },
        {
          title: 'Организаторы мероприятий',
          description: 'Оснащенные студии, профессиональное видео, световое и звуковое оборудование, у нас есть всё, что необходимо для проведения идеального мероприятия в онлайн-среде.',
          image: '/images/main-page/audience/audience_4.png',
        },
        {
          title: 'Компании',
          description: 'Создавайте курсы и лекции о продуктах и возможностях компании, чтобы в сжатые сроки с максимальным охватом обучать специалистов и доносить важную информацию.',
          image: '/images/main-page/audience/audience_5.png',
        },
      ],
      partners: [
        {
          title: 'ФГБУ «НМИЦ АГП им. В.И. Кулакова» МЗ РФ',
          image: '/images/partners/partner_1.png',
        },
        {
          title: 'Российское общество акушеров-гинекологов',
          image: '/images/partners/partner_2.png',
        },
        {
          title: 'Российское общество радиологов и рентгенологов',
          image: '/images/partners/partner_3.png',
        },
        {
          title: 'ФГБУ «НМИЦ радиологии» МЗ РФ',
          image: '/images/partners/partner_4.png',
        },
        {
          title: 'НИИ урологии и интервенционной радиологии им. Н.А. Лопаткина',
          image: '/images/partners/partner_5.png',
        },
        {
          title: 'ФГБНУ «Научный центр неврологии»',
          image: '/images/partners/partner_6.png',
        },
      ],
      sponsors: [
        {
          image: '/svg/sponsors/acino.svg',
        },
        {
          image: '/svg/sponsors/akrihin.svg',
        },
        {
          image: '/svg/sponsors/alfasigma.svg',
        },
        {
          image: '/svg/sponsors/amgen.svg',
        },
        {
          image: '/svg/sponsors/astellas.svg',
        },
        {
          image: '/svg/sponsors/bi.svg',
        },
        {
          image: '/svg/sponsors/bms.svg',
        },
        {
          image: '/svg/sponsors/ipsen.svg',
        },
        {
          image: '/svg/sponsors/medtronic.svg',
        },
        {
          image: '/svg/sponsors/phizer.svg',
        },
        {
          image: '/svg/sponsors/santen.svg',
        },
        {
          image: '/svg/sponsors/servier.svg',
        },
        {
          image: '/svg/sponsors/takeda.svg',
        },
        {
          image: '/svg/sponsors/pierre_fabre.svg',
        },
      ],
      animSpeciality: [
        'гинекологии',
        'кардиологии',
        'неонатологии',
        'хирургии',
        'педиатрии',
      ],
      usersQuantity: null,
    }
  },

  head() {
    return {
      script: [livechatWidget],
    }
  },

  async mounted () {
    const usersCountModel = useUsersCount()

    try {
      this.usersQuantity = await usersCountModel.getUsersCount()
    } catch (e) {
      console.error(e)
    }
  },
  methods: {
    decOfNum,
  },
})
</script>
<style lang="scss">
@import '../styles/pages/_main.scss';
</style>
