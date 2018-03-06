export default () => {
  return {
    js: {
      code: `
fn main() {
    println!("hi");
}`.trim(),
      transformer: 'rust'
    },
    showPans: ['js', 'console']
  }
}
