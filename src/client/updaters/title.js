/**
 * Updates the document title
 *
 * @param  {String} title - the new title of the document
 */
export default function updateTitle (title) {
  if (title === undefined) {
    return
  }

  document.title = title
}
