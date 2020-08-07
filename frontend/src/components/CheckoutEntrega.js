import React from "react";
import { connect } from "react-redux";
import DateFnsUtils from "@date-io/date-fns";
import deLocale from "date-fns/locale/pt-BR";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import {
  InputLabel,
  MenuItem,
  FormHelperText,
  FormControl,
  Select,
  Checkbox,
  FormControlLabel,
  Typography,
  TextField,
  Button,
} from "@material-ui/core";

export const CheckoutEntrega = (props) => {
  // const [entrega, setentrega] = React.useState("");
  // const [useDbAddress, setuseDbAddress] = React.useState(true);
  // const [selectedDate, setselectedDate] = React.useState(new Date());

  const disable48hrsDates = (date) => {
    var min = new Date(Date.now() + 2 * 86400000);
    return date - min < 0;
  };

  const onlyFriday = (date) => {
    if (date.getDay() !== 5) {
      return true;
    }
    return disable48hrsDates(date);
  };
  const disableWeekends = (date) => {
    return (
      date.getDay() === 0 || date.getDay() === 6 || disable48hrsDates(date)
    );
  };

  const renderAddressForm = () => {
    return (
      <>
        <TextField
          className="mt-2"
          label="CEP"
          onBlur={props.handleCustomAddress("cep")}
          type="number"
          placeholder="Ex: 22222222"
        />
        <TextField
          className="mt-2"
          id="logradouro"
          label="Endereço"
          onChange={props.handleCustomAddress("endereco")}
          placeholder="Ex: Av. das Américas"
        />
        <TextField
          className="mt-2"
          label="Número"
          onChange={props.handleCustomAddress("numero")}
          type="number"
          placeholder="Ex: 900"
        />
        <TextField
          className="mt-2"
          label="Complemento"
          onChange={props.handleCustomAddress("complemento")}
          placeholder="Ex: Apartamento xxxx Bloco xxxx"
        />

        <TextField
          className="mt-2"
          label="Bairro"
          onChange={props.handleCustomAddress("bairro")}
          id="bairro"
        />
        <TextField
          className="mt-2"
          label="Cidade"
          value="Rio de Janeiro"
          disabled
        />
        <TextField
          className="mt-2"
          label="Observações"
          multiline
          rows={2}
          onChange={(e) => props.setOrderDescription(e.target.value)}
        />
        <FormControlLabel
          value={props.saveDbAddress}
          control={
            <Checkbox
              checked={props.saveDbAddress}
              onChange={(e) => props.setsaveDbAddress(!props.saveDbAddress)}
              color="primary"
            />
          }
          label="Salvar como seu endereço cadastrado?"
          labelPlacement="end"
        />
      </>
    );
  };

  return (
    <React.Fragment>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-helper-label">
          Retirar ou Entregar (R$ 15,00)?
        </InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={props.entrega}
          onChange={props.handleEntrega}
        >
          <MenuItem value="Entregar">Entregar</MenuItem>
          <MenuItem value="Retirar">Retirar</MenuItem>
        </Select>
        <FormHelperText>Selecione a forma de entrega</FormHelperText>

        {props.entrega === "" ? null : props.entrega === "Entregar" ? (
          // ESCOLHEU ENTREGAR
          props.hasAddress ? (
            // TEM ENDERECO CADASTRADO
            <FormControl>
              {props.useDbAddress ? (
                <React.Fragment>
                  <Typography variant="subtitle1" className="mt-1">
                    Seu endereço cadastrado:
                  </Typography>
                  <Typography variant="caption" className="mt-1">
                    {props.endereco}, {props.numero}
                  </Typography>
                  <Typography variant="caption">{props.complemento}</Typography>
                  <Typography variant="caption">
                    {props.bairro} - {props.cep}
                  </Typography>
                </React.Fragment>
              ) : (
                <FormControl>{renderAddressForm()}</FormControl>
              )}
              <FormControlLabel
                value={props.useDbAddress}
                control={
                  <Checkbox
                    checked={props.useDbAddress}
                    onChange={props.handleDbAddress}
                    color="primary"
                  />
                }
                label="Utilizar endereço cadastrado?"
                labelPlacement="end"
              />
            </FormControl>
          ) : (
            // NÃO TEM ENDERECO CADASTRADO
            <FormControl fullWidth>{renderAddressForm()}</FormControl>
          )
        ) : // ESCOLHEU RETIRAR
        null}
        <MuiPickersUtilsProvider locale={deLocale} utils={DateFnsUtils}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="dd/MM/yyyy"
            margin="normal"
            label={
              props.entrega === "Entregar"
                ? "Data de Entrega"
                : "Data de Retirada"
            }
            value={props.selectedDate}
            onChange={props.handleDateChange}
            // disablePast
            shouldDisableDate={
              props.entrega === "Entregar" ? onlyFriday : disableWeekends
            }
            error={props.DateError !== ""}
            helperText={props.DateError === "" ? null : props.DateError}
          />
          <FormHelperText>
            Retiradas somente em dias úteis e Entregas às Sextas
          </FormHelperText>
        </MuiPickersUtilsProvider>
        {props.entrega === "Retirar" ? (
          <FormHelperText className="mt-3">
            Enviaremos para o email cadastrado nosso endereço de retirada após
            confirmação do pagamento.
          </FormHelperText>
        ) : null}
        <Button onClick={props.handleAdressAdvance} variant="contained">
          Avançar
        </Button>
      </FormControl>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutEntrega);
