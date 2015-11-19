import {
  keys,
  clone,
  forEach,
  isEmpty,
  indexOf,
  capitalize
} from 'lodash'

const transformObject = (obj, lang) => {
  obj = clone(obj)
  let transformed = ''

  if (isEmpty(obj.metadata)) delete obj.metadata
  delete obj.uploader

  switch (lang) {
    case 'node': {
      const objKeys = keys(obj)
      transformed += '{\n'

      forEach(obj, (value, key) => {
        const isLast = indexOf(objKeys, key) === (objKeys.length - 1)
        transformed += `  ${key}: ${JSON.stringify(value)}`
        transformed += isLast ? '\n}' : ',\n'
      })

      return transformed
    }

    case 'python': {
      if (!isEmpty(obj.size)) {
        obj.sizes = [`${obj.size.width}x${obj.size.height}`]
      }

      delete obj.size

      const objKeys = keys(obj)
      transformed += '{\n'

      forEach(obj, (value, key) => {
        const isLast = indexOf(objKeys, key) === (objKeys.length - 1)
        transformed += `  ${key}: ${JSON.stringify(value)}`
        transformed += isLast ? '\n}' : ',\n'
      })

      return transformed
    }

    case 'ruby': {
      const objKeys = keys(obj)
      transformed += '{\n'

      forEach(obj, (value, key) => {
        const isLast = indexOf(objKeys, key) === (objKeys.length - 1)
        transformed += `  ${key}: ${JSON.stringify(value)}`
        transformed += isLast ? '\n}' : ',\n'
      })

      return transformed
    }

    case 'elixir': {
      const objKeys = keys(obj)
      transformed += '%{'

      forEach(obj, (value, key) => {
        const isLast = indexOf(objKeys, key) === (objKeys.length - 1)

        const currentValue = key === 'size'
          ? `%${JSON.stringify(value).replace(/\,/gim, ', ')}`
          : JSON.stringify(value)

        transformed += `${key}: ${currentValue}`
        transformed += isLast ? '}' : ', '
      })

      return transformed
    }

    case 'go': {
      const objKeys = keys(obj)

      if (!isEmpty(obj.size)) {
        obj.sizes = `${obj.size.width}x${obj.size.height}`
      }

      delete obj.size

      forEach(obj, (value, key) => {
        let currentValue
        const isLast = indexOf(objKeys, key) === (objKeys.length - 1)

        if (key === 'sizes') {
          currentValue = `[...]string{${JSON.stringify(value)}}`
        } else if (key === 'metadata') {
          currentValue = (
            `[...]string{${JSON.stringify(value).replace(/\[|\]/gim, '')}}`
          )
        } else {
          currentValue = `${JSON.stringify(value)}`
        }

        transformed += `  ${capitalize(key)}: ${currentValue},\n`
      })

      return transformed
    }


    case 'php': {
      const objKeys = keys(obj)
      transformed += '[\n'

      forEach(obj, (value, key) => {
        const isLast = indexOf(objKeys, key) === (objKeys.length - 1)
        const currentValue = key === 'size'
          ? JSON.stringify(value).replace(/\:/gim, ' => ')
          : JSON.stringify(value)

        transformed += `  ${key} => ${currentValue}`
        transformed += isLast ? '\n]' : ',\n'
      })

      return transformed
    }

    default: {
      return transformed
    }
  }
}

export default transformObject
