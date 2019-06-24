<template>
  <header class="home-header">
    <run-button/>
    <autorun-button/>
    <pan-toggles/>
    <span class="home-header-left-item changelog-indicator"></span>
    <add-boilerplate/>
    <add-library/>
    <save-gist/>
    <upload-options/>
  </header>
</template>

<script>
import PanToggles from '@/components/header/PanToggles'
import AddLibrary from '@/components/header/AddLibrary'
import AddBoilerplate from '@/components/header/AddBoilerplate'
import RunButton from '@/components/header/RunButton'
import AutorunButton from '@/components/header/AutorunButton'
import UploadOptions from '@/components/header/UploadOptions'
import SaveGist from '@/components/header/SaveGist'

export default {
  components: {
    AddLibrary,
    AddBoilerplate,
    PanToggles,
    RunButton,
    AutorunButton,
    UploadOptions,
    SaveGist
  }
}
</script>

<style lang="stylus" scoped>
.home-header {
  font-family: Arial, sans-serif !important;
  border-bottom: 1px solid #bfbfbf;
  background-color: white;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 0;
  justify-content: space-between;

  .changelog-indicator {
    display: none;
  }
}

.home-header > * {
  flex-grow: 1;
  flex-shrink: 1;
  text-align: center;
}
</style>
