import React, { useRef } from "react";
import { connect } from "react-redux";
import MainNavbar from "./Navbar";
import * as actions from "../store/actions/auth";
import "../css/MinhaConta.css";
import axios from "axios";
import URL from "../api/api";
import Carrinho from "./Carrinho";
import MeusPedidos from "./MeusPedidos";
import PersonalRow from "./PersonalRow";
import { Redirect } from "react-router-dom";
import { Grid, Container, Card, CardContent } from "@material-ui/core";
import AlertBox from "./AlertBox";

export const MinhaConta = (props) => {
  const [Data, setData] = React.useState({});
  const [updateData, setUpdateData] = React.useState(false);
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const redirected_path = urlParams.get("from");
  // reference to AlertBox
  const childRef = useRef();

  const cardStyle = {
    backgroundColor: "#eccb93",
    border: "1px solid #000",
  };

  React.useEffect(() => {
    if (redirected_path === "orderCreated") {
      props.clearCart();
    }
    if (props.isAuthenticated === false) {
      props.history.push("/login");
    }
    if (props.token) {
      axios
        .get(`${URL}/get-user-data/`, {
          headers: { Authorization: `Token ${props.token}` },
        })
        .then((resp) => resp.data)
        .then((data) => setData(data));
    }
    if (updateData) {
      childRef.current.showAlert();
      setUpdateData(false);
    }
  }, [updateData, props, redirected_path]);

  return props.isAuthenticated ? (
    <section className="hero is-fullheight bolo-background-4">
      <AlertBox
        ref={childRef}
        id="1"
        type="check"
        msg="Alteração realizada com sucesso!"
      />
      <MainNavbar />
      <div className="hero-body">
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card style={cardStyle}>
                    <CardContent>
                      <h6 className="personal-data-title">Dados Pessoais</h6>
                      <PersonalRow
                        parentCallback={() => setUpdateData(!updateData)}
                        field="nome"
                        label="Nome"
                        value={Data.nome}
                      />
                      <PersonalRow
                        parentCallback={() => setUpdateData(!updateData)}
                        field="sobrenome"
                        label="Sobrenome"
                        value={Data.sobrenome}
                      />
                      <PersonalRow
                        parentCallback={() => setUpdateData(!updateData)}
                        field="email"
                        label="Email"
                        value={Data.email}
                      />
                      <PersonalRow
                        parentCallback={() => setUpdateData(!updateData)}
                        field="celular"
                        label="Celular"
                        value={Data.celular}
                      />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card style={cardStyle}>
                    <CardContent>
                      <h6 className="personal-data-title">
                        Endereço Cadastrado
                      </h6>
                      <PersonalRow
                        parentCallback={() => setUpdateData(!updateData)}
                        field="endereco"
                        label="Endereço"
                        value={Data.endereco}
                      />
                      <PersonalRow
                        parentCallback={() => setUpdateData(!updateData)}
                        field="numero"
                        label="Número"
                        value={Data.numero}
                      />

                      <PersonalRow
                        parentCallback={() => setUpdateData(!updateData)}
                        field="complemento"
                        label="Complemento"
                        value={Data.complemento}
                      />
                      <PersonalRow
                        parentCallback={() => setUpdateData(!updateData)}
                        field="bairro"
                        label="Bairro"
                        value={Data.bairro}
                      />
                      <PersonalRow
                        parentCallback={() => setUpdateData(!updateData)}
                        field="cep"
                        label="CEP"
                        value={Data.cep}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                  <Card className="" style={cardStyle}>
                    <h6 className="personal-data-title">Meus Pedidos</h6>
                    <MeusPedidos />
                  </Card>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={5}>
              <Card className="" style={cardStyle}>
                <CardContent>
                  <h6 className="personal-data-title">Carrinho</h6>
                  <Carrinho style={cardStyle} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </div>
    </section>
  ) : (
    <Redirect to="/login?from=/minha-conta" />
  );
};

const mapStateToProps = (state) => {
  return {
    loading: state.loading,
    error: state.error,
    token: state.token,
    cartItems: state.cartItems,
    isAuthenticated: state.token !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearCart: () => dispatch(actions.deleteCart()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MinhaConta);
