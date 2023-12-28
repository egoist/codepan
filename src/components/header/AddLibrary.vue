<template>
  <el-button
    v-if="!inIframe"
    class="home-header-left-item"
    icon="el-icon-notebook-2"
    @click="promptLibrary"
  >
    Add library
  </el-button>
</template>

<script>
import Event from '@/utils/event'
import { inIframe } from '@/utils'
import { Button, MessageBox } from 'element-ui'
import { mapActions } from 'vuex'

export default {
  components: {
    'el-button': Button
  },
  data() {
    return {
      inIframe
    }
  },
  methods: {
    ...mapActions(['updateCode']),
    async promptLibrary() {
      const { value } = await MessageBox.prompt(
        'Type an npm package name:',
        'Add Library',
        {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel'
        }
      )
      this.addLibrary(value)
    },
    async addLibrary(name) {
      if (name) {
        /* eslint-disable-next-line no-useless-escape */
        const code = `<script src="https://unpkg.com/${name}"><\/script>\n${
          this.$store.state.html.code
        }\n`
        await this.updateCode({ type: 'html', code })
        Event.$emit('refresh-editor')
      }
    }
  }
}
</script>
