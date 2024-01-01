<template>
  <el-checkbox v-if="!inIframe" border :value="autoRun" @change="setAutoRun">
    Auto-run
  </el-checkbox>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import { Checkbox } from "element-ui";
import { inIframe } from "@/utils";

export default {
  data() {
    return {
      inIframe,
    };
  },
  computed: {
    ...mapState(["autoRun"]),
    ...mapGetters(["isLoggedIn", "canUpdateGist"]),
  },
  methods: {
    ...mapActions(["setAutoRun"]),
  },
  components: {
    "el-checkbox": Checkbox,
  },
};
</script>
