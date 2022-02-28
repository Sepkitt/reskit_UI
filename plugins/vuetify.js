import colors from 'vuetify/es5/util/colors'
import 'typeface-montserrat/index.css'
import Core from '@glyphs/vue-core'
import Vue from 'vue'

Vue.use(Core)

// Make sure css loader is installed first
import 'line-awesome/dist/line-awesome/css/line-awesome.css'

const LINE_AWESOME = {
  complete: 'la-check',
  cancel: 'la-ban',
  close: 'la-times',
  delete: 'la-trash', // delete (e.g. v-chip close)
  clear: 'la-times',
  success: 'la-check',
  info: 'la-exclamation-circle',
  warning: 'la-exclamation-triangle',
  error: 'la-exclamation-triangle',
  prev: 'la-angle-left',
  next: 'la-angle-right',
  checkboxOn: 'la-check',
  checkboxOff: 'la-stop',
  checkboxIndeterminate: '...',
  delimiter: '...', // for carousel
  sort: '...',
  expand: 'la-angle-down',
  menu: '...',
  subgroup: '...',
  dropdown: 'la-angle-down',
  radioOn: '...',
  radioOff: '...',
  edit: 'la-edit',
  ratingEmpty: '...',
  ratingFull: '...',
  ratingHalf: '...',
  loading: '...',
  first: '...',
  last: '...',
  unfold: '...',
  file: '...'
}

export default {
  icons: {
    iconfont: 'la', // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4'
    values: LINE_AWESOME
  },
  theme: {
    themes: {
      // dark: {
      //   text:'#707070',
      //   primary: '#E61331',
      //   accent: '#FFB300',
      //   secondary: '#222324',
      //   tertiary: "#282A2D",
      //   quaternary: "#707070",
      //   info: colors.teal.lighten3,
      //   warning: colors.amber.base,
      //   error: colors.deepOrange.accent4,
      //   success: colors.green.accent3
      // },

      light: {
        text: '#416BA2',
        focused: '#014694',
        midnight: '#1C2D4A',
        darkness: '#192841',
        background: '#213556',
        info: '#263F68',
        infoBg: '#1D2E4B',
        primary: '#01C5FF',
        accent: '#C0F1FF',
        secondary: '#1C2D4A',
        warning: '#FE9E74',
        error: '#FE7484',
        success:'#74FEA2'
      }
    }
  }
}
