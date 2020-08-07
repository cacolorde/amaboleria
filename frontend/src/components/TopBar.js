import React from "react";
import "../css/TopBar.css";
import { withRouter } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { connect } from "react-redux";
import Badge from "@material-ui/core/Badge";
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

const TopBar = (props) => {
  const childRef = React.useRef();

  const openCart = () => {
    childRef.current.toggleCart();
  };

  return (
    <div>
      <div className="topbar">
        <div className="navbar-item has-text-centered scale-cart">
          <IconButton href="/" aria-label="cart">
            <ArrowBackIcon />
          </IconButton>
        </div>
        <a href={props.titlePath}>
          <button className="title-btn">
            <h3 className="title">{props.pageTitle}</h3>
          </button>
        </a>
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
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.token !== null,
    cartItemsCounter: state.cartItemsCounter,
  };
};

export default withRouter(connect(mapStateToProps)(TopBar));
