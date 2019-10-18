import * as actions from './actions'

export const initialState = {}

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.SIGNAL_FETCH_ALL_SUCCESS:
      return {
        ...state,
        all: action.payload.triggers
      }
    case actions.SIGNAL_CREATE_SUCCESS: {
      return {
        ...state,
        all: [...state.all, action.payload]
      }
    }
    case actions.SIGNAL_FETCH_HISTORY_POINTS:
      return {
        ...state,
        isLoading: true
      }
    case actions.SIGNAL_FETCH_HISTORY_POINTS_SUCCESS:
      return {
        ...state,
        ...action.payload,
        isLoading: false
      }
    case actions.SIGNAL_FETCH_HISTORY_POINTS_FAILED:
      return {
        ...initialState,
        isError: true,
        isLoading: false,
        error: { ...action.payload }
      }
    default:
      return state
  }
}
