<template>
  <div class="layout">
    <div class="container">
      <div class="ui-kit-page">
        <SInputPin v-model="pinValue" />
        <br />
        <SInputPin v-model="pinValue2" :compressed="true" />
        <br />
        <div style="width: 320px">
          <div>
            <div>Селект Обыкновенный</div>
            <br />
            <SSelect
              v-model="select.value"
              placeholder="Введите название"
              label="title"
              track-by="title"
              :initial-options="select.options"
              :compressed="true"
            />
          </div>
          <br />
          <div>
            <div>Селект с поиском</div>
            <br />
            <SSelect
              v-model="select__2.value"
              placeholder="Введите название"
              label="title"
              track-by="title"
              :searchable="true"
              :initial-options="select__2.options"
              :compressed="true"
            />
          </div>
          <br />
          <div>
            <div>Мульти селект</div>
            <br />
            <SSelect
              v-model="select__3.value"
              placeholder="Введите название"
              label="product"
              track-by="product"
              :searchable="true"
              :multiple="true"
              :initial-options="select__3.options"
              :compressed="true"
            />
          </div>
          <div>
            <div>ASYNC Селект с поиском</div>
            <br />
            <SSelect
              v-model="select__4.value"
              placeholder="Введите название"
              label="title"
              track-by="title"
              :searchable="true"
              :compressed="true"
              :async-function="testCheckboxFunction"
            />
          </div>
          <br />
          <div>
            <div>ASYNC Мульти селект</div>
            <br />
            <SSelect
              v-model="select__5.value"
              placeholder="Введите название"
              label="title"
              track-by="title"
              :searchable="true"
              :multiple="true"
              :compressed="true"
              :async-function="testCheckboxFunction"
            />
          </div>
        </div>
        <div style="height: 150px"></div>
        <div class="colors">
          <div class="colors__main-kiwi-green"></div>
          <div class="colors__main-sea-green"></div>
          <div class="colors__main-king-blue"></div>
          <div class="colors__main-queen-blue"></div>
        </div>
        <div style="height: 15px"></div>
        <div class="gradient"></div>
        <div style="height: 15px"></div>
        <div class="colors">
          <div class="colors__neutral-cobalt-black"></div>
          <div class="colors__neutral-cool-grey"></div>
          <div class="colors__neutral-ice-grey"></div>
          <div class="colors__neutral-pale-grey"></div>
          <div class="colors__neutral-snow-white"></div>
        </div>

        <div style="height: 150px"></div>
        <div class="typo">
          <h1 class="h-1">Headline 1 Amazing Absolutely</h1>
          <h2 class="h-2">Headline 2 Amazing Absolutely</h2>
          <h3 class="h-3">Headline 3 Amazing Absolutely</h3>
          <h4 class="h-4">Headline 4 Amazing Absolutely</h4>
          <h5 class="h-5">Headline 5 Amazing Absolutely</h5>
          <h6 class="h-6">Headline 6 Amazing Absolutely</h6>
          <br />
          <p class="t-p">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda aut earum eum id
            nemo pariatur placeat porro sapiente, sequi similique sint ullam ut vel veritatis
            voluptate? Distinctio earum iusto quisquam?
          </p>
          <br />
          <p class="t-c">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. A aliquid asperiores, dolorum
            earum eos, est, harum id impedit ipsa laudantium maxime nostrum recusandae repellendus
            suscipit voluptatem. Magni odit officiis veniam!
          </p>
          <br />
          <p class="t-b-l">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad assumenda commodi deleniti
            distinctio doloremque doloribus ea expedita explicabo illo libero nostrum odio, officiis
            quae, quia quis, saepe velit veritatis vitae.
          </p>
          <br />
          <p class="t-sp">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet at beatae, consectetur
            debitis deserunt, dicta dolor ea ipsum modi molestiae nam nemo, odio odit quibusdam
            ratione voluptas voluptatem. Dolore, magnam!
          </p>
          <br />
          <p class="t-menu">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab ad aperiam consectetur
            cumque dolorum ducimus eius enim esse exercitationem fugiat impedit mollitia neque,
            nulla omnis, quae rem tenetur voluptate voluptates.
          </p>
          <br />
          <p class="t-m-cat">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam culpa dignissimos
            ducimus eaque earum ex exercitationem explicabo, impedit in incidunt ipsa labore magni
            minima, non praesentium quibusdam, quidem tempore! Cum!
          </p>
          <br />
          <p class="t-tag">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias error in nulla, quisquam
            recusandae sit tempora temporibus? Fugit, odit, voluptates? Dicta dolorum earum incidunt
            necessitatibus nesciunt qui quibusdam voluptate voluptates?
          </p>
          <br />
          <p class="t-e-m">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci aliquam aut
            blanditiis commodi, dolore earum in maiores maxime odio optio perferendis quaerat, quod
            recusandae repellat soluta tempore totam veritatis voluptatum?
          </p>
          <br />
          <p class="t-dropdown-m-t">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aspernatur, commodi
            consequatur debitis distinctio facilis maxime minima natus nobis nulla omnis porro quasi
            quis quo repudiandae sint, soluta unde? Eaque!
          </p>
          <br />
          <p class="sp-h-h">Hero Headline</p>
          <br />
          <p class="sp-b-h">Big Headline</p>
          <br />
          <p class="sp-m-h">Вам также будет интересно</p>
          <br />
          <p class="sp-m-h-a">Вам также будет интересно</p>
          <br />
          <p class="sp-mammoth">Вам также будет интересно</p>
          <br />
          <p class="sp-tabs">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. A ab animi aspernatur at dolor
            ducimus eligendi eos eum explicabo illum, laudantium natus nemo, nulla pariatur quae
            quasi quia unde voluptates.
          </p>
          <br />
          <p class="sp-tips">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa dignissimos dolore
            exercitationem expedita fuga iure magnam non omnis placeat quisquam quos, sed sequi
            similique sunt suscipit vel, voluptatibus! Ea, quisquam.
          </p>
        </div>
        <div style="height: 150px"></div>

        <div class="buttons">
          <SButton type="solid" link="https://google.com"> Default </SButton>
          <SButton type="solid" color="blue" @click="showAlert"> Default </SButton>
          <SButton type="ghost"> Secondary </SButton>
          <SButton type="ghost" color="blue"> Secondary </SButton>
          <SButton type="solid" disabled> Default </SButton>
          <SButton type="ghost" disabled> Secondary </SButton>
          <SButton type="solid" color="green" compressed> Default </SButton>
          <SButton type="solid" color="blue" compressed> Default </SButton>
          <SButton type="ghost" color="green" compressed> Secondary </SButton>
          <SButton type="ghost" color="blue" compressed> Secondary </SButton>
          <SButton type="solid" color="blue" compressed disabled> Default </SButton>
          <SButton type="ghost" color="green" compressed disabled> Secondary </SButton>
        </div>

        <div style="height: 35px"></div>

        <div class="buttons">
          <SButton type="solid" icon="left" :icon-name="'star-outline'"> Default </SButton>
          <SButton type="solid" color="blue" icon="right" :icon-name="'star-outline'">
            Default
          </SButton>
          <SButton type="ghost" icon="left" :icon-name="'star-outline'"> Secondary </SButton>
          <SButton type="ghost" color="blue" icon="right" :icon-name="'star-outline'">
            Secondary
          </SButton>
          <SButton type="solid" disabled icon="right" :icon-name="'star-outline'">
            Default
          </SButton>
          <SButton type="ghost" disabled icon="right" :icon-name="'star-outline'">
            Secondary
          </SButton>
          <SButton type="solid" color="green" compressed icon="right" :icon-name="'star-outline'">
            Default
          </SButton>
          <SButton type="solid" color="blue" compressed> Default </SButton>
          <SButton type="ghost" color="green" compressed> Secondary </SButton>
          <SButton type="ghost" color="blue" compressed icon="right" :icon-name="'star-outline'">
            Secondary
          </SButton>
          <SButton type="solid" color="blue" compressed disabled> Default </SButton>
          <SButton type="ghost" color="green" compressed disabled link="google.com">
            Secondary
          </SButton>
        </div>

        <div style="height: 35px"></div>
        <div class="buttons">
          <SButton type="arrowed" icon="left" icon-name="chevron-left-outline"> Arrowed </SButton>
          <SButton type="arrowed" icon="right" icon-name="chevron-right-outline"> Arrowed </SButton>
          <SButton type="arrowed" icon="left" disabled icon-name="chevron-left-outline">
            Arrowed
          </SButton>
          <SButton type="arrowed" icon="right" disabled icon-name="chevron-right-outline">
            Arrowed
          </SButton>
          <SButton type="arrowed" compressed icon="left" icon-name="chevron-left-outline">
            Arrowed
          </SButton>
          <SButton type="arrowed" compressed icon="right" icon-name="chevron-right-outline">
            Arrowed
          </SButton>
          <SButton type="arrowed" compressed disabled icon="left" icon-name="chevron-left-outline">
            Arrowed
          </SButton>
          <SButton
            type="arrowed"
            compressed
            disabled
            icon="right"
            icon-name="chevron-right-outline"
          >
            Arrowed
          </SButton>
        </div>

        <div style="height: 35px"></div>

        <div>
          <SMenu>
            <template #head>
              <span class="h-5"> Сергей Майнер </span>
            </template>
            <SMenuItem> Option 1 </SMenuItem>
            <SMenuItem> Option 2 </SMenuItem>
          </SMenu>
        </div>

        <div style="height: 35px"></div>

        <div class="ui-kit-page__item-block ui-item-block">
          <h3 class="h3 ui-item-block__title">Alerts</h3>
          <div class="alerts">
            <SAlert> Вы не будете получать уведомление на email пока не подтвердите его </SAlert>
            <SAlert type="warning">
              Вы не будете получать уведомление на email пока не подтвердите его
            </SAlert>
            <SAlert type="error">
              Вы не будете получать уведомление на email пока не подтвердите его
            </SAlert>
            <SAlert type="info">
              Вы не будете получать уведомление на email пока не подтвердите его
            </SAlert>
            <SAlert :icon="false"> Вы не будете получать уведомление на email </SAlert>
            <SAlert type="warning" :icon="false">
              Вы не будете получать уведомление на email
            </SAlert>
            <SAlert type="error" :icon="false"> Вы не будете получать уведомление на email </SAlert>
            <SAlert type="info" :icon="false"> Вы не будете получать уведомление на email </SAlert>
          </div>
        </div>
        <div class="ui-kit-page__item-block ui-item-block">
          <h3 class="h3 ui-item-block__title">Collapse</h3>
          <SCollapse v-model="activeNames" accordion @change="collapseChange">
            <SCollapseItem center open name="1">
              <template #header>
                <span class="t-m-cat">Collapse item</span>
              </template>
              <div class="t-menu">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</div>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium culpa dolorum,
              est incidunt, ipsam laborum magni maiores minima nam nostrum odio pariatur placeat
              quasi quia voluptatum? Ad obcaecati soluta velit!
            </SCollapseItem>
            <SCollapseItem center name="2">
              <template #header>
                <span class="t-m-cat">Collapse item</span>
              </template>
              <div class="t-menu">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</div>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium culpa dolorum,
              est incidunt, ipsam laborum magni maiores minima nam nostrum odio pariatur placeat
              quasi quia voluptatum? Ad obcaecati soluta velit!
            </SCollapseItem>
          </SCollapse>
        </div>
        <div class="ui-kit-page__item-block ui-item-block">
          <h3 class="h3 ui-item-block__title">Input</h3>
          <div class="ui-item-block__item">
            <SInput v-model="form.name" placeholder="Введите ваше имя"> </SInput>
          </div>
          <div class="ui-item-block__item">
            <SInput v-model="form.name" placeholder="Введите ваше имя" disabled> </SInput>
          </div>
          <div class="ui-item-block__item">
            <SInput
              v-model="form.name"
              placeholder="Введите ваше имя"
              append-icon="alert-circle-outline"
            >
            </SInput>
          </div>
          <div class="ui-item-block__item">
            <SInput
              v-model="form.name"
              type="password"
              placeholder="Введите ваше имя"
              append-icon="alert-circle-outline"
            >
            </SInput>
          </div>
        </div>
        <div class="ui-kit-page__item-block ui-item-block">
          <h3 class="h3 ui-item-block__title">Dialog</h3>
          <SButton type="solid" color="blue" compressed @click="openDialog"> Open dialog </SButton>
          <SDialog v-model="showDialog" title="Dialog title" scroll>
            <template #icon>
              <EvaIcon name="close-outline" fill="#2E3A59" />
            </template>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci aliquid consequatur
              debitis delectus, doloremque ea, esse inventore iste maxime minima molestiae natus
              necessitatibus nemo non quia quod, rem repudiandae voluptate.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet at beatae culpa cum
              doloremque ex excepturi facere, facilis, ipsum itaque mollitia numquam pariatur qui
              quo saepe suscipit voluptas. Itaque, provident.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium alias beatae
              corporis, culpa deleniti dignissimos dolores ea expedita facilis id, laborum maxime
              quibusdam quo sapiente sit temporibus ullam unde veritatis.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur corporis, ex
              fugiat hic incidunt mollitia nostrum placeat qui quisquam, sed sit tempora voluptatem
              voluptatum. Ipsam neque nihil officiis quaerat voluptatibus.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus dolores eligendi
              incidunt ipsum iure nesciunt nulla sunt tempore veniam vitae. Consequuntur fuga fugiat
              harum magni molestiae nobis reprehenderit sed sit!
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto blanditiis
              deleniti eos expedita itaque laborum, laudantium magni molestiae natus necessitatibus
              neque nostrum praesentium quasi saepe sed similique temporibus ut? Quod?
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. A ad aspernatur cumque,
              debitis dolore dolores eaque, earum eum fuga id itaque neque non pariatur perspiciatis
              quas repellendus reprehenderit repudiandae voluptatibus.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci aliquid consequatur
              debitis delectus, doloremque ea, esse inventore iste maxime minima molestiae natus
              necessitatibus nemo non quia quod, rem repudiandae voluptate.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet at beatae culpa cum
              doloremque ex excepturi facere, facilis, ipsum itaque mollitia numquam pariatur qui
              quo saepe suscipit voluptas. Itaque, provident.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium alias beatae
              corporis, culpa deleniti dignissimos dolores ea expedita facilis id, laborum maxime
              quibusdam quo sapiente sit temporibus ullam unde veritatis.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur corporis, ex
              fugiat hic incidunt mollitia nostrum placeat qui quisquam, sed sit tempora voluptatem
              voluptatum. Ipsam neque nihil officiis quaerat voluptatibus.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus dolores eligendi
              incidunt ipsum iure nesciunt nulla sunt tempore veniam vitae. Consequuntur fuga fugiat
              harum magni molestiae nobis reprehenderit sed sit!
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto blanditiis
              deleniti eos expedita itaque laborum, laudantium magni molestiae natus necessitatibus
              neque nostrum praesentium quasi saepe sed similique temporibus ut? Quod?
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. A ad aspernatur cumque,
              debitis dolore dolores eaque, earum eum fuga id itaque neque non pariatur perspiciatis
              quas repellendus reprehenderit repudiandae voluptatibus.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci aliquid consequatur
              debitis delectus, doloremque ea, esse inventore iste maxime minima molestiae natus
              necessitatibus nemo non quia quod, rem repudiandae voluptate.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet at beatae culpa cum
              doloremque ex excepturi facere, facilis, ipsum itaque mollitia numquam pariatur qui
              quo saepe suscipit voluptas. Itaque, provident.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium alias beatae
              corporis, culpa deleniti dignissimos dolores ea expedita facilis id, laborum maxime
              quibusdam quo sapiente sit temporibus ullam unde veritatis.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur corporis, ex
              fugiat hic incidunt mollitia nostrum placeat qui quisquam, sed sit tempora voluptatem
              voluptatum. Ipsam neque nihil officiis quaerat voluptatibus.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus dolores eligendi
              incidunt ipsum iure nesciunt nulla sunt tempore veniam vitae. Consequuntur fuga fugiat
              harum magni molestiae nobis reprehenderit sed sit!
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto blanditiis
              deleniti eos expedita itaque laborum, laudantium magni molestiae natus necessitatibus
              neque nostrum praesentium quasi saepe sed similique temporibus ut? Quod?
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. A ad aspernatur cumque,
              debitis dolore dolores eaque, earum eum fuga id itaque neque non pariatur perspiciatis
              quas repellendus reprehenderit repudiandae voluptatibus.
            </p>
          </SDialog>
        </div>
        <div class="ui-kit-page__item-block ui-item-block">
          <h3 class="h3 ui-item-block__title">Checkbox</h3>
          <SCheckbox v-model="checkbox_1" class="ui-item-block__item"> Option 1 </SCheckbox>
          <SCheckbox v-model="checkbox_1" disabled class="ui-item-block__item">
            Option 2
          </SCheckbox>
        </div>
        <div class="ui-kit-page__item-block ui-item-block">
          <h3 class="h3 ui-item-block__title">Tabs</h3>
          <STabs>
            <STabItem title="Video">
              <p>
                1 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur, ipsa
                praesentium. A dicta dolore illo nostrum officia pariatur, perferendis quidem quis
                quisquam temporibus. Dolores, laborum nulla quas saepe tempore voluptate.
              </p>
            </STabItem>
            <STabItem title="Podcast">
              <p>
                2 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur, ipsa
                praesentium. A dicta dolore illo nostrum officia pariatur, perferendis quidem quis
                quisquam temporibus. Dolores, laborum nulla quas saepe tempore voluptate.
              </p>
            </STabItem>
            <STabItem title="Сonspectus">
              <p>
                3 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur, ipsa
                praesentium. A dicta dolore illo nostrum officia pariatur, perferendis quidem quis
                quisquam temporibus. Dolores, laborum nulla quas saepe tempore voluptate.
              </p>
            </STabItem>
          </STabs>
        </div>
        <div class="ui-kit-page__item-block ui-item-block">
          <h3 class="h3 ui-item-block__title">Radio Button Group</h3>
          <SRadioGroup v-model="radio" column>
            <SRadio val="0"> Я из России </SRadio>
            <SRadio val="1"> Я не из России </SRadio>
            <SRadio val="2"> Я не из России </SRadio>
          </SRadioGroup>
        </div>
        <div class="ui-kit-page__item-block ui-item-block">
          <h3 class="h3 ui-item-block__title">Radio Group</h3>
          <SRadioGroup v-model="radio">
            <SRadioButton val="0"> Я из России </SRadioButton>
            <SRadioButton val="1"> Я не из России </SRadioButton>
            <SRadioButton val="2" disabled> Я не из России </SRadioButton>
          </SRadioGroup>
        </div>
      </div>
    </div>
    <AppGlobalAlert />
  </div>
