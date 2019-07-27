import { hasGlobalWindow } from '../utils/window'

const _global = hasGlobalWindow ? window : global

const console = (_global.console = _global.console || {})

export function warn (str) {
  /* istanbul ignore next */
  if (!console || !console.warn) {
    return
  }

  console.warn(str)
}

export const showWarningNotSupported = () => warn('This vue app/component has no vue-meta configuration')
