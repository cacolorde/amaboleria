import React, { useEffect } from "react";
import { connect } from "react-redux";
import { IconButton } from "@material-ui/core";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import * as actions from "../store/actions/auth";
import "../css/Carrinho.css";

const Carrinho = (props) => {
  // const [cartItems, setcartItems] = React.useState(0);

  const onDeleteCartItem = (e) => {
    let index = e.target.getAttribute("index");
    props.deleteFromCart(index);
    window.location.reload();
  };
  const onDeleteCart = (e) => {
    props.clearCart();
    window.location.reload();
  };

  // const handleCheckOut = (e) => {};

  var subtotal = props.isDelivery ? 15 : 0;

  useEffect(() => {
    if (props.liftPrice) {
      props.handlePrice(subtotal);
    }
    // setcartItems(props.cartItems);
  }, [props.handlePrice, subtotal, props.cartItems]);

  return props.cartItems === null || props.cartItems === undefined ? (
    <div className={props.fullHeight ? "flex-container-column-between" : ""}>
      <div className="carrinho-item">
        <div className="card-content">
          <p>Ops, parece que não há itens em seu carrinho!</p>
          <p>Você pode adicionar um modelo de bolo pronto aqui:</p>
          <a href="/bolos" className="button is-rounded no-item-link">
            Nossos Bolos
          </a>
          <p>Ou montar seu próprio bolo aqui:</p>
          <a href="/montagem" className="mt-2 button is-rounded no-item-link">
            Montar meu Bolo
          </a>
          <div></div>
        </div>
      </div>
    </div>
  ) : (
    <div className={props.fullHeight ? "flex-container-column-between" : ""}>
      <div className="cart-items-container">
        <div className="flex-container-between content-padding content mt-2 mb-1 labels-border">
          <h6>Produto</h6>
          <h6>Preço</h6>
        </div>
        {props.cartItems.map((item, index) => {
          let price =
            item.recheio[2].length === 1
              ? 160
              : item.recheio[1].length === 1
              ? 120
              : item.recheio[0].length === 1
              ? 80
              : item.cobertura.length === 1
              ? 60
              : 45;
          subtotal = subtotal + price;
          return (
            <div key={index}>
              <div id={index} className="carrinho-item">
                <div className="card-content-item">
                  <div className="flex-container-between">
                    <p>{item.categoria}</p>
                    <p className="item-price">R$ {price.toFixed(2)}</p>
                  </div>
                  <div className="flex-container-between">
                    <div className="flex-container-column">
                      <p className="item-description"> Massa: {item.massa}</p>
                      {item.cobertura.length === 1 ? (
                        <p className="item-description">
                          Cobertura: {item.cobertura[0]}
                        </p>
                      ) : null}
                      {item.recheio[2].length === 1 ? (
                        <p className="item-description">
                          Recheios:
                          {item.recheio[2][0]},{item.recheio[1][0]} e{" "}
                          {item.recheio[0][0]}
                        </p>
                      ) : item.recheio[1].length === 1 ? (
                        <p className="item-description">
                          Recheios:
                          {item.recheio[1][0]} e {item.recheio[0][0]}
                        </p>
                      ) : item.recheio[0].length === 1 ? (
                        <p className="item-description">
                          Recheios:
                          {item.recheio[0][0]}
                        </p>
                      ) : null}
                    </div>
                    <IconButton index={index} onClick={onDeleteCartItem}>
                      <HighlightOffIcon />
                    </IconButton>
                    {/* <button
                      index={index}
                      onClick={onDeleteCartItem}
                      className="button is-rounded is-danger"
                    >
                      <i index={index} className="fas fa-times"></i>
                    </button> */}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div>
        {props.isDelivery ? (
          <div className="flex-container-between content-padding">
            <p className="delivery-description">Entrega</p>
            <p className="delivery-description">R$ 15,00</p>
          </div>
        ) : null}
        <div className="flex-container-between content-padding content mt-2 mb-1">
          <h6>Subtotal</h6>
          <h6>R$ {subtotal.toFixed(2)}</h6>
        </div>
        {props.isCheckout ? null : (
          <div className="card-footer flex-container-between">
            <div className="center-top">
              <button
                onClick={onDeleteCart}
                className="button is-danger is-rounded is-full-width"
              >
                Limpar
              </button>
            </div>
            <div className="center-bottom">
              <a href="/checkout">
                <button className="button is-success is-rounded is-full-width">
                  Finalizar Compra
                </button>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    loading: state.loading,
    error: state.error,
    isAuthenticated: state.token !== null,
    cartItems: state.cartItems,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (categoria, massa, recheio, cobertura) =>
      dispatch(actions.addToCart(categoria, massa, recheio, cobertura)),
    deleteFromCart: (index) => dispatch(actions.deleteFromCart(index)),
    clearCart: () => dispatch(actions.deleteCart()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Carrinho);
