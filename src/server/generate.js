import getMetaInfo from '../shared/getMetaInfo'
import { serverSequences } from '../shared/escaping'
import { setOptions } from '../shared/options'
import generateServerInjector from './generateServerInjector'

export default function generate (rawInfo, options = {}) {
  const metaInfo = getMetaInfo(setOptions(options), rawInfo, serverSequences)

  const serverInjector = generateServerInjector(options, metaInfo)
  return serverInjector.injectors
}
