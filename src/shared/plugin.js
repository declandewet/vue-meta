import assign from 'object-assign'
import $meta from './$meta'
import batchUpdate from '../client/batchUpdate'

import {
  VUE_META_KEY_NAME,
  VUE_META_ATTRIBUTE,
  VUE_META_SERVER_RENDERED_ATTRIBUTE,
  VUE_META_TAG_LIST_ID_KEY_NAME
} from './constants'

// automatic install
if (typeof Vue !== 'undefined') {
  Vue.use(VueMeta)
}

/**
 * Plugin install function.
 * @param {Function} Vue - the Vue constructor.
 */
export default function VueMeta (Vue, options = {}) {
  // set some default options
  const defaultOptions = {
    keyName: VUE_META_KEY_NAME,
    attribute: VUE_META_ATTRIBUTE,
    ssrAttribute: VUE_META_SERVER_RENDERED_ATTRIBUTE,
    tagIDKeyName: VUE_META_TAG_LIST_ID_KEY_NAME
  }
  // combine options
  options = assign(defaultOptions, options)

  // bind the $meta method to this component instance
  Vue.prototype.$meta = $meta(options)

  // store an id to keep track of DOM updates
  let batchID = null

  // watch for client side component updates
  Vue.mixin({
    beforeCreate () {
      // Add a marker to know if it uses metaInfo
      if (typeof this.$options[options.keyName] !== 'undefined') {
        this._hasMetaInfo = true
      }
      // coerce function-style metaInfo to a computed prop so we can observe
      // it on creation
      if (typeof this.$options[options.keyName] === 'function') {
        if (typeof this.$options.computed === 'undefined') {
          this.$options.computed = {}
        }
        this.$options.computed.$metaInfo = this.$options[options.keyName]
      }
    },
    created () {
      // if computed $metaInfo exists, watch it for updates & trigger a refresh
      // when it changes (i.e. automatically handle async actions that affect metaInfo)
      // credit for this suggestion goes to [Sébastien Chopin](https://github.com/Atinux)
      if (this.$metaInfo) {
        this.$watch('$metaInfo', () => {
          // batch potential DOM updates to prevent extraneous re-rendering
          batchID = batchUpdate(batchID, () => this.$meta().refresh())
        })
      }
    },
    // Into the cache component will trigger this hook, the current cache components, access to configuration parameters
    activated () {
      if (this._hasMetaInfo) {
        batchID = batchUpdate(batchID, () => this.$meta().refresh())
      }
    },
    beforeMount () {
      // batch potential DOM updates to prevent extraneous re-rendering
      if (this._hasMetaInfo) {
        batchID = batchUpdate(batchID, () => this.$meta().refresh())
      }
    },
    destroyed () {
      // do not trigger refresh on the server side
      if (this.$isServer) return
      // re-render meta data when returning from a child component to parent
      if (this._hasMetaInfo) {
        batchID = batchUpdate(batchID, () => this.$meta().refresh())
      }
    }
  })
}
