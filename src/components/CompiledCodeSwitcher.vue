<template>
  <repeat-icon
    v-tippy="{title: 'View compiled'}"
    class="svg-icon"
    @click="handleClick"
  />
</template>

<script>
import Event from '@/utils/event'
import { RepeatIcon } from 'vue-feather-icons'

export default {
  components: {
    RepeatIcon
  },
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
  }
}
</script>
