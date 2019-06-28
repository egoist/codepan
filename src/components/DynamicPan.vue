<template>
  <html-pan class="pan" v-if="pan === 'html'"/>
  <css-pan class="pan" v-else-if="pan === 'css'"/>
  <js-pan class="pan" v-else-if="pan === 'js'"/>
  <console-pan class="pan" v-else-if="pan === 'console'"/>
  <output-pan class="pan" v-else-if="pan === 'output'"/>
</template>

<script>
import HTMLPan from '@/components/HTMLPan.vue'
import JSPan from '@/components/JSPan.vue'
import OutputPan from '@/components/OutputPan.vue'
import ConsolePan from '@/components/ConsolePan.vue'
import CSSPan from '@/components/CSSPan.vue'

export default {
  props: ['pan'],
  components: {
    'html-pan': HTMLPan,
    'js-pan': JSPan,
    'output-pan': OutputPan,
    'console-pan': ConsolePan,
    'css-pan': CSSPan
  }
}
</script>
