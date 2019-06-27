<template>
  <el-button
    v-if="!inIframe"
    class="home-header-left-item"
    icon="el-icon-notebook-2"
    @click="promptLibrary"
  >Add library</el-button>
</template>

<script>
import { inIframe } from '@/utils'
import { Button, MessageBox } from 'element-ui'
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      inIframe
    }
  },
  components: {
    'el-button': Button
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
        const code =
          `&lt;script src="https://unpkg.com/${name}">&lt;/script>\n`.replace(
            /&lt;/g,
            '<'
          ) + this.$store.state.html.code
        await this.updateCode({ type: 'html', code })
        Event.$emit('refresh-editor')
      }
    }
  }
}
</script>
