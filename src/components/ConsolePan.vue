<template>
  <div class="console-pan" :style="style">
    <div class="pan-head">
      <el-badge
        :value="logs.length"
        :max="99">
        Console
      </el-badge>
      <el-button
        icon="delete2"
        size="mini"
        v-show="logs.length"
        @click="clearLogs">
        Clear
      </el-button>
    </div>
    <div class="console-logs" ref="console">
      <div
        class="console-log"
        :class="`console-log-${log.type}`"
        key="index"
        v-for="(log, index) in logs">
        {{ log.message }}
      </div>
    </div>
    <pan-resizer :enable="enableResizer" />
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import { Badge, Button } from 'element-ui'
  import panPosition from '@/utils/pan-position'
  import PanResizer from '@/components/PanResizer.vue'
  import { hasNextPan } from '@/utils'

  export default {
    watch: {
      logs() {
        const { console } = this.$refs
        this.$nextTick(() => {
          console.scrollTop = console.scrollHeight
        })
      }
    },
    computed: {
      ...mapState(['logs', 'activePans']),
      style() {
        return panPosition(this.activePans, 'console')
      },
      enableResizer() {
        return hasNextPan(this.activePans, 'console')
      }
    },
    methods: {
      ...mapActions(['clearLogs'])
    },
    components: {
      'el-badge': Badge,
      'el-button': Button,
      'pan-resizer': PanResizer
    }
  }
</script>

<style scoped>
  .console-logs {
    height: calc(100% - 40px);
    overflow: auto;
    padding: 0 10px;
  }

  .console-log {
    white-space: pre;
    font-size: 13px;
  }

  .console-log-error {
    color: red;
  }
</style>
