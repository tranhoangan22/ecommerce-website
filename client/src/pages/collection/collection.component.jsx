import React from "react";

import { useSelector } from "react-redux";

import { useParams } from "react-router-dom";

import { selectCollection } from "../../redux/shop/shop.selectors.js";

import CollectionItem from "../../components/collection-item/collection-item.component.jsx";

// import "./collection.styles.scss";

import {
  CollectionPageContainer,
  CollectionTitle,
  CollectionItemsContainer,
} from "./collection.styles";

const CollectionPage = () => {
  const { collectionId } = useParams();

  const collection = useSelector(selectCollection(collectionId)); // note `selectCollection(collectionId)` returns a selector that "gives" back the collection based on `collectionId`, from `state.shop.collections`

  const { title, items } = collection;
  return (
    <CollectionPageContainer>
      <CollectionTitle>{title}</CollectionTitle>
      <CollectionItemsContainer>
        {items.map((item) => (
          <CollectionItem key={item.id} item={item} />
        ))}
      </CollectionItemsContainer>
    </CollectionPageContainer>
  );
};

export default CollectionPage;

// NOTE: CollectionPage in instantiated once in the ShopPage if the url is "/shop/collectionId"
