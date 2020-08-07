import React from "react";
import "../css/Footer.css";
import { connect } from "react-redux";

const Footer = (props) => {
  return (
    <>
      {props.children}
      <div className="footer-bg">
        <div className="linha">
          <div className="coluna esq-c">
            <h3>AMA Boleria</h3>
            <div>
              <a href="/montagem">Monte seu Bolo</a>
            </div>
            <div>
              <a href="/nossos-bolos">Nossos Bolos</a>
            </div>
            <div>
              <a href="/quem-somos-nos">Quem somos nós</a>
            </div>
            <div>
              <a href="/contato">Contato</a>
            </div>
          </div>
          <div className="coluna meio-c">
            <h3>Redes Sociais</h3>
            <div>
              <a href="https://www.facebook.com/AMA-Boleria-1960490597599005/">
                Facebook
              </a>
            </div>
            <div>
              <a href="https://www.instagram.com/amaboleria/">Instagram</a>
            </div>
            <div>
              <a href="http://www.tinyurl.com/y94rj3mc">WhatsApp</a>
            </div>
          </div>
          <div className="coluna dir-c">
            <h3>Outros</h3>
            <div>
              <a href="https://github.com/cacolorde">Desenvolvedor</a>
            </div>
            <div>
              <a href="contato">Contato</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect()(Footer);
