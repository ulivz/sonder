# sonder-observer

## Usage

```js
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

ULIVZ.name = 'XXX' // From ULIVZ to XXX
ULIVZ.info.age = 100 // From 24 to 100
ULIVZ.info.love.writing = 'poetry' // From literature to poetry
```


## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D


## Author

**sonder** © [ulivz](https://github.com/ULIVZ), Released under the [MIT](../../LICENSE) License.<br>
Authored and maintained by ulivz with help from contributors ([list](https://github.com/ULIVZ/sonder/contributors)).

> [github.com/ulivz](https://github.com/ulivz) · GitHub [@ulivz](https://github.com/ULIVZ)
