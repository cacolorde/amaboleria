import * as actionTypes from "./actionTypes";
import axios from "axios";
import URL from "../../api/api";

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (token) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token: token,
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error,
  };
};

export const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("expirationDate");
  // localStorage.removeItem("cartItems");
  // localStorage.removeItem("expirationCartDate");
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const checkAuthTimeout = (expirationTime) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 3000);
  };
};

// LOGIN
export const authLogin = (email, password) => {
  return (dispatch) => {
    dispatch(authStart());
    axios
      .post(`${URL}/login/`, {
        username: email,
        password: password,
      })
      .then((res) => {
        const token = res.data.token;
        const expirationDate = new Date(new Date().getTime() + 3600 * 3000);
        // storing authentication in something that persist
        // because with redux or react state, when you
        // reload the page, the state is reset
        localStorage.setItem("token", token);
        localStorage.setItem("expirationDate", expirationDate);
        dispatch(authSuccess(token));
        dispatch(checkAuthTimeout(3600));
      })
      .catch((err) => {
        console.log(err);
        dispatch(authFail(err));
      });
  };
};

// CADASTRO
export const authSignup = (email, password1, password2, name, surname) => {
  return (dispatch) => {
    dispatch(authStart());
    axios
      .post(`${URL}/register/`, {
        email: email,
        password: password1,
        password2: password2,
        nome: name,
        sobrenome: surname,
      })
      .then((res) => {
        const token = res.data.token;
        const expirationDate = new Date(new Date().getTime() + 3600 * 3000);
        // storing authentication in something that persist
        // because with redux or react state, when you
        // reload the page, the state is reset
        localStorage.setItem("token", token);
        localStorage.setItem("expirationDate", expirationDate);
        dispatch(authSuccess(token));
        dispatch(checkAuthTimeout(3600));
      })
      .catch((err) => {
        dispatch(authFail(err));
      });
  };
};

// CHECAR ESTADO
export const authCheckState = () => {
  return (dispatch) => {
    const token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout);
    } else {
      const expirationDate = new Date(localStorage.getItem("expirationDate"));
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        dispatch(authSuccess(token));
        dispatch(
          checkAuthTimeout(
            (expirationDate.getTime() - new Date().getTime()) / 1000
          )
        );
      }
    }
  };
};

// CART HANDLERS

export const countCartItems = (cartItems) => {
  return {
    type: actionTypes.COUNT_CART_ITEMS,
    cartItemsCounter: cartItems === undefined ? null : cartItems.length,
  };
};

export const initializedCart = (cartItems) => {
  return {
    type: actionTypes.INIT_CART,
    cartItems: cartItems,
  };
};

export const addedToCart = (cartItems) => {
  return {
    type: actionTypes.ADD_TO_CART,
    cartItems: cartItems,
  };
};

export const deletedFromCart = (cartItems) => {
  return {
    type: actionTypes.DELETED_FROM_CART,
    cartItems: cartItems,
  };
};

export const deleteCart = () => {
  localStorage.removeItem("cartItems");
  localStorage.removeItem("expirationCartDate");
  return {
    type: actionTypes.DELETED_CART,
  };
};

export const checkCartTimeout = (expirationTime) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(deleteCart);
    }, expirationTime * 3000);
  };
};

export const addToCart = (categoria, massa, recheio, cobertura) => {
  return (dispatch) => {
    const newCartItem = {
      categoria: categoria,
      massa: massa,
      recheio: recheio,
      cobertura: cobertura,
    };
    const expirationCartDate = new Date(new Date().getTime() + 3600 * 3000);
    let cartItems = localStorage.getItem("cartItems");
    if (cartItems === undefined || cartItems === null) {
      dispatch(initializedCart(cartItems));
      cartItems = JSON.stringify([newCartItem]);
    } else {
      cartItems = JSON.parse(cartItems);
      cartItems.push(newCartItem);
      dispatch(addedToCart(cartItems));
      cartItems = JSON.stringify(cartItems);
    }
    localStorage.setItem("cartItems", cartItems);
    localStorage.setItem("expirationCartDate", expirationCartDate);
  };
};

export const deleteFromCart = (index) => {
  return (dispatch) => {
    let cartItems = JSON.parse(localStorage.getItem("cartItems"));
    cartItems.splice(index, 1);
    if (cartItems.length > 0) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      dispatch(deletedFromCart(cartItems));
    } else {
      deleteCart();
      countCartItems();
    }
  };
};

export const cartCheckState = () => {
  return (dispatch) => {
    let cartItems = localStorage.getItem("cartItems");
    if (cartItems === undefined) {
      dispatch(deleteCart());
    } else {
      const expirationCartDate = new Date(
        localStorage.getItem("expirationCartDate")
      );
      if (expirationCartDate <= new Date()) {
        dispatch(deleteCart());
      } else {
        dispatch(countCartItems(JSON.parse(cartItems)));
        dispatch(initializedCart(JSON.parse(cartItems)));
        dispatch(
          checkCartTimeout(
            (expirationCartDate.getTime() - new Date().getTime()) / 1000
          )
        );
      }
    }
  };
};
