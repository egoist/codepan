const { createApp, h, ref } = Vue

const app = createApp({
  setup() {
    const count = ref(0)
    const inc = () => count.value++
    const dec = () => count.value--
    return {
      count,
      inc,
      dec
    }
  }
})

app.mount('#app')
