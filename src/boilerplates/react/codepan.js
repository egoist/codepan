class App extends React.Component {
  state = {
    count: 0
  }

  inc = () => this.setState({
    count: this.state.count + 1
  })

  dec = () => this.setState({
    count: this.state.count - 1
  })

  render() {
    return (
      <div>
        <h2>{ this.state.count }</h2>
        <button onClick={this.inc}>Increment</button>
        <button onClick={this.dec}>Decrement</button>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
