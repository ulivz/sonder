export default class Sonder {
  constructor({ el, render }) {
    this.el = el
    render(this.h.bind(this))
    this.intialized = false
  }

  h(Component) {
    const vm = this.vm = new Component()
    this.raw = vm.render()

    if (!this.intialized) {
      Object.keys(vm.state).forEach((key) => {
        let value = vm.state[key]
        let privateKey = `_${key}`
        vm[privateKey] = value
        Object.defineProperty(vm.state, key, {
          get () {
            return vm[privateKey];
          },
          set: (newValue) => {
            vm[privateKey] = newValue;
            this.render()
          },
          enumerable: true,
          configurable: true
        })
      })
      this.intialized = true
    }
    this.render()
  }

  render() {
    let vm = this.vm
    const out = this.raw
      .replace(/{{([^{}]*)}}/g, (match, item) => {
        const key = item.trim()
        if (vm.state[key] !== undefined) {
          return vm.state[key]
        }
        return vm[key]
      })

    document.querySelector(this.el).innerHTML = out
    document.querySelectorAll('[click]').forEach((node) => {
      let clickValue = node.getAttribute('click')
      if (clickValue) {
        node.addEventListener('click', vm[clickValue].bind(vm), false)
      }
    })
  }
}