</template>

<script lang="js">
import AppGlobalAlert from '~/components/base/app-global-alert'
import useGlobalAlert from '~/domain/composables/useGlobalAlert'

import {
  SButton,
  SMenu,
  SMenuItem,
  SAlert,
  SCollapse,
  SCollapseItem,
  SInput,
  SInputPin,
  SDialog,
  SCheckbox,
  STabs,
  STabItem,
  SSelect,
  SRadio,
  SRadioGroup,
  SRadioButton,
} from '~/components/ui-system'

export default {
  components: {
    SCheckbox,
    SButton,
    SMenu,
    SMenuItem,
    SAlert,
    SCollapse,
    SCollapseItem,
    AppGlobalAlert,
    SInput,
    SInputPin,
    SDialog,
    STabs,
    STabItem,
    SSelect,
    SRadio,
    SRadioGroup,
    SRadioButton,
  },
  layout: 'empty',
  data () {
    return {
      show: false,
      activeNames: ['1'],
      form: {
        name: 'Константинопольский',
      },
      showDialog: false,
      checkbox_1: true,
      checkbox_2: true,
      pinValue: [],
      pinValue2: [1, 2, 3, 4],
      select: {
        value: { title: 'FIRST', desc: 'More space battles!' },
        options: [
          { title: 'Space Pirate', desc: 'More space battles!' },
          { title: 'Merchant Merchant Merchant Merchant Merchant Merchant Merchant Merchant', desc: 'PROFIT!' },
          { title: 'EXPLORER', desc: 'Discovering new species!' },
          { title: 'Miner1', desc: 'We need to go deeper!' },
          { title: 'Miner2', desc: 'We need to go deeper!' },
          { title: 'Miner3', desc: 'We need to go deeper!' },
          { title: 'Miner4', desc: 'We need to go deeper!' },
        ],
      },
      select__2: {
        value: { title: 'FIRST', desc: 'More space battles!' },
        options: [
          { title: 'Space Pirate', desc: 'More space battles!' },
          { title: 'Merchant Merchant Merchant Merchant Merchant Merchant Merchant Merchant', desc: 'PROFIT!' },
          { title: 'EXPLORER', desc: 'Discovering new species!' },
          { title: 'Miner1', desc: 'We need to go deeper!' },
          { title: 'Miner2', desc: 'We need to go deeper!' },
          { title: 'Miner3', desc: 'We need to go deeper!' },
          { title: 'Miner4', desc: 'We need to go deeper!' },
        ],
      },
      select__3: {
        value: [{ product: 'FIRST', desc: 'More space battles!' }],
        options: [
          { product: 'Space Pirate', desc: 'More space battles!' },
          { product: 'Merchant Merchant Merchant Merchant Merchant Merchant Merchant Merchant', desc: 'PROFIT!' },
          { product: 'EXPLORER', desc: 'Discovering new species!' },
          { product: 'Miner1', desc: 'We need to go deeper!' },
          { product: 'Miner2', desc: 'We need to go deeper!' },
          { product: 'Miner3', desc: 'We need to go deeper!' },
          { product: 'Miner4', desc: 'We need to go deeper!' },
        ],
      },
      select__4: {
        value: [],
      },
      select__5: {
        value: [{ title: 'FIRST', desc: 'More space battles!' }],
      },
      radio: '0',
    }
  },
  methods: {
    showAlert () {
      const alert = useGlobalAlert()
      alert.createAlert(
        'test',
        'error',
      )
    },
    openDialog () {
      this.showDialog = !this.showDialog
    },
    collapseChange (val) {
      console.info(val)
    },
    testCheckboxFunction (query) {
      return new Promise((resolve) => {
        const optionsObject = [
          { title: 'ASYNCSpace Pirate', desc: 'More space battles!' },
          { title: 'ASYNCMerchant', desc: 'PROFIT!' },
          { title: 'ASYNCExplorer77', desc: 'Discovering new species!' },
          { title: 'ASYNCMiner7', desc: 'We need to go deeper!' },
        ]
        setTimeout(() => {
          const filteredOptions = optionsObject.filter(el => el.title.toLowerCase().includes(query.toLowerCase()))
          resolve(filteredOptions)
        }, 200)
      })
    },
  },
}
</script>

