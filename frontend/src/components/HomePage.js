import React from "react";
import "../css/HomePage.css";
import MainNavbar from "./Navbar";

const HomePage = () => {
  return (
    <section className="hero is-fullheight bolo-background-1">
      <MainNavbar />
      <div className="hero-body">
        <div className="column is-one-third"></div>
        <div className="column is-one-third">
          <h1 className="title">Muito prazer!!!</h1>
          <p className="intro">
            os bolos da <span className="ama-boleria">ama boleria</span>{" "}
            chegaram para animar seus dias, aniversários e comemorações.
          </p>
          <p className="intro">perfeitos para qualquer evento.</p>
          <p className="intro">
            São feitos com os{" "}
            <span className="highlight">melhores ingredientes</span> e o mais
            importante:
          </p>
          <p className="intro">
            <strong>uma quantidade generosa de amor</strong>
          </p>

          <div id="button-column" className="column">
            <a href="/bolos" className="button is-centered is-large is-rounded">
              Conheça nossos bolos
            </a>
          </div>
          <div id="button-column" className="column">
            <a
              href="/montagem"
              className="button is-centered is-large is-rounded"
            >
              Monte seu bolo
            </a>
          </div>
          <div className="sm-flex-container mt-6 pt-6">
            <div className="sm-item">
              <a href="https://www.facebook.com/AMA-Boleria-1960490597599005/?ref=page_internal">
                <i className="fab fa-facebook fa-4x"></i>
              </a>
            </div>
            <div className="sm-item">
              <a href="https://www.instagram.com/amaboleria/">
                <i className="fab fa-instagram fa-4x"></i>
              </a>
            </div>
            <div className="sm-item">
              <a href="http://tinyurl.com/y94rj3mc">
                <i className="fab fa-whatsapp fa-4x"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="column is-one-third"></div>
      </div>
    </section>
  );
};

export default HomePage;
