// import { Evo as Sonder } from './evo'
import Sonder from '../src'

const Item = {

  data() {
    return {
      text: 'component'
    }
  },

  template: `<div>
      A custom {{text}} {{message}}! =>> <a @click="changeText">change</a>
  </div>`,

  methods: {
    changeText() {
      this.text = 'changed!'
    }
  }
}

new Sonder({
  components: {
    's-item': Item
  },
  beforeCreate () {
    console.log('beforeCreate')
  },
  el: '#app',
  template: `<div>
    <div :message="message">{{ message }}</div>
    <a v-for="(item,index) in list" @click="popMsg(item.text)">{{index}}、{{item.text}}</a>
    <s-item :message="message"></s-item>
    <div v-if="first">first</div>
    <div v-else>not</div>
  </div> `,
  data: {
    first: true,
    message: "Hello Evo!",
    list: [
      {
        text: "Im one"
      },
      {
        text: "Im two"
      }
    ]
  },
  methods: {
    popMsg(msg) {
      alert(msg)
    }
  }
})
