import React from "react";
import "../css/Montagem.css";

const PrincipalOpcaoMontagem = (props) => {
  const sendData = (e) => {
    props.parentCallBack(e);
  };

  return (
    <div className="custom-container" style={props.style}>
      <p className="pl-3 mb-5 main-p">{props.instructions}</p>
      <ul className="gallery- caption-2">
        {props.options.map((option, index) => {
          return (
            <li key={index}>
              <figure
                className={props.classname}
                value={option.caption}
                onClick={sendData}
              >
                <img src={option.src} className="" alt="" />
                <figcaption className="main-caption">
                  {option.caption}
                </figcaption>
                <figcaption className="price-caption">
                  {option.price}
                </figcaption>
                {option.caption2 ? (
                  <figcaption className="descr-caption">
                    {option.caption2}
                  </figcaption>
                ) : (
                  <></>
                )}
              </figure>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PrincipalOpcaoMontagem;
