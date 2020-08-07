import React, { useRef } from "react";
import { withRouter } from "react-router-dom";
import "../css/MainNavbar.css";
import { connect } from "react-redux";
import * as actions from "../store/actions/auth";

import Badge from "@material-ui/core/Badge";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import CartDrawer from "./CartDrawer";

const StyledBadge = withStyles(() => ({
  badge: {
    right: -3,
    top: 13,
    backgroundColor: "#f68d00",
    border: `2px solid #eccb93`,
    padding: "0 4px",
  },
}))(Badge);

const MainNavbar = (props) => {
  const { pathname } = props.location;
  const [isOpen, setOpen] = React.useState(false);
  const childRef = useRef();

  const openCart = () => {
    childRef.current.toggleCart();
  };

  const handleLogout = () => {
    props.logout();
    alert("Você finalizou sua sessão com sucesso");
    props.history.push("/login");
  };

  const openModal = () => {
    let modal = document.getElementById("confirm-logout");
    if (!modal.classList.contains("is-active")) {
      modal.classList.add("is-active");
    } else {
      modal.classList.remove("is-active");
    }
  };

  return (
    <div className="hero-head">
      <header className="navbar">
        <div className="container">
          <div className="navbar-brand">
            <a href="/" className="navbar-item">
              <div className="logo-title">
                <span className="logo-title-1">AMA</span>
                <span className="logo-title-2">boleria</span>
              </div>
            </a>
            <div className="sm-flex-container-nav">
              <div className="sm-item-nav">
                <a href="https://www.facebook.com/AMA-Boleria-1960490597599005/photos/a.2552982351683157/2569402406707818">
                  <i className="fab fa-facebook fa-2x"></i>
                </a>
              </div>
              <div className="sm-item-nav">
                <a href="https://www.instagram.com/amaboleria/">
                  <i className="fab fa-instagram fa-2x"></i>
                </a>
              </div>
              <div className="sm-item-nav">
                <a href="https://tinyurl.com/y94rj3mc">
                  <i className="fab fa-whatsapp fa-2x"></i>
                </a>
              </div>
            </div>
            <span
              className="navbar-burger burger"
              id="burguer"
              data-target="#navbarMenuHeroC"
              onClick={() => setOpen(!isOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>
          <div
            style={isOpen ? { backgroundColor: "lightgrey" } : {}}
            id="navbarMenuHeroC"
            className={isOpen ? "navbar-menu is-active" : "navbar-menu"}
          >
            <div className="navbar-end">
              <a
                href="/"
                className={
                  pathname === "/"
                    ? "navbar-item has-text-centered is-active"
                    : "navbar-item has-text-centered"
                }
              >
                Início
              </a>
              <a
                href="/bolos"
                className={
                  pathname.includes("/bolos")
                    ? "navbar-item has-text-centered is-active"
                    : "navbar-item has-text-centered"
                }
              >
                Nossos Bolos
              </a>
              <a
                href="/montagem"
                className={
                  pathname.includes("/montagem")
                    ? "navbar-item has-text-centered is-active"
                    : "navbar-item has-text-centered"
                }
              >
                Montar Meu Bolo
              </a>
              <a
                href="quem-somos-nos"
                className={
                  pathname.includes("/quem-somos-nos")
                    ? "navbar-item has-text-centered is-active"
                    : "navbar-item has-text-centered"
                }
              >
                Quem somos nós?
              </a>
              {props.isAuthenticated ? (
                <>
                  <a
                    href="/minha-conta"
                    className="navbar-item has-text-centered"
                  >
                    Minha Conta
                  </a>
                  <span
                    onClick={openModal}
                    className="navbar-item has-text-centered"
                  >
                    Encerrar Sessão
                  </span>
                </>
              ) : (
                <>
                  <a href="/cadastro" className="navbar-item has-text-centered">
                    Cadastrar
                  </a>
                  <a href="/login" className="navbar-item has-text-centered">
                    Entrar
                  </a>
                </>
              )}

              <div className="navbar-item has-text-centered scale-cart">
                <IconButton onClick={openCart} aria-label="cart">
                  <StyledBadge badgeContent={props.cartItemsCounter}>
                    <ShoppingCartIcon />
                  </StyledBadge>
                </IconButton>
                <CartDrawer ref={childRef} />
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="modal" id="confirm-logout">
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">
              Confirmação de encerramento de sessão
            </p>
            <button
              className="delete"
              aria-label="close"
              onClick={openModal}
            ></button>
          </header>
          <section className="modal-card-body">
            <p style={{ fontFamily: "Arial" }}>
              Você está prestes a encerrar sua sessão, deseja continuar?
            </p>
          </section>
          <footer
            style={{ display: "flex", justifyContent: "space-evenly" }}
            className="modal-card-foot"
          >
            <div>
              <button onClick={openModal} className="button is-rounded">
                Cancelar
              </button>
              <button onClick={handleLogout} className="button is-rounded">
                Encerrar Sessão
              </button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.token !== null,
    cartItemsCounter: state.cartItemsCounter,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(actions.logout()),
  };
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MainNavbar)
);
