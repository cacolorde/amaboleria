import React from "react";
import EditIcon from "@material-ui/icons/Edit";
import CloseIcon from "@material-ui/icons/Close";
import CheckIcon from "@material-ui/icons/Check";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import { connect } from "react-redux";
import URL from "../api/api";
import axios from "axios";

const PersonalRow = (props) => {
  const [isEditable, setIsEditable] = React.useState(false);
  const [InputValue, setInputValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isInvalid, setIsInvalid] = React.useState(false);

  const saveHandler = (e) => {
    setIsInvalid(false);
    setIsLoading(true);
    axios
      .post(
        `${URL}/get-user-data/`,
        {
          field: props.field,
          value: InputValue,
        },
        {
          headers: { Authorization: `Token ${props.token}` },
        }
      )
      .then((resp) => {
        if (resp.status === 202) {
          setIsEditable(false);
          setIsLoading(false);
          props.parentCallback();
        }
      })
      .catch((err) => {
        setIsInvalid(true);
        setIsLoading(false);
      });
  };

  const defaultRender = (props) => {
    return (
      <div className="flex-container-between">
        <p className="personal-data">
          {props.label}: <b>{props.value}</b>
        </p>
        <IconButton
          onClick={() => setIsEditable(true)}
          aria-label="editar"
          size="small"
        >
          <EditIcon fontSize="inherit" />
        </IconButton>
      </div>
    );
  };

  const editableRender = (props) => {
    return (
      <div className="flex-container-between mt-2">
        <div>
          <TextField
            id="standard-text"
            label={props.label}
            type="text"
            onChange={(e) => setInputValue(e.target.value)}
            defaultValue={props.value}
            helperText={
              isInvalid
                ? "O texto inserido era inválido"
                : props.field === "celular"
                ? "Ex: 975344318"
                : props.field === "CEP"
                ? "Ex: 22222222"
                : null
            }
            error={isInvalid}
          />
          <IconButton
            className="mt-3"
            onClick={saveHandler}
            aria-label="salvar"
            size="medium"
          >
            <CheckIcon fontSize="inherit" />
          </IconButton>
          <IconButton
            className="mt-3"
            onClick={() => setIsEditable(false)}
            aria-label="cancelar"
            size="medium"
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </div>
      </div>
    );
  };

  return isLoading ? (
    <CircularProgress color="secondary" />
  ) : isEditable ? (
    editableRender(props)
  ) : (
    defaultRender(props)
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.token,
  };
};

export default connect(mapStateToProps)(PersonalRow);
