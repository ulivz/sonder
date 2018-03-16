const isOfType = type => x => typeof x === type // eslint-disable-line valid-typeof

export const isString = isOfType('string')
