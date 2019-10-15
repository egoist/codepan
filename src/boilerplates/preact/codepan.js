/* @jsx h */
const { h, render } = preact
const { useState } = preactHooks

const App = () => {
  const [count, setCount] = useState(0)

  const inc = () => setCount(count + 1)

  const dec = () => setCount(count - 1)

  return (
    <div>
      <h2>{count}</h2>
      <button onClick={inc}>Increment</button>
      <button onClick={dec}>Decrement</button>
    </div>
  )
}

render(<App />, document.body)
