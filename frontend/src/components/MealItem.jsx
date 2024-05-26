import { useContext, useState } from "react";
import currencyFormatter from "../util/currencyFormatter";
import Button from "./UI/Button";
import { CartContext } from "../store/CartContext";
import Modal from "./UI/Modal";

export default function MealItem({ meal }) {
  const ctx = useContext(CartContext);
  function handleAddItemToCart() {
    ctx.addItem(meal);
  }

  return (
    <li className="meal-item">
      <article>
        <img src={`http://localhost:3000/${meal.image}`} alt={meal.name} />
        <div>
          <h3>{meal.name}</h3>
          <p className="meal-item-price">{currencyFormatter(meal.price)}</p>
          <p className="meal-item-description">{meal.description}</p>
        </div>
        <p className="meal-item-actions">
          <Button onClick={handleAddItemToCart}>Add to Cart</Button>
        </p>
      </article>
    </li>
  );
}
