import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";

// open here is the prop which is a state which is set to true to open a modal from the outside
// onClose is a function which is called which sets the open state to false from the outside world (to make sure ESC Key can close the modal)
function Modal({ open, onClose, children, className = "" }) {
  const dialog = useRef();

  useEffect(() => {
    if (open) {
      dialog.current.showModal();
    } else {
      dialog.current.close();
    }
  }, [open]);

  return createPortal(
    <dialog className={`modal ${className}`} ref={dialog} onClose={onClose}>
      {children}
    </dialog>,
    document.getElementById("modal")
  );
}

export default Modal;
