import CustomStore from './custom'
import ErrorListStore from './error-list'
import ErrorPictureStore from './error-picture'
import PerfStore from './perf'

export const monitorRootStore = {
  customStore: CustomStore,
  errorListStore: ErrorListStore,
  errorPictureStore: ErrorPictureStore,
  perfStore: PerfStore,
}

