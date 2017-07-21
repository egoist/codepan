<template>
  <svg-icon
    class="svg-icon"
    name="code"
    @click="handleClick"
    v-tippy="{title: 'View compiled'}">
  </svg-icon>
</template>

<script>
import SvgIcon from '@/components/SvgIcon.vue'
import Event from '@/utils/event'

export default {
  props: {
    type: {
      required: true,
      type: String
    }
  },
  methods: {
    handleClick() {
      Event.$emit('show-compiled-code', this.type)
    }
  },
  components: {
    SvgIcon
  }
}
</script>
