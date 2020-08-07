import React from "react";
import axios from "axios";
import "../css/CheckoutPayment.css";
import URL from "../api/api";
import amex from "../img/card_flags/amex.png";
import aura from "../img/card_flags/aura.png";
import dinners from "../img/card_flags/dinners.png";
import discover from "../img/card_flags/discover.png";
import elo from "../img/card_flags/elo.png";
import hipercard from "../img/card_flags/hipercard.png";
import jcb from "../img/card_flags/jcb.png";
import mastercard from "../img/card_flags/mastercard.png";
import visa from "../img/card_flags/visa.png";
import { green } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import CheckIcon from "@material-ui/icons/Check";
import { connect } from "react-redux";
import {
  FormControl,
  TextField,
  FormHelperText,
  Button,
  CircularProgress,
} from "@material-ui/core";

const flags = [
  { file: amex, name: "amex" },
  { file: aura, name: "aura" },
  { file: dinners, name: "dinners" },
  { file: discover, name: "discover" },
  { file: elo, name: "elo" },
  { file: hipercard, name: "hipercard" },
  { file: jcb, name: "jcb" },
  { file: mastercard, name: "mastercard" },
  { file: visa, name: "visa" },
];

const useStyles = makeStyles((theme) => ({
  wrapper: {
    margin: theme.spacing(1),
    position: "relative",
  },
  buttonSuccess: {
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700],
    },
  },
  fabProgress: {
    color: green[500],
    position: "absolute",
    top: -6,
    left: -6,
    zIndex: 1,
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));

const CheckoutPayment = (props) => {
  const [CardError, setCardError] = React.useState(false);
  const classes = useStyles();

  const onCardNumberChange = (e) => {
    setCardError(false);
    // if (e.target.value.length === 6) {
    //   axios
    //     .get(`${URL}/card-bin-query/`, {
    //       headers: {
    //         Authorization: `Token ${props.token}`,
    //       },
    //       params: {
    //         cardBin: e.target.value,
    //       },
    //     })
    //     .then((resp) => resp.data)
    //     .then((data) => {
    //       props.setCardBrand(data.Provider);
    //       document.querySelectorAll("img").forEach((item, index) => {
    //         if (item.id === data.Provider) {
    //           item.style.border = "2px solid black";
    //           item.style.opacity = "1 ";
    //         } else {
    //           item.style.opacity = "0.5";
    //         }
    //       });
    //     })
    //     .catch((err) => {
    //       setCardError(true);
    //     });
    // } else if (e.target.value.length === 5) {
    //   document.querySelectorAll("img").forEach((item, index) => {
    //     item.style.border = "none";
    //     item.style.opacity = "1";
    //   });
    // }

    document.getElementById("card-number-1").innerHTML = e.target.value.slice(
      0,
      4
    );
    document.getElementById("card-number-2").innerHTML = e.target.value.slice(
      4,
      8
    );
    document.getElementById("card-number-3").innerHTML = e.target.value.slice(
      8,
      12
    );
    document.getElementById("card-number-4").innerHTML = e.target.value.slice(
      12,
      16
    );
    props.setCardNumber(e.target.value);
  };

  const onCardHolderChange = (e) => {
    if (e.target.value !== undefined) {
      document.getElementById("card-holder").innerHTML = e.target.value;

      props.setCardHolder(e.target.value);
    }
  };

  const onCCVChange = (e) => {
    document.getElementById("ccv").innerHTML = e.target.value;

    props.setCCV(e.target.value);
  };

  const onExpirationMonthChange = (e) => {
    document.getElementById(
      "card-expiration-month"
    ).innerHTML = `${e.target.value}/`;

    props.setExpirationMonth(e.target.value);
  };

  const onExpirationYearChange = (e) => {
    document.getElementById(
      "card-expiration-year"
    ).innerHTML = `${e.target.value}`;
    props.setExpirationYear(e.target.value);
  };

  const flipCard = () => {
    document.querySelector(".credit-card-box").classList.add("hover");
  };
  const unflipCard = () => {
    document.querySelector(".credit-card-box").classList.remove("hover");
  };

  return (
    <React.Fragment>
      <div className="checkout">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-evenly",
          }}
        >
          {flags.map((item, index) => {
            return (
              <img
                style={{
                  maxWidth: "25%",
                  width: "40px",
                }}
                id={item.name.toUpperCase()}
                key={index}
                alt={item.name.toUpperCase()}
                src={item.file}
              />
            );
          })}
        </div>
        <FormControl fullWidth>
          <TextField
            className="mt-2"
            label="CPF do proprietário"
            onChange={(e) => props.setCPF(e.target.value)}
            maxLength="11"
            helperText="Apenas números"
          />
          <TextField
            className="mt-2"
            label="Número do cartão"
            onChange={onCardNumberChange}
            helperText={CardError ? "Este cartão não é suportado" : null}
            error={CardError}
          />
          <TextField
            className="mt-2"
            label="Proprietário"
            onChange={onCardHolderChange}
          />
        </FormControl>
        <div style={{ display: "flex" }}>
          <div>
            <TextField
              className="mt-2 mr-5"
              label="Mês"
              type=""
              maxLength="2"
              onChange={onExpirationMonthChange}
            />
            <FormHelperText>Ex: 08</FormHelperText>
          </div>
          <div>
            <TextField
              className="mt-2 mr-5"
              label="Ano"
              type="number"
              maxLength="4"
              onChange={onExpirationYearChange}
            />
            <FormHelperText>Ex: 2027</FormHelperText>
          </div>
          <TextField
            onFocus={flipCard}
            onBlur={unflipCard}
            className="mt-2 mr-5"
            label="CCV"
            onChange={onCCVChange}
          />
        </div>
        <div
          style={{ display: "grid", placeItems: "center", marginTop: "2rem" }}
        >
          <div className={classes.wrapper}>
            <Button
              variant="contained"
              color="primary"
              onClick={props.executePayment}
              className={props.success ? classes.buttonSuccess : ""}
              disabled={props.isLoading ? true : props.success ? true : false}
            >
              {props.success ? <CheckIcon /> : props.isLoading ? "" : "Pagar"}
            </Button>
            {props.isLoading && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </div>
        </div>

        <div className="credit-card-box">
          <div className="flip">
            <div className="front">
              <div className="chip"></div>
              <div className="logo"></div>
              <div className="card-number">
                <label>Número do Cartão</label>
                <div className="card-number-flex">
                  <div id="card-number-1"></div>
                  <div id="card-number-2"></div>
                  <div id="card-number-3"></div>
                  <div id="card-number-4"></div>
                </div>
              </div>
              <div className="card-holder">
                <label>Proprietário do Cartão</label>
                <div id="card-holder"></div>
              </div>
              <div className="card-expiration-date">
                <label>Valido até</label>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div id="card-expiration-month"></div>
                  <div id="card-expiration-year"></div>
                </div>
              </div>
            </div>
            <div className="back">
              <div className="strip"></div>
              <div className="logo"></div>
              <div className="ccv">
                <label>CCV</label>
                <div id="ccv"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.token,
  };
};

export default connect(mapStateToProps)(CheckoutPayment);
