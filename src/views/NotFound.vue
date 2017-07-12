<template>
  <div class="page not-found">
    <h1>404</h1>
    <p>
      <router-link to="/" class="go-home">Return to Home Page</router-link>
    </p>
  </div>
</template>

<script>
import progress from 'nprogress'

export default {
  beforeRouteEnter(from, to, next) {
    next(() => {
      progress.done()
    })
  }
}
</script>

<style lang="stylus" scoped>
.not-found
  display: flex
  align-items: center
  justify-content: center
  flex-direction: column

  h1
    font-size: 6rem
    font-weight: 300
    margin: 0 0 40px 0

  .go-home
    color: #666
    text-decoration: none
    border: 1px solid #e2e2e2
    padding: 10px 20px
    border-radius: 4px
    font-size: 1.4rem
    &:hover
      background: #f0f0f0
</style>

