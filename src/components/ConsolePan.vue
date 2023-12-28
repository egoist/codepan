<template>
  <div
    class="console-pan"
    :class="{'active-pan': isActivePan}"
    @click="setActivePan('console')"
  >
    <div class="pan-head">
      <el-badge
        :value="logs.length"
        :max="99"
      >
        Console
      </el-badge>
      <el-button
        v-show="logs.length"
        icon="el-icon-delete"
        size="mini"
        @click="clearLogs"
      >
        Clear
      </el-button>
    </div>
    <div
      ref="console"
      class="console-logs"
    >
      <div
        v-for="(log, index) in logs"
        :key="index"
        class="console-log cm-s-default"
        :class="`console-log-${log.type}`"
        v-html="log.message"
      />
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
  font-family: monospace;
}

.console-log {
  white-space: pre-wrap;
  padding: 10px;
}

.console-log-error {
  color: red;
}
</style>
