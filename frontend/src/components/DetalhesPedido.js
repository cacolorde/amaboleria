import React from "react";
import axios from "axios";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import URL from "../api/api";
import {
  TableRow,
  TableCell,
  Collapse,
  IconButton,
  Box,
  Typography,
  TableHead,
  TableBody,
  Table,
} from "@material-ui/core";

function DetalhesPedido(props) {
  const [OrderItem, setOrderItem] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const tableHeadStyle = {
    fontWeight: "bold",
    fontSize: "16px",
  };

  React.useEffect(() => {
    axios
      .get(`${URL}/get-user-order-items`, {
        params: {
          transaction_id: props.transaction_id,
        },
        headers: { Authorization: `Token ${props.token}` },
      })
      .then((resp) => resp.data)
      .then((data) => {
        // console.log("OrderItem", data);
        setOrderItem(data);
      });
  }, [props.token, props.transaction_id]);
  var orderDate = new Date(props.order_date).toLocaleDateString("pt-BR");
  var deliveryDate = new Date(props.delivery_date).toLocaleDateString("pt-BR");
  return (
    <React.Fragment>
      <TableRow>
        <TableCell align="left">{props.transaction_id}</TableCell>
        <TableCell align="left">{orderDate}</TableCell>
        <TableCell align="right">{props.status}</TableCell>
        <TableCell align="right">{deliveryDate}</TableCell>
        <TableCell align="right">R${props.orderPrice.toFixed(2)}</TableCell>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Itens
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell style={tableHeadStyle}>Categoria</TableCell>
                    <TableCell style={tableHeadStyle}>Massa</TableCell>
                    <TableCell style={tableHeadStyle}>Recheios</TableCell>
                    <TableCell style={tableHeadStyle}>Cobertura</TableCell>
                    <TableCell style={tableHeadStyle} align="right">
                      Preço (R$)
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {OrderItem.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.categoria}</TableCell>
                      <TableCell>{item.massa}</TableCell>
                      <TableCell>{item.recheio}</TableCell>
                      <TableCell>{item.cobertura}</TableCell>
                      <TableCell align="right">
                        {item.itemPrice.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default DetalhesPedido;
