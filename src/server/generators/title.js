/**
 * Generates title output for the server
 *
 * @param  {'title'} type - the string "title"
 * @param  {String} data - the title text
 * @return {Object} - the title generator
 */
export default function titleGenerator (appId, { attribute } = {}, type, data) {
  return {
    text () {
      return `<${type}>${data}</${type}>`
    }
  }
}
