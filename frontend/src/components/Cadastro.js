import React from "react";
import "../css/Cadastro.css";
import TopBar from "./TopBar";
import * as actions from "../store/actions/auth";
import { connect } from "react-redux";
import { FormHelperText } from "@material-ui/core";

function Cadastro(props) {
  const [Nome, setNome] = React.useState("");
  const [Sobrenome, setSobrenome] = React.useState("");
  const [Email, setEmail] = React.useState("");
  const [Senha1, setSenha1] = React.useState("");
  const [Senha2, setSenha2] = React.useState("");
  const [emailError, setemailError] = React.useState("");
  const [infoError, setinfoError] = React.useState(false);
  const [passwordEqualError, setpasswordEqualError] = React.useState(false);
  const [passwordNumError, setpasswordNumError] = React.useState(false);

  const handleSenha1 = (e) => {
    setSenha1(e.target.value);
  };

  const handleNome = (e) => {
    setNome(e.target.value);
  };

  const submitForm = (e) => {
    e.preventDefault(e);
    if (!infoError && !passwordEqualError && !passwordNumError && !emailError) {
      if (
        Nome !== "" &&
        Sobrenome !== "" &&
        Email !== "" &&
        Senha1 !== "" &&
        Senha2 !== ""
      ) {
        props.authSignup(Email, Senha1, Senha2, Nome, Sobrenome);
      } else {
        alert("Por favor, preencha todos os campos requisitados");
      }
    } else {
      alert("Por favor, altere os campos incorretamente preenchidos");
    }
  };

  const passwordValidator = (e) => {
    if (e.target.value === "") {
      if (e.target.parentElement.classList.contains("invalid")) {
        e.target.parentElement.classList.remove("invalid");
      }
      setpasswordEqualError(false);
      setpasswordNumError(false);
      return 0;
    }
    if (e.target.value !== Senha1) {
      setpasswordEqualError(true);
      if (!e.target.parentElement.classList.contains("invalid")) {
        e.target.parentElement.classList.add("invalid");
      }
    } else {
      setpasswordEqualError(false);
      if (Senha1.length < 8) {
        setpasswordNumError(true);
        if (!e.target.parentElement.classList.contains("invalid")) {
          e.target.parentElement.classList.add("invalid");
        }
      } else {
        setpasswordNumError(false);
        if (e.target.parentElement.classList.contains("invalid")) {
          e.target.parentElement.classList.remove("invalid");
        }
        setSenha2(e.target.value);
      }
    }
  };

  const infoValidator = (e) => {
    if (e.target.value === "") {
      if (e.target.parentElement.classList.contains("invalid")) {
        e.target.parentElement.classList.remove("invalid");
      }
      setinfoError(false);
      return 0;
    }
    if (e.target.value === Nome) {
      if (!e.target.parentElement.classList.contains("invalid")) {
        e.target.parentElement.classList.add("invalid");
        setinfoError(true);
      }
    } else {
      if (e.target.parentElement.classList.contains("invalid")) {
        e.target.parentElement.classList.remove("invalid");
        setinfoError(false);
      }
      setSobrenome(e.target.value);
    }
  };

  const emailValidator = (e) => {
    if (e.target.value === "") {
      if (e.target.parentElement.classList.contains("invalid")) {
        e.target.parentElement.classList.remove("invalid");
      }
      setemailError(false);
      return 0;
    }
    if (!e.target.value.includes(".") && !e.target.value.includes("@")) {
      setemailError(true);
      if (!e.target.parentElement.classList.contains("invalid")) {
        e.target.parentElement.classList.add("invalid");
      }
    } else {
      setemailError(false);
      if (e.target.parentElement.classList.contains("invalid")) {
        e.target.parentElement.classList.remove("invalid");
      }
      setEmail(e.target.value);
    }
  };

  React.useEffect(() => {
    // check if user is logged in
    if (props.isAuthenticated) {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const redirectPath = urlParams.get("from");
      if (redirectPath) {
        props.history.push("from");
      }
      props.history.push("/");
    }
  }, [props.error, props.isAuthenticated, props.history]);

  return (
    <>
      <TopBar backButtonPath="/" titlePath="/cadastro" pageTitle="Cadastro" />
      <div className="bolo-background-2">
        <div className="register-container">
          {props.loading ? (
            <div style={{ display: "grid", placeItems: "center" }}>
              <progress className="progress is-small is-dark" max="100">
                15%
              </progress>
            </div>
          ) : (
            <form onSubmit={submitForm} className="registration-form">
              {infoError ? (
                <span className="error">
                  Nome e Sobrenome não devem ser iguais
                </span>
              ) : null}

              <label className="col-one-half">
                <span style={{ fontSize: "18px" }} className="label-text">
                  Nome
                </span>
                <input
                  required
                  onBlur={handleNome}
                  autoComplete="none"
                  type="text"
                  name="firstName"
                />
              </label>
              <label className="col-one-half">
                <span style={{ fontSize: "18px" }} className="label-text">
                  Sobrenome
                </span>
                <input
                  required
                  onBlur={infoValidator}
                  autoComplete="none"
                  type="text"
                  name="lastName"
                />
              </label>
              {emailError ? (
                <span className="error">Por favor, insira um email válido</span>
              ) : null}
              <label>
                <span style={{ fontSize: "18px" }} className="label-text">
                  Email
                </span>
                <input
                  required
                  onBlur={emailValidator}
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
                  onBlur={handleSenha1}
                  autoComplete="none"
                  type="password"
                  name="senha1"
                ></input>
                <FormHelperText>
                  Sua senha deve ter no mínimo 8 caracteres
                </FormHelperText>
              </label>
              <label className="password">
                <span style={{ fontSize: "18px" }} className="label-text">
                  Confirmação de Senha
                </span>
                <span className="glyphicon glyphicon-eye-close"></span>
                <input
                  required
                  onBlur={passwordValidator}
                  autoComplete="none"
                  type="password"
                  name="senha2"
                ></input>
              </label>
              {props.error === null ? null : (
                <div>
                  <p
                    style={{
                      fontFamily: "Arial",
                      fontSize: "13px",
                      color: "red",
                    }}
                  >
                    Já existe um usuário cadastrado com este email!
                  </p>
                </div>
              )}
              {passwordEqualError ? (
                <div>
                  <span className="error">As senhas devem coincidir</span>
                </div>
              ) : null}
              {passwordNumError ? (
                <div>
                  <span className="error">
                    As senhas devem ter pelo menos 8 caracteres
                  </span>
                </div>
              ) : null}

              <div className="text-center mt-5">
                <button className="submit" name="register" type="submit">
                  Cadastrar
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
            <a href="/login" className=" mt-5 login-link">
              Já tem uma conta? Clique aqui para entrar!
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.token !== null,
    loading: state.loading,
    error: state.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    authSignup: (email, password1, password2, nome, sobrenome) =>
      dispatch(
        actions.authSignup(email, password1, password2, nome, sobrenome)
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Cadastro);
