import React from "react";
import TopBar from "./TopBar";
import "../css/Cadastro.css";
import { connect } from "react-redux";
import * as actions from "../store/actions/auth";
import { Redirect, withRouter } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";

function Login(props) {
  const [Senha, setSenha] = React.useState("");
  const [Email, setEmail] = React.useState("");
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const redirect_path = urlParams.get("from");

  const submitForm = (e) => {
    e.preventDefault();
    props.onAuth(Email, Senha);
  };

  let errorMessage = null;
  if (props.error) {
    errorMessage = (
      <div style={{ display: "grid", placeItems: "center" }}>
        <p style={{ fontFamily: "Arial", color: "red", fontSize: "13px" }}>
          Usuário e/ou senha incorretos
        </p>
      </div>
    );
  }

  React.useEffect(() => {
    if (props.isAuthenticated) {
      if (redirect_path) {
        props.history.push(redirect_path);
      } else {
        props.history.push("/minha-conta");
      }
    }
  }, [props.isAuthenticated, props.history, redirect_path]);

  return props.isAuthenticated ? (
    <Redirect to="/minha-conta" />
  ) : (
    <>
      <TopBar backButtonPath="/" titlePath="/login" pageTitle="Entrar" />

      <div className="bolo-background-2">
        <div className="register-container">
          {props.loading ? (
            <div style={{ display: "grid", placeItems: "center" }}>
              <CircularProgress size={60} />
            </div>
          ) : (
            <form onSubmit={submitForm} className="registration-form">
              <label>
                <span style={{ fontSize: "18px" }} className="label-text">
                  Email
                </span>
                <input
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="none"
                  type="email"
                  name="email"
                />
              </label>
              <label className="password">
                <span style={{ fontSize: "18px" }} className="label-text">
                  Senha
                </span>
                <input
                  required
                  onChange={(e) => setSenha(e.target.value)}
                  autoComplete="none"
                  type="password"
                  name="senha1"
                ></input>
              </label>
              {errorMessage}
              <div className="text-center mt-5">
                <button
                  onClick={submitForm}
                  className="submit"
                  name="register"
                  type="submit"
                >
                  Entrar
                </button>
              </div>
              <input
                type="text"
                autoComplete="on"
                value=""
                style={{
                  display: "none",
                  opacity: 0,
                  position: "absolute",
                  left: "-100000px",
                }}
                readOnly={true}
              />
            </form>
          )}
          <div className="grid-center">
            <a href="/reset_password" className=" mt-5 login-link">
              Esqueceu sua senha? Clique aqui para alterá-la
            </a>
          </div>
          <div className="grid-center">
            <a href="/cadastro" className="  login-link">
              Não tem uma conta? Clique aqui para se cadastrar!
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    loading: state.loading,
    error: state.error,
    isAuthenticated: state.token !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (email, password) => dispatch(actions.authLogin(email, password)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
