import { useContext, useEffect, useState } from "react";
import Modal from "./UI/Modal";
import { CartContext } from "../store/CartContext";
import currencyFormatter from "../util/currencyFormatter";
import { UserProgressContext } from "../store/UserProgressContext";
import Button from "./UI/Button";

const TIMER_PROGRESS_MAX_VALUE = 2000;
const PROGRESS_BAR_MAX_VALUE = 100;
const PROGRESS_BAR_DECREMENTAL_VALUE = 10;

export default function Cart() {
  const cartCtx = useContext(CartContext);
  const progressCtx = useContext(UserProgressContext);
  const [remainingTime, setRemainingTime] = useState(TIMER_PROGRESS_MAX_VALUE);
  const progressValue =
    (remainingTime / TIMER_PROGRESS_MAX_VALUE) * PROGRESS_BAR_MAX_VALUE;

  const [hidingCart, setHidingCart] = useState(false);
  const itemsCnt = cartCtx.items.length;

  const totalPrice = cartCtx.items.reduce((acc, item) => {
    return acc + item.quantity * item.price;
  }, 0);

  function handleCloseCart() {
    progressCtx.hideCart();
  }

  function handleOpenCheckout() {
    progressCtx.showCheckout();
  }
  useEffect(() => {
    progressCtx.hideCart();
    setHidingCart(false);
  }, [hidingCart]);
  useEffect(() => {
    let intervalId;

    if (progressCtx.userProgress === "cart" && itemsCnt === 0) {
      intervalId = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= PROGRESS_BAR_DECREMENTAL_VALUE) {
            clearInterval(intervalId);
            // handleCloseCart();
            setHidingCart(true);

            return 0;
          }
          return prev - PROGRESS_BAR_DECREMENTAL_VALUE;
        });
      }, PROGRESS_BAR_DECREMENTAL_VALUE);
    } else {
      setRemainingTime(TIMER_PROGRESS_MAX_VALUE);
    }

    return () => clearInterval(intervalId);
  }, [progressCtx, itemsCnt]);

  return (
    <Modal
      open={progressCtx.userProgress == "cart"}
      className="cart"
      onClose={progressCtx.userProgress == "cart" ? handleCloseCart : null}
    >
      <h2>Your cart {itemsCnt == 0 && "is empty!"}</h2>
      <ul>
        {cartCtx.items.map((item) => {
          return (
            <li key={item.id} className="cart-item">
              <p>
                {item.name} - {item.quantity} x {currencyFormatter(item.price)}
              </p>
              <p className="cart-item-actions">
                <button onClick={() => cartCtx.removeItem(item.id)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => cartCtx.addItem(item)}>+</button>
              </p>
            </li>
          );
        })}
      </ul>
      <p className="cart-total">{currencyFormatter(totalPrice)}</p>
      <p className="modal-actions">
        {itemsCnt > 0 && (
          <>
            <Button textOnly onClick={handleCloseCart}>
              Close
            </Button>
            <Button onClick={handleOpenCheckout}>Go to Checkout</Button>
          </>
        )}
      </p>
      {itemsCnt == 0 && (
        <progress value={progressValue} max={PROGRESS_BAR_MAX_VALUE} />
      )}
    </Modal>
  );
}
