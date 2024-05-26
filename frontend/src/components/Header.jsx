import { useContext } from "react";
import logo from "../assets/logo.jpg";
import Button from "./UI/Button";
import { CartContext } from "../store/CartContext";
import { UserProgressContext } from "../store/UserProgressContext";
import Cart from "./Cart";

export default function Header() {
  const ctx = useContext(CartContext);
  const progressCtx = useContext(UserProgressContext);

  const cnt = ctx.items.reduce((acc, item) => acc + item.quantity, 0);

  // console.log(cnt);
  return (
    <header id="main-header">
      <div id="title">
        <img src={logo} />
        <h1>React Food</h1>
      </div>
      <nav>
        <Button
          textOnly
          onClick={() => {
            progressCtx.showCart();
          }}
        >
          Cart ({cnt})
        </Button>
       
      </nav>
    </header>
  );
}
