import React, { useRef } from "react";
import TopBar from "./TopBar";
import "../css/Bolos.css";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import * as actions from "../store/actions/auth";
import AlertBox from "./AlertBox";
// import $ from "jquery";

//images
import bolo1 from "../img/galeria/choc_beij_docleit.jpg";
import bolo4 from "../img/bolo-pacoca.jpg";
import bolo5 from "../img/galeria/amant_brig_queijo_goi.jpg";
import bolo6 from "../img/galeria/mant_moca_choc.jpg";
import bolo7 from "../img/galeria/mant_lemoncurd.jpg";
import bolo8 from "../img/galeria/cen_bigp_bignut.jpg";
import bolo9 from "../img/galeria/amendoim.jpg";
import bolo10 from "../img/galeria/laranja.jpg";
import bolo11 from "../img/galeria/cen_formig.jpg";
import bolo12 from "../img/galeria/amant_moca_choc.jpg";
import bolo13 from "../img/galeria/cen_bigp_bignut2.jpg";
import bolo14 from "../img/galeria/fuba_erva.png";

const Bolos = (props) => {
  // call a children method from parent component
  const childRef = useRef();

  //add to cart
  const handleAddToCart = (e) => {
    let dataTarget = document.getElementById(e.target.getAttribute("index"));
    let recheio = JSON.parse(dataTarget.getAttribute("recheio"));
    let cobertura = dataTarget.getAttribute("cobertura");
    let massa = dataTarget.getAttribute("massa");
    let categoria =
      recheio[0].length === 0
        ? "Linha Caseira - 24 cm"
        : recheio[1].length === 0
        ? "Linha Premium - 15 cm"
        : recheio[2].length === 0
        ? "Linha Premium - 17 cm"
        : "Linha Premium - 20 cm";
    console.log(recheio);
    console.log(cobertura);
    console.log(massa);
    console.log(categoria);
    props.addToCart(categoria, massa, recheio, [cobertura]);
    childRef.current.showAlert();
    // setTimeout();
  };

  //image data
  const caseiroCakes = [
    {
      bolo: bolo9,
      massa: "Amendoim",
      recheio: [[], [], []],
      cobertura: "Sem cobertura",
      linha: "Linha Caseira - 24 cm",
    },
    {
      bolo: bolo11,
      massa: "Cenoura Formigueiro",
      recheio: [[], [], []],
      cobertura: "Sem cobertura",
      linha: "Linha Caseira - 24 cm",
    },
    {
      bolo: bolo10,
      massa: "Laranja",
      recheio: [[], [], []],
      cobertura: "Sem cobertura",
      linha: "Linha Caseira - 24 cm",
    },
    {
      bolo: bolo14,
      massa: "Fubá com Erva Doce",
      recheio: [[""], [""], [""]],
      cobertura: "Sem cobertura",
      linha: "Linha Caseira - 24 cm",
    },
  ];
  const premiumCakes = [
    {
      bolo: bolo1,
      massa: "Chocolate",
      recheio: [["Beijinho"], ["Doce de Leite"], []],
      cobertura: "Doce de Leite",
      linha: "Premium",
    },
    {
      bolo: bolo5,
      massa: "Amanteigada",
      recheio: [["Brigadeiro de queijo"], [], []],
      cobertura: "Goiabada",
      linha: "Premium",
    },

    {
      bolo: bolo7,
      massa: "Amanteigada",
      recheio: [["Leite Moça"], [], []],
      cobertura: "Lemon Crud",
      linha: "Premium",
    },
    {
      bolo: bolo4,
      massa: "Chocolate",
      recheio: [["Brigadeiro Branco"], ["Beijinho"], []],
      cobertura: "Brigadeiro de Paçoca",
      linha: "Premium",
    },
    {
      bolo: bolo6,
      massa: "Amanteigada",
      recheio: [["Beijinho"], [], []],
      cobertura: "Brigadeiro de Preto",
      linha: "",
    },
    {
      bolo: bolo12,
      massa: "Amanteigada",
      recheio: [["Leite Moça"], [], []],
      cobertura: "Chocolate",
      linha: "Premium",
    },

    {
      bolo: bolo8,
      massa: "Cenoura",
      recheio: [["Brigadeiro preto"], ["Brigadeiro de nutella"], []],
      cobertura: "Nutella",
      linha: "Premium",
    },
    {
      bolo: bolo13,
      massa: "Cenoura",
      recheio: [["Brigadeiro preto"], ["Brigadeiro de nutella"], []],
      cobertura: "Nutella",
      linha: "Premium",
    },
  ];

  return (
    <div className="bolo-body">
      <AlertBox
        id="1"
        type="check"
        ref={childRef}
        msg="Bolo adicionado ao carrinho"
      />
      <div>
        <TopBar
          titlePath="/bolos"
          pageTitle="Nossos Bolos"
          backButtonPath="/"
        />
      </div>
      <div className="custom-container">
        <p className="pl-3 mb-5 main-p">Linha Premium</p>
        <ul className="gallery caption-2">
          {premiumCakes.map((item, index) => {
            return (
              <li
                id={`premium-${index}`}
                key={index}
                massa={item.massa}
                recheio={JSON.stringify(item.recheio)}
                cobertura={item.cobertura}
                linha={item.linha}
              >
                <figure>
                  <img src={item.bolo} alt={item.bolo} />
                  <figcaption className="main-caption">
                    {/* <p>Linha: {item.linha}</p> */}
                    <p>Massa: {item.massa}</p>
                    <p>
                      Recheios:
                      {item.recheio.map((rech, index) => {
                        if (rech === undefined) {
                          return null;
                        }
                        if (item.recheio[index + 1] === undefined) {
                          return ` ${rech}`;
                        } else {
                          if (item.recheio[index + 1].length === 0) {
                            return ` ${rech}`;
                          }
                          return ` ${rech} -`;
                        }
                      })}
                    </p>
                    <p>Cobertura: {item.cobertura}</p>
                  </figcaption>

                  <button
                    onClick={handleAddToCart}
                    style={{ cursor: "pointer" }}
                  >
                    <figcaption
                      index={`premium-${index}`}
                      className="addToCartCaption"
                    >
                      <i
                        index={`premium-${index}`}
                        className="fas fa-cart-plus"
                      ></i>
                    </figcaption>
                  </button>
                </figure>
              </li>
            );
          })}
        </ul>
        <p className="pl-3 mb-5 main-p">Linha Caseira</p>
        <ul className="gallery caption-2">
          {caseiroCakes.map((item, index) => {
            return (
              <li
                id={`caseiro-${index}`}
                key={index}
                massa={item.massa}
                recheio={JSON.stringify(item.recheio)}
                cobertura={item.cobertura}
                linha={item.linha}
              >
                <figure>
                  <img src={item.bolo} alt={item.bolo} />
                  <figcaption className="main-caption">
                    {/* <p>Linha: {item.linha}</p> */}
                    <p>Massa: {item.massa}</p>
                    <p>Cobertura: {item.cobertura}</p>
                  </figcaption>

                  <button
                    onClick={handleAddToCart}
                    style={{ cursor: "pointer" }}
                  >
                    <figcaption
                      index={`caseiro-${index}`}
                      className="addToCartCaption"
                    >
                      <i
                        index={`caseiro-${index}`}
                        className="fas fa-cart-plus"
                      ></i>
                    </figcaption>
                  </button>
                </figure>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    loading: state.loading,
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Bolos));
