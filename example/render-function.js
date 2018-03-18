(function () {
  with (this) {
    return _h('div', {}, [" ", _h('div', { attrs: { "message": message } }, [_s(message)]), " ", _l((list), function (item, index) {
      return _h('a', {
        on: {
          "click": function ($event) {
            popMsg(item.text)
          }
        }
      }, [_s(index) + "、" + _s(item.text)])
    }), " ", _h('s-item', { attrs: { "message": message } }), " ", (first) ? _h('div', {}, ["first"]) : _h('div', {}, ["not"]), " "])
  }
})


(function () {
  with (this) {
    return _h('div', {}, ["\n      A custom " + _s(text) + " " + _s(message) + "! =>> ", _h('a', { on: { "click": changeText } }, ["change"])])
  }
})
