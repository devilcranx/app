import * as actions from './actions'

export const initialState = {
  isLoading: false,
  error: false,
  data: undefined,
  slug: ''
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.SOCIALVOLUME_DATA_FETCH:
      return {
        ...state,
        isLoading: true
      }
    case actions.SOCIALVOLUME_DATA_FETCH_SUCCESS:
      return {
        ...state,
        ...action.payload,
        isLoading: false,
        error: false
      }
    case actions.SOCIALVOLUME_DATA_FETCH_FAILED:
      return {
        isLoading: false,
        error: true,
        data: []
      }

    default:
      return state
  }
}
