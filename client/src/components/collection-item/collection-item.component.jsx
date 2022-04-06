import React from "react";
import { connect } from "react-redux";

import { addItem } from "../../redux/cart/cart.actions.js";

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

const mapDispatchToProps = (dispatch) => ({
  addItem: (item) => dispatch(addItem(item)),
});

export default connect(null, mapDispatchToProps)(CollectionItem);

/* NOTE: `CollectionItem` is instantiated in `CollectionPreview`, for each of the first five items in a shopping item Category -> 5 times
         `CollectionItem` is the rectangle which represents each item (with a pic, name, cost, and addtocart button which once clicked will add the items to the redux state `state.cart.cartItems`
*/
