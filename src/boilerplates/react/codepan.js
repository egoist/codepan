class Timer extends React.Component {
  constructor(props) {
    super(props)
    this.state = { secondsElapsed: 0 }
  }

  tick() {
    this.setState(prevState => ({
      secondsElapsed: prevState.secondsElapsed + 1
    }))
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render() {
    return (
      <div>Seconds Elapsed: {this.state.secondsElapsed}</div>
    )
  }
}

ReactDOM.render(<Timer />, document.getElementById('app'))
