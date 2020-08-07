import React, { forwardRef, useImperativeHandle } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Drawer, Typography } from "@material-ui/core";
import Carrinho from "./Carrinho";

const useStyles = makeStyles({
  paperAnchorRight: {
    backgroundColor: "#eccb93",
    maxWidth: "300px",
  },
});

const CartDrawer = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    toggleCart: toggleCart,
  }));

  const [openCart, setOpenCart] = React.useState(false);

  const classes = useStyles();
  const toggleCart = () => {
    setOpenCart(!openCart);
  };

  return (
    <Drawer
      classes={{ paperAnchorRight: classes.paperAnchorRight }}
      anchor="right"
      open={openCart}
      onClose={toggleCart}
    >
      <div
        style={{
          backgroundColor: "#f86d00",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Typography variant="h5">Meu Carrinho</Typography>
      </div>
      <div>
        <Carrinho fullHeight={true} />
      </div>
    </Drawer>
  );
});

export default CartDrawer;
