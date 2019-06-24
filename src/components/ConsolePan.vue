<template>
  <div
    class="console-pan"
    :class="{'active-pan': isActivePan}"
    @click="setActivePan('console')"
    :style="style">
    <div class="pan-head">
      <el-badge
        :value="logs.length"
        :max="99">
        Console
      </el-badge>
      <el-button
        icon="el-icon-delete"
        size="mini"
        v-show="logs.length"
        @click="clearLogs">
        Clear
      </el-button>
    </div>
    <div class="console-logs" ref="console">
      <div
        class="console-log cm-s-default"
        :class="`console-log-${log.type}`"
        :key="index"
        v-html="log.message"
        v-for="(log, index) in logs">
      </div>
    </div>
    <pan-resizer pan="console" :enable="enableResizer" />
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import { Badge, Button } from 'element-ui'
  import panPosition from '@/utils/pan-position'
  import PanResizer from '@/components/PanResizer.vue'
  import { hasNextPan } from '@/utils'
  import '@/utils/highlight'
  import Event from '@/utils/event'

  export default {
    data() {
      return {
        style: {}
      }
    },
    watch: {
      logs() {
        const { console } = this.$refs
        this.$nextTick(() => {
          console.scrollTop = console.scrollHeight
        })
      },
      visiblePans: {
        immediate: true,
        handler(val) {
          this.style = panPosition(val, 'console')
        }
      }
    },
    mounted() {
      Event.$on(`set-console-pan-style`, style => {
        this.style = {
          ...this.style,
          ...style
        }
      })
    },
    computed: {
      ...mapState(['logs', 'visiblePans', 'activePan']),
      enableResizer() {
        return hasNextPan(this.visiblePans, 'console')
      },
      isActivePan() {
        return this.activePan === 'console'
      }
    },
    methods: {
      ...mapActions(['clearLogs', 'setActivePan'])
    },
    components: {
      'el-badge': Badge,
      'el-button': Button,
      'pan-resizer': PanResizer
    }
  }
</script>

<style lang="stylus" scoped>
.console-logs
  height: calc(100% - 40px)
  overflow: auto

.console-log
  white-space: pre
  font-size: 13px
  padding: 10px
  border-bottom: 1px solid #efefef

.console-log-error
  color: red
</style>
