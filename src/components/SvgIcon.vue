<script>
import { makeComponent } from 'vue-inline'

export default makeComponent({
  error: require('!raw-loader!../svg/alert.svg'),
  success: require('!raw-loader!../svg/check.svg'),
  loading: require('!raw-loader!../svg/loading.svg'),
  code: require('!raw-loader!../svg/code.svg'),
})
</script>
