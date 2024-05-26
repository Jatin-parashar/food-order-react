import { useContext } from "react";
import currencyFormatter from "../util/currencyFormatter";
import Button from "./UI/Button";
import Input from "./UI/Input";
import Modal from "./UI/Modal";
import { CartContext } from "../store/CartContext";
import { UserProgressContext } from "../store/UserProgressContext";
import useHttp from "../hooks/useHttp";
import Error from "./Error";

const requestConfig = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

export default function Checkout() {
  const cartCtx = useContext(CartContext);
  const progressCtx = useContext(UserProgressContext);

  const itemsCnt = cartCtx.items.length;

  const {
    data,
    isLoading: isSending,
    error,
    sendRequest,
    clearData,
  } = useHttp("http://localhost:3000/orders", requestConfig);

  const totalPrice = cartCtx.items.reduce((acc, item) => {
    return acc + item.quantity * item.price;
  }, 0);

  function handleCloseCheckout() {
    progressCtx.hideCheckout();
  }

  function handleFinish() {
    progressCtx.hideCheckout();
    cartCtx.clearCart();
    clearData();
  }
  function handleFormSubmission(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const customerData = Object.fromEntries(formData.entries());
    console.log(customerData);

    sendRequest(
      JSON.stringify({
        order: {
          items: cartCtx.items,
          customer: customerData,
        },
      })
    );

    // async function sending() {
    //   const response = await fetch("http://localhost:3000/orders", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       order: {
    //         items: cartCtx.items,
    //         customer: customerData,
    //       },
    //     }),
    //   });

    //   console.log(response);
    // }

    // sending();
  }

  let actions = (
    <>
      <Button type="button" textOnly onClick={handleCloseCheckout}>
        Close
      </Button>
      <Button>Submit</Button>
    </>
  );
  if (isSending) {
    actions = <span>Sendig data...</span>;
  }

  if (data && !error) {
    // console.log(data);
    return (
      <Modal
        open={progressCtx.userProgress == "checkout"}
        onClose={handleCloseCheckout}
      >
        <h2>Success!</h2>
        <p>Your order was submitted successfully.</p>
        <p>
          We weill get back to you with more details via email within the next
          few minutes.
        </p>
        <p className="modal-actions">
          <Button onClick={handleFinish}>Okay</Button>
        </p>
      </Modal>
    );
  }
  return (
    <Modal
      open={progressCtx.userProgress == "checkout"}
      onClose={handleCloseCheckout}
    >
      <form onSubmit={handleFormSubmission}>
        <h2>Checkout</h2>
        <p>Total Amount: {currencyFormatter(totalPrice)}</p>
        <Input label="Full Name" type="text" id="name" />
        <Input label="E-Mail Address" type="email" id="email" />
        <Input label="Street" type="text" id="street" />
        <div className="control-row">
          <Input label="Postal Code" type="text" id="postal-code" />
          <Input label="City" type="text" id="city" />
        </div>

        {error && <Error title="Failed to submit order" message={error} />}
        <p className="modal-actions">{actions}</p>
      </form>
    </Modal>
  );
}
