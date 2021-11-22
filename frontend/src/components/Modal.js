import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import "./modal.css";

const Modal = ({ isShowing, hide, ...props }) =>

isShowing
? ReactDOM.createPortal(
    
    <>
         <div className="modal-overlay">
            <div className="modal-wrapper">
              <div className="modal">
                <div className="modal-header">
                  <h4 className="modal-title">Your email please:</h4>
                </div>
                <div className="modal-body">{props.children}</div>
              </div>
            </div>
          </div>
        

        </>,
        document.body
      )
    : null;

  Modal.propTypes = {
  isShowing: PropTypes.bool.isRequired,
  hide: PropTypes.func.isRequired

};

export default Modal;