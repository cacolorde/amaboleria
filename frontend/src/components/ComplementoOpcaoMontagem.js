import React from "react";
import "../css/ComplementoOpcaoMontagem.css";

const ComplementoOpcaoMontagem = (props) => {
  return (
    <div style={props.style} className="custom-container">
      <p className="pl-3 mb-5 main-p">{props.instructions}</p>
      <ul className="ks-cboxtags">
        {props.options.map((option, index) => {
          return (
            <li key={index}>
              <input
                onClick={props.parentCallBack}
                defaultChecked={false}
                type="checkbox"
                id={`checkbox-${index}-${props.name}`}
                value={`${option.label}`}
              />
              <label htmlFor={`checkbox-${index}-${props.name}`}>
                {option.label}
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ComplementoOpcaoMontagem;
