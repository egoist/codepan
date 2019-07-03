<template>
  <div class="console-pan" :class="{'active-pan': isActivePan}" @click="setActivePan('console')">
    <div class="pan-head">
      <el-badge :value="logs.length" :max="99">Console</el-badge>
      <el-button icon="el-icon-delete" size="mini" v-show="logs.length" @click="clearLogs">Clear</el-button>
    </div>
    <div class="console-logs" ref="console">
      <div
        class="console-log cm-s-default"
        :class="`console-log-${log.type}`"
        :key="index"
        v-html="log.message"
        v-for="(log, index) in logs"
      ></div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { Badge, Button } from 'element-ui'

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
    ...mapState(['activePan', 'logs']),
    isActivePan() {
      return this.activePan === 'console'
    }
  },
  methods: {
    ...mapActions(['clearLogs', 'setActivePan'])
  },
  components: {
    'el-badge': Badge,
    'el-button': Button
  }
}
</script>

<style lang="stylus" scoped>
.console-log {
  white-space: pre-wrap;
  padding: 10px;
}

.console-log-error {
  color: red;
}
</style>
