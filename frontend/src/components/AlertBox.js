import React, { forwardRef, useImperativeHandle } from "react";
import "../css/AlertBox.css";

const AlertBox = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    showAlert: showAlert,
  }));

  const removeAlert = () => {
    var alert = document.getElementById(`alert-box-${props.id}`);
    alert.classList.remove("show");
    alert.classList.add("hide");
  };

  const showAlert = () => {
    var alert = document.getElementById(`alert-box-${props.id}`);
    alert.classList.remove("hide");
    alert.classList.add("show");
    if (!alert.classList.contains("showAlert")) {
      alert.classList.add("showAlert");
    }
    setTimeout(() => {
      if (
        alert.classList.contains("show") &&
        !alert.classList.contains("hide")
      ) {
        alert.classList.remove("show");
        alert.classList.add("hide");
      }
    }, 3500);
  };

  return (
    <div id={`alert-box-${props.id}`} className={`alert ${props.type} hide`}>
      <span>
        {props.type === "check" ? (
          <i className="fas fa-check-circle"></i>
        ) : (
          <i className="fas fa-times-circle"></i>
        )}
      </span>
      <span className={`msg ${props.type}`}>{props.msg}</span>
      <span onClick={removeAlert} className={`close-btn ${props.type}`}>
        <span>
          <i className={`fas fa-times ${props.type}`}></i>
        </span>
      </span>
    </div>
  );
});
export default AlertBox;
