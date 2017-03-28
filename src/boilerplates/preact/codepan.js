/* @jsx h */
const { Component, h, render } = preact

const githubStars = repo => fetch(`https://api.github.com/repos/${repo}`)
  .then(res => res.json())
  .then(res => res.stargazers_count)

class Stars extends Component {
  async componentDidMount() {
    const stars = await githubStars(this.props.repo)
    this.setState({ stars })
  }
  render({ repo }, { stars = 0 }) {
    const url = `//github.com/${repo}`
    return (
            <a href={url} class="stars">
                ⭐️ {stars} Stars
            </a>
    )
  }
}

render(<Stars repo="developit/preact" />, document.body)
