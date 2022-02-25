import React from "react";

import "./cart-item.styles.scss";

// passing the object `item` through as prop, but also destructuring it and passing as props the properties `imageUrl`, `price`, `name`
const CartItem = ({ item: { imageUrl, price, name, quantity } }) => (
  <div className="cart-item">
    <img src={imageUrl} alt="item" />
    <div className="item-details">
      <span className="name">{name}</span>
      <span className="price">
        {quantity} x ${price}
      </span>
    </div>
  </div>
);

// React.memo: `CartItem` should only be rerendered if the item that gets passed in ever changes (when the user clicks on the item in ShopPage (CollectionPage or CollectionOverview))
export default React.memo(CartItem);


// NOTE: `CartItem` is instantiated in the component `CartDropDown`, for each of the available item in `state.cart.cartItems`  