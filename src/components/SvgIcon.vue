<script>
import { makeComponent } from 'vue-inline'

export default makeComponent({
  error: require('!raw-loader!../svg/alert.svg'),
  success: require('!raw-loader!../svg/check.svg'),
  loading: require('!raw-loader!../svg/loading.svg'),
  export: require('!raw-loader!../svg/export.svg')
})
</script>