<style lang="scss">
.colors {
  display: flex;
  & > div {
    width: 25%;
    height: 150px;
  }

  &__main-kiwi-green {
    background: $color-main-kiwi-green;
  }

  &__main-sea-green {
    background: $color-main-sea-green;
  }

  &__main-king-blue {
    background: $color-main-king-blue;
  }

  &__main-queen-blue {
    background: $color-main-queen-blue;
  }

  &__neutral-cobalt-black {
    background-color: $color-neutral-cobalt-black;
  }

  &__neutral-cool-grey {
    background-color: $color-neutral-cool-grey;
  }

  &__neutral-ice-grey {
    background-color: $color-neutral-ice-grey;
  }

  &__neutral-pale-grey {
    background-color: $color-neutral-pale-grey;
  }

  &__neutral-snow-white {
    background-color: $color-neutral-snow-white;
  }
}
.gradient {
  width: 100%;
  height: 75px;
  background: $gradient-corporate-gradient;
}

.buttons {
  display: grid;
  grid-template-columns: repeat(auto-fill, 150px);
  grid-gap: 10px;
}
.menu-dropdown-head {
  display: inline-flex;
}

.alerts {
  display: grid;
  grid-template-columns: repeat(2, max-content);
  grid-gap: 10px;

  @include media-breakpoint-down(md) {
    grid-template-columns: 1fr;
  }
}

.layout {
  background: $color-neutral-pale-grey;
}
.ui-kit-page {
  &__item-block {
    margin-bottom: 100px;
  }
}
.ui-item-block {
  &__title {
    margin-bottom: 20px;
  }
  &__item {
    margin-bottom: 20px;
  }
}
</style>
