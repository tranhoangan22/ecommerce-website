import React from "react";
import { connect } from "react-redux";

// import { CustomButton } from "../custom-button/custom-button.component.jsx";
import { addItem } from "../../redux/cart/cart.actions.js"; // import in the action creator that takes in an item and creates the action that adds this item to the respective redux state slice

// import "./collection-item.styles.scss";

import {
  CollectionItemContainer,
  CollectionFooterContainer,
  AddButton,
  BackgroundImage,
  NameContainer,
  PriceContainer,
} from "./collection-item.styles";

const CollectionItem = ({ item, addItem }) => {
  const { name, price, imageUrl } = item;

  return (
    <CollectionItemContainer>
      <BackgroundImage className="image" imageUrl={imageUrl} />
      <CollectionFooterContainer>
        <NameContainer>{name}</NameContainer>
        <PriceContainer>{price}</PriceContainer>
      </CollectionFooterContainer>
      <AddButton onClick={() => addItem(item)} inverted>
        Add to cart
      </AddButton>
    </CollectionItemContainer>
  );
};

// the `CollectionItem` component, after going through `connect` with `mapDispatchToProps`, will receive a prop. This prop is a function which dispatches the action that adds the items to the cart slice of the redux state
const mapDispatchToProps = (dispatch) => ({
  addItem: (item) => dispatch(addItem(item)),
});

export default connect(null, mapDispatchToProps)(CollectionItem);

/* NOTE: `CollectionItem` is instantiated in `CollectionPreview`, for each of the first five items in a shopping item Category -> 5 times
         `CollectionItem` is the rectangle which represents each item (with a pic, name, cost, and addtocart button which once clicked will add the items to the redux state `state.cart.cartItems`
*/
