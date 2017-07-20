<template>
  <el-tooltip content="View compiled">
    <svg-icon
      class="svg-icon"
      name="code"
      @click="handleClick">
    </svg-icon>
  </el-tooltip>
</template>

<script>
import { Tooltip } from 'element-ui'
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
    'el-tooltip': Tooltip,
    SvgIcon
  }
}
</script>
