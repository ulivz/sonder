import observable from '../src/observer'

const meta = {
  name: 'ULIVZ',
  info: {
    age: '24',
    love: {
      writing: 'literature',
      coding: {
        js: '12',
        ts: '20'
      }
    }
  }
}

const ULIVZ = observable(meta)

ULIVZ
  .observe((key, newValue, oldValue) => {
    console.log(`${key} changed: From ${oldValue} to ${newValue}`)
  })
  .watch('name', (newValue, oldValue) => {
    console.log(`From ${oldValue} to ${newValue}`)
  })
  .watch('info.age', (newValue, oldValue) => {
    console.log(`From ${oldValue} to ${newValue}`)
  })
  .watch('info.love.writing', (newValue, oldValue) => {
    console.log(`From ${oldValue} to ${newValue}`)
  })

ULIVZ.name = 'XXX'
ULIVZ.info.age = 100
ULIVZ.info.love.writing = 'poetry'

