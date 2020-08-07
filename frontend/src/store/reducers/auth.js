import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  token: null,
  error: null,
  loading: false,
  cartItems: null,
  cartItemsCounter: null,
};

const authStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true,
  });
};

const authSuccess = (state, action) => {
  return updateObject(state, {
    token: action.token,
    error: null,
    loading: false,
  });
};

const authFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false,
  });
};

const authLogout = (state, action) => {
  return updateObject(state, {
    token: null,
  });
};

const initializedCart = (state, action) => {
  return updateObject(state, {
    cartItems: action.cartItems,
  });
};

const cartItemsCounter = (state, action) => {
  return updateObject(state, {
    cartItemsCounter: action.cartItemsCounter,
  });
};

const addedToCart = (state, action) => {
  return updateObject(state, {
    cartItems: action.cartItems,
  });
};

const deletedFromCart = (state, action) => {
  return updateObject(state, {
    cartItems: action.cartItems,
  });
};

const deleteCart = (state, action) => {
  return updateObject(state, {
    cartItems: null,
    cartItemsCounter: null,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return authStart(state, action);
    case actionTypes.AUTH_SUCCESS:
      return authSuccess(state, action);
    case actionTypes.AUTH_FAIL:
      return authFail(state, action);
    case actionTypes.AUTH_LOGOUT:
      return authLogout(state, action);
    case actionTypes.ADD_TO_CART:
      return addedToCart(state, action);
    case actionTypes.DELETED_CART:
      return deleteCart(state, action);
    case actionTypes.DELETED_FROM_CART:
      return deletedFromCart(state, action);
    case actionTypes.INIT_CART:
      return initializedCart(state, action);
    case actionTypes.COUNT_CART_ITEMS:
      return cartItemsCounter(state, action);
    default:
      return state;
  }
};

export default reducer;
