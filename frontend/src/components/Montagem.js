import React from "react";
import TopBar from "./TopBar";
import { CSSTransition } from "react-transition-group";
import "../css/Montagem.css";
import { connect } from "react-redux";
import * as actions from "../store/actions/auth";
import { withRouter } from "react-router-dom";
import AlertBox from "./AlertBox";

import PrincipalOpcaoMontagem from "./PrincipalOpcaoMontagem";
import premium from "../img/bolo3.jpg";
import caseiros from "../img/galeria/caseiros.jpg";
import massa_chocolate from "../img/massas/chocolate.jpg";
import massa_laranja from "../img/galeria/laranja.jpg";
import massa_cenoura from "../img/galeria/cen_bigp_bignut2.jpg";
import massa_amanteigada from "../img/massas/amanteigada.jpg";
import ComplementoOpcaoMontagem from "./ComplementoOpcaoMontagem";

class Montagem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categoria: "",
      massa: "",
      price: 0,
      recheio1: [],
      recheio2: [],
      recheio3: [],
      cobertura: [],
      comCobertura: false,
      modalIsOpen: false,
    };
    this.selectCategoria = this.selectCategoria.bind(this);
    this.selectMassa = this.selectMassa.bind(this);
    this.displayCobertura = this.displayCobertura.bind(this);
    this.handleCobertura = this.handleCobertura.bind(this);
    this.handleRecheio1 = this.handleRecheio1.bind(this);
    this.handleRecheio2 = this.handleRecheio2.bind(this);
    this.handleRecheio3 = this.handleRecheio3.bind(this);
    this.openModal = this.openModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.sendToCart = this.sendToCart.bind(this);
    this.child1 = React.createRef();
    this.child2 = React.createRef();
  }

  sendToCart = () => {
    this.props.addToCart(
      this.state.categoria,
      this.state.massa,
      [this.state.recheio1, this.state.recheio2, this.state.recheio3],
      this.state.cobertura
    );
    var modal = document.getElementById("resumo-modal");
    this.state.modalIsOpen
      ? modal.classList.remove("is-active")
      : modal.classList.add("is-active");
    this.setState({
      modalIsOpen: !this.state.modalIsOpen,
    });
    // this.props.history.push("/minha-conta");
    this.child1.current.showAlert();
    if (this.props.isAuthenticated) {
      setTimeout(() => {
        window.location.href = "/minha-conta";
      }, 2000);
    } else {
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  openModal = () => {
    if (this.state.comCobertura) {
      if (this.state.cobertura.length === 0) {
        alert("Você não selecionou sua cobertura!");
        return 0;
      }
      if (this.state.categoria !== "Linha Caseira - 24 cm") {
        if (this.state.recheio1.length === 0) {
          alert("Você não selecionou todos os seus recheios!");
          return 0;
        } else {
          if (this.state.categoria !== "Linha Premium - 15 cm") {
            if (this.state.recheio2.length === 0) {
              alert("Você não selecionou todos os seus recheios!");
              return 0;
            } else {
              if (this.state.categoria !== "Linha Premium - 17 cm") {
                if (this.state.recheio3.length === 0) {
                  alert("Você não selecionou todos os seus recheios!");
                  return 0;
                }
              }
            }
          }
        }
      }
    }
    var modal = document.getElementById("resumo-modal");
    this.state.modalIsOpen
      ? modal.classList.remove("is-active")
      : modal.classList.add("is-active");
    var price =
      this.state.recheio3.length === 1
        ? 160
        : this.state.recheio2.length === 1
        ? 120
        : this.state.recheio1.length === 1
        ? 80
        : this.state.cobertura.length === 1
        ? 60
        : 45;

    this.setState({
      modalIsOpen: !this.state.modalIsOpen,
      price: price,
    });
  };

  handleCobertura = (e) => {
    let objArr = this.state.cobertura;
    if (e.target.checked) {
      if (this.state.cobertura.length >= 1) {
        e.target.checked = false;
        this.child2.current.showAlert();
      } else {
        objArr.push(e.target.value);
      }
    } else {
      let index = objArr.indexOf(e.target.value);
      if (index > -1) {
        objArr.splice(index, 1);
      }
    }
    this.setState({
      cobertura: objArr,
    });
  };

  handleRecheio1 = (e) => {
    let objArr = this.state.recheio1;
    if (e.target.checked) {
      if (this.state.recheio1.length >= 1) {
        e.target.checked = false;
        this.child2.current.showAlert();
      } else {
        objArr.push(e.target.value);
      }
    } else {
      let index = objArr.indexOf(e.target.value);
      if (index > -1) {
        objArr.splice(index, 1);
      }
    }
    this.setState({
      recheio1: objArr,
    });
  };

  handleRecheio2 = (e) => {
    let objArr = this.state.recheio2;

    if (e.target.checked) {
      if (this.state.recheio2.length >= 1) {
        e.target.checked = false;
        this.child2.current.showAlert();
      } else {
        objArr.push(e.target.value);
      }
    } else {
      let index = objArr.indexOf(e.target.value);
      if (index > -1) {
        objArr.splice(index, 1);
      }
    }
    this.setState({
      recheio2: objArr,
    });
  };

  handleRecheio3 = (e) => {
    let objArr = this.state.recheio3;
    if (e.target.checked) {
      if (this.state.recheio3.length >= 1) {
        e.target.checked = false;
        this.child2.current.showAlert();
      } else {
        objArr.push(e.target.value);
      }
    } else {
      let index = objArr.indexOf(e.target.value);
      if (index > -1) {
        objArr.splice(index, 1);
      }
    }
    this.setState({
      recheio3: objArr,
    });
  };

  displayCobertura = (e) => {
    var buttonsCobertura = document.querySelectorAll("span.recheio-btn");

    if (e.target.classList.contains("selected")) {
      e.target.classList.remove("selected");
      this.setState({
        comCobertura: false,
      });
    } else {
      e.target.classList.add("selected");
      if (e.target.getAttribute("value") === "sim") {
        this.setState({
          comCobertura: true,
        });
      } else {
        this.setState({
          comCobertura: false,
        });
      }
    }
    for (var i = 0; i < buttonsCobertura.length; i++) {
      if (buttonsCobertura[i] !== e.target) {
        if (buttonsCobertura[i].classList.contains("selected")) {
          buttonsCobertura[i].classList.remove("selected");
        }
      }
    }
  };

  selectCategoria = (e) => {
    var figures = document.querySelectorAll("figure.categoria");

    var categoria = e.target.parentElement.getAttribute("value");

    if (e.target.parentElement.classList.contains("selected")) {
      // SE O ELEMENTO JA ESTA SELECIONADO
      e.target.parentElement.classList.remove("selected");
      for (var i = 0; i < figures.length; i++) {
        figures[i].classList.remove("not-selected");
      }

      this.setState({ categoria: "" });
    } else {
      // ELEMENTO NAO SELECIONADO (SELECIONA)
      e.target.parentElement.classList.add("selected");
      e.target.parentElement.classList.remove("not-selected");
      for (i = 0; i < figures.length; i++) {
        if (figures[i] !== e.target.parentElement) {
          if (figures[i].classList.contains("selected")) {
            figures[i].classList.remove("selected");
          }
          figures[i].classList.add("not-selected");
        }
      }
      if (categoria !== "Linha Caseira - 24 cm") {
        this.setState({
          comCobertura: true,
        });
      } else {
        this.setState({
          comCobertura: false,
        });
      }
      this.setState({
        categoria: categoria,
      });
      setTimeout(() => {
        var figuresMassa = document.querySelectorAll("figure.massa");

        // REMOVE A SELECAO DE MASSA
        figuresMassa[0].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 500);
    }
    var figuresMassa = document.querySelectorAll("figure.massa");
    figuresMassa.forEach((el) => {
      if (el.classList.contains("selected")) {
        el.classList.remove("selected");
      } else {
        el.classList.remove("not-selected");
      }
    });

    // DESLIZA A PAGINA

    var checkboxes = document.querySelectorAll("input");

    var buttonsCobertura = document.querySelectorAll("span.recheio-btn");

    // REMOVE A SELEÇÃO DE TOPPINGS
    checkboxes.forEach((el) => {
      el.checked = false;
    });

    // REMOVE A SELEÇÃO DE COBERTURA
    buttonsCobertura.forEach((el) => {
      if (el.classList.contains("selected")) {
        el.classList.remove("selected");
      }
    });

    this.setState({
      massa: "",
      cobertura: [],
      recheio1: [],
      recheio2: [],
      recheio3: [],
    });
  };

  selectMassa = (e) => {
    // console.log(e.target.parentElement);
    var figures = document.querySelectorAll("figure.massa");

    var massa = e.target.parentElement.getAttribute("value");

    var checkboxes = document.querySelectorAll("input");

    if (e.target.parentElement.classList.contains("selected")) {
      e.target.parentElement.classList.remove("selected");

      for (var i = 0; i < figures.length; i++) {
        figures[i].classList.remove("not-selected");
      }

      this.setState({ massa: "" });
    } else {
      e.target.parentElement.classList.add("selected");

      e.target.parentElement.classList.remove("not-selected");

      for (i = 0; i < figures.length; i++) {
        if (figures[i] !== e.target.parentElement) {
          if (figures[i].classList.contains("selected")) {
            figures[i].classList.remove("selected");
          }
          figures[i].classList.add("not-selected");
        }
      }

      this.setState({ massa: massa });

      // DESLIZA A PAGINA
      // setTimeout(() => {
      //   var checkboxes = document.querySelectorAll("input");
      //   checkboxes[0].scrollIntoView({
      //     behavior: "smooth",
      //     block: "start",
      //   });
      // }, 600);
    }

    // REMOVE A SELEÇÃO DE TOPPINGS
    checkboxes.forEach((el) => {
      el.checked = false;
    });
    this.setState({
      cobertura: [],
      recheio1: [],
      recheio2: [],
      recheio3: [],
    });
  };

  render() {
    const constCategoria = [
      {
        caption: "Linha Premium - 15 cm",
        caption2: "Massa, Recheio e Cobertura",
        src: premium,
        price: "R$ 80,00",
      },
      {
        caption: "Linha Premium - 17 cm",
        caption2: "Massa, 2 Recheios e Cobertura",
        src: premium,
        price: "R$ 120,00",
      },
      {
        caption: "Linha Premium - 20 cm",
        caption2: "Massa, 3 Recheios e Cobertura",
        src: premium,
        price: "R$ 160,00",
      },
      {
        caption: "Linha Caseira - 24 cm",
        caption2: "Massa e Cobertura Opcional",
        src: caseiros,
        price: "R$ 45,00",
      },
    ];

    const constMassa = [
      {
        caption: "Amanteigada",
        src: massa_amanteigada,
      },
      {
        caption: "Chocolate",
        src: massa_chocolate,
      },
      {
        caption: "Cenoura",
        src: massa_cenoura,
      },
      {
        caption: "Laranja",
        src: massa_laranja,
      },
    ];

    const constToppings = [
      {
        label: "Brigadeiro Preto",
      },
      {
        label: "Brigadeiro Branco",
      },
      {
        label: "Brigadeiro de Paçoca",
      },
      {
        label: "Brigadeiro de Nutella",
      },
      {
        label: "Brigadeiro de Queijo",
      },
      {
        label: "Brigadeiro de Laranja",
      },
      {
        label: "Doce de Leite",
      },
      {
        label: "Baba de Moça",
      },
      {
        label: "Goiabada",
      },
      {
        label: "Lemon Curd",
      },
      {
        label: "Beijinho",
      },
    ];

    return (
      <div className="montagem-outside-container">
        <TopBar
          titlePath="/montagem"
          pageTitle="Montando seu Bolo"
          backButtonPath="/"
        />
        <AlertBox
          id="1"
          type="check"
          msg="Bolo adicionado ao carrinho!"
          ref={this.child1}
        />
        <AlertBox
          type="wrong"
          id="2"
          msg="Voce já selecionou este item!"
          ref={this.child2}
        />
        <div
          style={{ backgroundColor: "#eccb93", height: "100%" }}
          className=" mt-5	"
        >
          <div className="subtitle-center">
            <h1 className="">
              Aqui você é que manda! Monte o bolo do seu jeito!
            </h1>
          </div>

          {/* SELECIONAR CATEGORIA */}
          <PrincipalOpcaoMontagem
            instructions="Comece escolhendo o modelo do seu bolo"
            parentCallBack={this.selectCategoria}
            options={constCategoria}
            classname="categoria"
          />

          {/* SELECIONAR MASSA */}
          <CSSTransition
            in={this.state.categoria !== ""}
            timeout={500}
            unmountOnExit
            classNames="animation-container-"
          >
            <PrincipalOpcaoMontagem
              id="selecionar-massa"
              parentCallBack={this.selectMassa}
              instructions="Agora escolha sua massa"
              options={constMassa}
              classname="massa"
              style={{}}
            />
          </CSSTransition>

          {/* DESEJA COBERTURA ?? */}
          <CSSTransition
            in={
              this.state.categoria === "Linha Caseira - 24 cm"
                ? this.state.massa === ""
                  ? false
                  : true
                : false
            }
            timeout={500}
            unmountOnExit
            classNames="animation-container-"
          >
            <div className="custom-container">
              <p id="selecione-cobertura" className="pl-3 mb-5 main-p">
                Deseja cobertura? (+15,00)
                <span
                  value="nao"
                  className="recheio-btn raise is-pulled-right"
                  onClick={this.displayCobertura}
                >
                  Não
                </span>
                <span
                  value="sim"
                  onClick={this.displayCobertura}
                  className="recheio-btn raise is-pulled-right"
                >
                  Sim
                </span>
              </p>
            </div>
          </CSSTransition>

          {/* COBERTURA */}
          <CSSTransition
            in={
              this.state.categoria !== ""
                ? this.state.massa !== ""
                  ? this.state.comCobertura
                    ? true
                    : false
                  : false
                : false
            }
            timeout={500}
            unmountOnExit
            classNames="animation-container-"
          >
            <ComplementoOpcaoMontagem
              style={{}}
              instructions="Selecione a Cobertura"
              parentCallBack={this.handleCobertura}
              options={constToppings}
              name="Cobertura"
            />
          </CSSTransition>

          {/* RECHEIO 1 */}
          <CSSTransition
            in={
              this.state.massa === ""
                ? false
                : this.state.categoria === "Linha Premium - 20 cm"
                ? true
                : this.state.categoria === "Linha Premium - 17 cm"
                ? true
                : this.state.categoria === "Linha Premium - 15 cm"
                ? true
                : false
            }
            timeout={500}
            unmountOnExit
            classNames="animation-container-"
          >
            <ComplementoOpcaoMontagem
              name="Recheio #1"
              style={{}}
              instructions="Selecione o primeiro recheio"
              parentCallBack={this.handleRecheio1}
              options={constToppings}
            />
          </CSSTransition>

          {/* RECHEIO 2 */}
          <CSSTransition
            in={
              this.state.massa === ""
                ? false
                : this.state.categoria === "Linha Premium - 20 cm"
                ? true
                : this.state.categoria === "Linha Premium - 17 cm"
                ? true
                : false
            }
            timeout={500}
            unmountOnExit
            classNames="animation-container-"
          >
            <ComplementoOpcaoMontagem
              name="Recheio #2"
              style={{}}
              instructions="Selecione o segundo recheio"
              parentCallBack={this.handleRecheio2}
              options={constToppings}
            />
          </CSSTransition>

          {/* RECHEIO 3 */}
          <CSSTransition
            in={
              this.state.massa === ""
                ? false
                : this.state.categoria === "Linha Premium - 20 cm"
                ? true
                : false
            }
            timeout={500}
            unmountOnExit
            classNames="animation-container-"
          >
            <ComplementoOpcaoMontagem
              name="Recheio #3"
              style={{}}
              instructions="Selecione o terceiro recheio"
              parentCallBack={this.handleRecheio3}
              options={constToppings}
            />
          </CSSTransition>

          <CSSTransition
            in={this.state.massa === "" ? false : true}
            timeout={500}
            unmountOnExit
            classNames="animation-container-"
          >
            <div className="custom-container level">
              <div className="level-item">
                <button onClick={this.openModal} className="button is-rounded">
                  <span>Resumo</span>
                </button>
              </div>
            </div>
          </CSSTransition>

          {/* RESUMO DO BOLO */}

          {this.state.massa === "" ? null : (
            <div id="resumo-modal" className="modal">
              <div className="modal-background"></div>
              <div className="modal-card">
                <header className="modal-card-head">
                  <h1 className="modal-card-title">
                    Características do seu Bolo
                  </h1>
                  <button
                    className="button is-rounded is-danger"
                    aria-label="close"
                    onClick={this.openModal}
                  >
                    <span className="icon icon-small">
                      <i className="fas fa-times"></i>
                    </span>
                  </button>
                </header>
                <section className="modal-card-body">
                  <div className="level">
                    <div className="level-item">
                      <table className="table is-fullwidth is-bordered">
                        <thead>
                          <tr>
                            <th>Características</th>
                            <th>Sabor</th>
                          </tr>
                        </thead>
                        <tfoot>
                          <tr>
                            <th>Preço</th>
                            <th>R$ {this.state.price.toFixed(2)}</th>
                          </tr>
                        </tfoot>
                        <tbody>
                          <tr>
                            <td>{this.state.categoria.split("-")[0]}</td>
                            <td>{this.state.categoria.split("-")[1]}</td>
                          </tr>
                          <tr>
                            <td>Massa</td>
                            <td>{this.state.massa}</td>
                          </tr>
                          {this.state.recheio1.length === 0 ? null : (
                            <tr>
                              <td>1º Recheio</td>
                              <td>{this.state.recheio1[0]}</td>
                            </tr>
                          )}
                          {this.state.recheio2.length === 0 ? null : (
                            <tr>
                              <td>2º Recheio</td>
                              <td>{this.state.recheio2[0]}</td>
                            </tr>
                          )}
                          {this.state.recheio3.length === 0 ? null : (
                            <tr>
                              <td>3º Recheio</td>
                              <td>{this.state.recheio3[0]}</td>
                            </tr>
                          )}
                          {this.state.cobertura.length === 0 ? null : (
                            <tr>
                              <td>Cobertura</td>
                              <td>{this.state.cobertura[0]}</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>
                <footer className="modal-card-foot level">
                  <div className="content level-item has-text-centered">
                    <button
                      onClick={this.sendToCart}
                      className="button is-rounded is-success"
                    >
                      <span>Adicionar ao carrinho</span>
                    </button>
                  </div>
                </footer>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

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
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Montagem)
);
