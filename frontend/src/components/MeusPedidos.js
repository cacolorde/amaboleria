import React from "react";
import { connect } from "react-redux";
import DetalhesPedido from "./DetalhesPedido";
import axios from "axios";
import URL from "../api/api";
import {
  Table,
  TableContainer,
  Card,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
} from "@material-ui/core";

function MeusPedidos(props) {
  const [Orders, setOrders] = React.useState([]);
  const tableHeadStyle = {
    fontWeight: "bold",
    fontSize: "16px",
  };

  React.useEffect(() => {
    axios
      .get(`${URL}/get-user-orders/`, {
        headers: { Authorization: `Token ${props.token}` },
      })
      .then((resp) => resp.data)
      .then((data) => {
        // console.log(data);
        setOrders(data);
      });
  }, [props.token]);

  return (
    <TableContainer component={Card}>
      <Table style={{ backgroundColor: "#eccb93" }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell style={tableHeadStyle} align="left">
              Código
            </TableCell>
            <TableCell style={tableHeadStyle} align="left">
              Data do Pedido
            </TableCell>
            <TableCell style={tableHeadStyle} align="right">
              Status
            </TableCell>
            <TableCell style={tableHeadStyle} align="right">
              Data de Entrega
            </TableCell>
            <TableCell style={tableHeadStyle} align="right">
              Preço
            </TableCell>
            <TableCell align="right" />
          </TableRow>
        </TableHead>
        <TableBody>
          {Orders.map((order) => (
            <DetalhesPedido
              key={order.transaction_id}
              {...order}
              token={props.token}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const mapStateToProps = (state) => {
  return {
    token: state.token,
    isAuthenticated: state.token !== null,
  };
};

export default connect(mapStateToProps)(MeusPedidos);
