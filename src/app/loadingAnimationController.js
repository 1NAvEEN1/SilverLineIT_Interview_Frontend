import { hideLoading, setMessage, showLoading } from "../reducers/loaderSlice"
import store from "./store"

export const showLoadingAnimation = ({message})=>{
    store.dispatch(showLoading({
        isVisible: true,
        message
      }))
}

export const hideLoadingAnimation = ()=>{
    store.dispatch(hideLoading());
}

export const changeMessage = ({message})=>{
    store.dispatch(setMessage(message));
}