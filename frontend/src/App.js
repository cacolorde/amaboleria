import React from "react";
import "./css/App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "./store/actions/auth";
// component imports
import HomePage from "./components/HomePage";
import Bolos from "./components/Bolos";
import QuemSomosNos from "./components/QuemSomosNos";
import Montagem from "./components/Montagem";
import Cadastro from "./components/Cadastro";
import Login from "./components/Login";
import Footer from "./components/Footer";
import MinhaConta from "./components/MinhaConta";
import Checkout from "./components/Checkout";

class App extends React.Component {
  componentDidMount() {
    this.props.onTryAutoSignup();
    this.props.onTrySetCartItems();
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Switch>
            <Footer {...this.props}>
              <Route exact path="/" component={HomePage} />
              <Route exact path="/minha-conta" component={MinhaConta} />
              <Route exact path="/bolos" component={Bolos} />
              <Route exact path="/quem-somos-nos" component={QuemSomosNos} />
              <Route exact path="/montagem" component={Montagem} />
              <Route exact path="/cadastro" component={Cadastro} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/checkout" component={Checkout} />
            </Footer>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.token !== null,
    cartItems: state.cartItems,
    // loading: state.loading,
    // error: state.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
    onTrySetCartItems: () => dispatch(actions.cartCheckState()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
