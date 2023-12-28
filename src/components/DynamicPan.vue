<template>
  <html-pan
    v-if="pan === 'html'"
    class="pan"
  />
  <css-pan
    v-else-if="pan === 'css'"
    class="pan"
  />
  <js-pan
    v-else-if="pan === 'js'"
    class="pan"
  />
  <console-pan
    v-else-if="pan === 'console'"
    class="pan"
  />
  <output-pan
    v-else-if="pan === 'output'"
    class="pan"
  />
</template>

<script>
import HTMLPan from '@/components/HTMLPan.vue'
import JSPan from '@/components/JSPan.vue'
import OutputPan from '@/components/OutputPan.vue'
import ConsolePan from '@/components/ConsolePan.vue'
import CSSPan from '@/components/CSSPan.vue'

export default {
  components: {
    'html-pan': HTMLPan,
    'js-pan': JSPan,
    'output-pan': OutputPan,
    'console-pan': ConsolePan,
    'css-pan': CSSPan
  },
  props: ['pan']
}
</script>
