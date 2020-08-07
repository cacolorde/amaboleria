import React, { useEffect } from "react";
import "../css/CarrinhoDeCompras.css";
import MainNavbar from "./Navbar";
import Carrinho from "./Carrinho";
import CheckoutEntrega from "./CheckoutEntrega";
import { connect } from "react-redux";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import URL from "../api/api";
import axios from "axios";
import {
  Grid,
  Container,
  Card,
  CardContent,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Typography,
} from "@material-ui/core";
import CheckoutPayment from "./CheckoutPayment";
import AlertBox from "./AlertBox";

const Checkout = (props) => {
  const Headers = { Authorization: `Token ${props.token}` };
  const [isLoading, setisLoading] = React.useState(false);
  const [success, setsuccess] = React.useState(false);

  // AlertBox
  const child1 = React.useRef();

  // user Data
  const [Data, setData] = React.useState([]);
  const [Price, setPrice] = React.useState([]);

  // payment - steps 2 b completed
  const [isDoneEntrega, setIsDoneEntrega] = React.useState(false);
  const [isPaymentDone, setIsPaymentDone] = React.useState(false);

  // CheckoutPayment Lifted States
  const [CardNumber, setCardNumber] = React.useState("");
  const [CardHolder, setCardHolder] = React.useState("");
  const [ExpirationYear, setExpirationYear] = React.useState("");
  const [ExpirationMonth, setExpirationMonth] = React.useState("");
  const [CCV, setCCV] = React.useState("");

  // const [CardToken, setCardToken] = React.useState("");
  const [CardBrand, setCardBrand] = React.useState("");
  const [CPF, setCPF] = React.useState("");

  // CheckoutEntrega Lifted States
  const [hasAddress, sethasAddress] = React.useState(false);
  const [entrega, setentrega] = React.useState("");
  const [useDbAddress, setuseDbAddress] = React.useState(true);
  const [saveDbAddress, setsaveDbAddress] = React.useState(false);
  const [OrderDescription, setOrderDescription] = React.useState("");
  const [DateError, setDateError] = React.useState("");
  const [selectedDate, setselectedDate] = React.useState(
    new Date(Date.now() + 3 * 86400000)
  );
  const [customAddress, setCustomAddress] = React.useState({
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cep: "",
  });

  const executePayment = () => {
    setisLoading(true);

    const transaction_id = (
      Math.floor(Math.random() * 900000000) + 100000000
    ).toString();

    var Address = useDbAddress
      ? {
          endereco: Data.endereco,
          numero: Data.numero,
          complemento: Data.complemento,
          bairro: Data.bairro,
          cep: Data.cep,
        }
      : {
          ...customAddress,
        };
    if (saveDbAddress) {
      axios
        .post(
          `${URL}/update-user-data/`,
          {
            ...customAddress,
          },
          {
            headers: Headers,
          }
        )
        .then((resp) => console.log(resp.data));
    }
    // dados para criação do objeto na database
    const orderObject = {
      customer: Data.id,
      order_date: new Date().toLocaleDateString("pt-BR"),
      delivery_date: selectedDate.toLocaleDateString("pt-BR"),
      status: "Aguardando Pagamento",
      transaction_id: transaction_id,
      delivery_method: entrega,
      orderPrice: Price.toFixed(2),
      order_description: OrderDescription,
      ...Address,
    };

    // dados para pagamento junto com provedor
    // const paymentObject = {
    //   MerchantOrderId: transaction_id,
    //   Customer: {
    //     Name: `${props.Data.nome} ${props.Data.sobrenome}`,
    //     Email: Data.email,
    //     Identity: CPF,
    //     IdentityType: "CPF",
    //   },
    // Payment: {
    //   Type: "CreditCard",
    //   Amount: Price * 100, //em centavos
    //   Installments: 1,
    //   SoftDescriptor: "AMA BOLERIA",
    //   CreditCard: {
    //     CardNumber: CardNumber,
    //     Holder: CardHolder,
    //     ExpirationDate: `${ExpirationMonth}/${ExpirationYear}`,
    //     SecurityCode: CCV,
    //     Brand: CardBrand,
    //     CardOnFile: {
    //       Usage: "First",
    //       // Reason: "Unscheduled",
    //     },
    //   },
    //   // IsCryptoCurrencyNegotiation: true,
    // },
    // };

    axios
      .post(
        `${URL}/create-order/`,
        {
          orderObject: orderObject,
          // paymentObject: paymentObject,
          cartItems: props.cartItems,
        },
        {
          headers: Headers,
        }
      )
      .then((resp) => resp.data)
      .then((data) => {
        setisLoading(false);
        setsuccess(true);
        child1.current.showAlert();
        setTimeout(() => {
          props.history.push("/minha-conta?from=orderCreated");
        }, 2250);
      });
  };

  // CheckoutEntrega State Functions
  const handleCustomAddress = (anchor) => (event) => {
    if (event.type === "onchange") {
      return;
    }
    if (anchor === "cep") {
      const logradouro = document.getElementById("logradouro");
      const bairro = document.getElementById("bairro");
      axios
        .get(`http://viacep.com.br/ws/${event.target.value}/json/`)
        .then((resp) => resp.data)
        .then((data) => {
          logradouro.value = data.logradouro;
          bairro.value = data.bairro;
          setCustomAddress({
            ...customAddress,
            cep: data.cep,
            endereco: logradouro.value,
            bairro: bairro.value,
          });
        });
    } else {
      setCustomAddress({ ...customAddress, [anchor]: event.target.value });
    }
  };

  const handleAdressAdvance = () => {
    setDateError("");
    if (entrega !== "") {
      if (entrega === "Retirar") {
        if (selectedDate.getDay() !== 0 && selectedDate.getDay() !== 6) {
          setIsDoneEntrega(true);
        } else {
          setDateError("Não há retiradas em fins de semana");
        }
      }
      if (entrega === "Entregar") {
        if (useDbAddress && hasAddress) {
          if (selectedDate.getDay() === 5) {
            setIsDoneEntrega(true);
          } else {
            setDateError("Entregamos somente as sextas");
          }
        } else {
          if (
            customAddress.endereco &&
            customAddress.numero &&
            customAddress.bairro &&
            customAddress.cep
          ) {
            if (selectedDate.getDay() === 5) {
              setIsDoneEntrega(true);
            } else {
              setDateError("Entregamos somente as sextas");
            }
          } else {
            alert("esqueceu de preencher algum campo");
          }
        }
      }
    }
  };

  const handleDateChange = (date) => {
    setselectedDate(date);
  };

  const handleEntrega = (e) => {
    setentrega(e.target.value);
  };

  const handleDbAddress = () => {
    setuseDbAddress(!useDbAddress);
  };

  const cardStyle = {
    backgroundColor: "#eccb93",
    border: "1px solid #000",
  };

  useEffect(() => {
    if (props.token) {
      axios
        .get(`${URL}/get-user-data/`, {
          headers: { Authorization: `Token ${props.token}` },
        })
        .then((resp) => resp.data)
        .then((data) => {
          setData(data);
          if (data.endereco && data.numero && data.bairro && data.cep) {
            sethasAddress(true);
          }
        });
    }
    if (entrega === "Entregar") {
      setPrice(props.subtotal + 15);
    } else {
      setPrice(props.subtotal);
    }
  }, [props.token, props.subtotal, entrega, Price]);

  return (
    <div className="hero is-fullheight bolo-background-4">
      <AlertBox
        id="1"
        ref={child1}
        msg="Seu pedido foi efetuado com sucesso!"
        type="check"
      />
      <MainNavbar />
      <div className="hero-body">
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card style={cardStyle}>
                <CardContent>
                  <h6 className="personal-data-title">Carrinho</h6>
                  <Carrinho
                    isCheckout={true}
                    isDelivery={entrega === "Entregar"}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                  <Accordion disabled={props.isAuthenticated} style={cardStyle}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      {props.isAuthenticated ? (
                        <>
                          <CheckCircleOutlineIcon className="mr-2" />
                          <Typography>Sessão Iniciada</Typography>
                        </>
                      ) : (
                        <>
                          <RadioButtonUncheckedIcon className="mr-2" />
                          <Typography>Iniciar Sessão</Typography>
                        </>
                      )}
                    </AccordionSummary>
                    <AccordionDetails>
                      <div className="flex-container-between">
                        <Button
                          href="/login?from=/checkout"
                          className="mr-2"
                          variant="outlined"
                          color="default"
                        >
                          <Typography>Entrar</Typography>
                        </Button>
                        <Button
                          href="/cadastro?from=/checkout"
                          variant="outlined"
                          color="default"
                        >
                          <Typography>Cadastrar</Typography>
                        </Button>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Accordion
                    disabled={
                      props.isAuthenticated
                        ? isDoneEntrega
                          ? true
                          : false
                        : true
                    }
                    expanded={
                      props.isAuthenticated
                        ? isDoneEntrega
                          ? false
                          : true
                        : false
                    }
                    style={cardStyle}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      {isDoneEntrega ? (
                        <>
                          <CheckCircleOutlineIcon className="mr-2" />
                          <Typography>Entrega Especificada</Typography>
                        </>
                      ) : (
                        <>
                          <RadioButtonUncheckedIcon className="mr-2" />
                          <Typography>Especificações de Entrega</Typography>
                        </>
                      )}
                    </AccordionSummary>
                    <AccordionDetails>
                      <CheckoutEntrega
                        setOrderDescription={setOrderDescription}
                        setselectedDate={setselectedDate}
                        handleDbAddress={handleDbAddress}
                        handleDateChange={handleDateChange}
                        handleEntrega={handleEntrega}
                        entrega={entrega}
                        selectedDate={selectedDate}
                        useDbAddress={useDbAddress}
                        {...Data}
                        hasAddress={hasAddress}
                        handleAdressAdvance={handleAdressAdvance}
                        handleCustomAddress={handleCustomAddress}
                        DateError={DateError}
                        saveDbAddress={saveDbAddress}
                        setsaveDbAddress={setsaveDbAddress}
                      />
                    </AccordionDetails>
                  </Accordion>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Accordion
                    disabled={
                      props.isAuthenticated
                        ? props.cartItems
                          ? isDoneEntrega
                            ? isPaymentDone
                              ? true
                              : false
                            : true
                          : true
                        : true
                    }
                    expanded={
                      props.isAuthenticated
                        ? props.cartItems
                          ? isDoneEntrega
                            ? isPaymentDone
                              ? false
                              : true
                            : false
                          : false
                        : false
                    }
                    style={cardStyle}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      {isPaymentDone ? (
                        <>
                          <CheckCircleOutlineIcon className="mr-2" />
                          <Typography>
                            Pagamento realizado! Esperando confirmação!
                          </Typography>
                          <Typography variant="subtitle1">
                            Mandaremos um email assim que seu pedido for
                            confirmado.
                          </Typography>
                        </>
                      ) : props.cartItems ? (
                        <>
                          <RadioButtonUncheckedIcon className="mr-2" />
                          <Typography>Informações de pagamento</Typography>
                        </>
                      ) : (
                        <>
                          <RadioButtonUncheckedIcon className="mr-2" />
                          <Typography>
                            Adicione itens ao carrinho para prosseguir
                          </Typography>
                        </>
                      )}
                    </AccordionSummary>
                    <AccordionDetails>
                      <CheckoutPayment
                        setCPF={setCPF}
                        setCardNumber={setCardNumber}
                        setCardHolder={setCardHolder}
                        setExpirationMonth={setExpirationMonth}
                        setExpirationYear={setExpirationYear}
                        setCCV={setCCV}
                        executePayment={executePayment}
                        isLoading={isLoading}
                        success={success}
                        setCardBrand={setCardBrand}
                        {...Data}
                      />
                    </AccordionDetails>

                    {/* CONSERTAR OVERFLOW QUANDO USAMOS O CELULAR */}
                  </Accordion>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    loading: state.loading,
    error: state.error,
    token: state.token,
    cartItems: state.cartItems,
    isAuthenticated: state.token !== null,
    subtotal:
      state.cartItems !== null
        ? state.cartItems
            .map((item, index) => {
              let price =
                item.recheio[2].length === 1
                  ? 160
                  : item.recheio[1].length === 1
                  ? 120
                  : item.recheio[0].length === 1
                  ? 80
                  : item.cobertura.length === 1
                  ? 60
                  : 45;
              return price;
            })
            .reduce((a, b) => a + b, 0)
        : null,
  };
};

export default connect(mapStateToProps)(Checkout);
