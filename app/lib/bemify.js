export default (component) => {
  return (str) => {
    if (!str) {
      return component
    } else if (str.startsWith('&')) {
      return `${component}__${str.substring(1)}`
    } else if (str.startsWith(':')) {
      return `${component}--${str.substring(1)}`
    } else {
      return str
    }
  }
}
