<template>
  <header class="home-header">
    <run-button />
    <autorun-button />
    <pan-toggles />
    <span class="home-header-left-item changelog-indicator" />
    <add-boilerplate />
    <add-library />
    <save-gist />
    <upload-options />
  </header>
</template>

<script>
import PanToggles from "@/components/header/PanToggles.vue";
import AddLibrary from "@/components/header/AddLibrary.vue";
import AddBoilerplate from "@/components/header/AddBoilerplate.vue";
import RunButton from "@/components/header/RunButton.vue";
import AutorunButton from "@/components/header/AutorunButton.vue";
import UploadOptions from "@/components/header/UploadOptions.vue";
import SaveGist from "@/components/header/SaveGist.vue";

export default {
  components: {
    AddLibrary,
    AddBoilerplate,
    PanToggles,
    RunButton,
    AutorunButton,
    UploadOptions,
    SaveGist,
  },
};
</script>

<style lang="stylus" scoped>
.home-header {
  font-family: Arial, sans-serif !important;
  background-color: white;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0;
  border-bottom: 1px solid silver;
  align-items: center;
  justify-content: center;

  .changelog-indicator {
    display: none;
  }
}

.home-header > * {
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>
