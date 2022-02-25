import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { selectCollectionsForPreview } from "../../redux/shop/shop.selectors.js"; // from redux state, select `state.shop.collections` and convert it to an array containing all the values

import CollectionPreview from "../collection-preview/collection-preview.component.jsx";

import "./collections-overview.styles.scss";

const CollectionsOverview = ({ collections }) => (
  <div className="collection-overview">
    {collections.map(({ id, ...otherCollectionProps }) => (
      <CollectionPreview key={id} {...otherCollectionProps} /> // the same as: <CollectionPreview key={id} items = {items} title={title} routeName={routeName} />
    ))}
  </div>
);

const mapStateToProps = createStructuredSelector({
  collections: selectCollectionsForPreview,
});

export default connect(mapStateToProps)(CollectionsOverview);

// NOTE: `CollectionOverview` is instantiated once in `ShopPage` if the URL is localhost:3000/shop. `CollectionOverview` calls `CollectionPreview` 5 times to display the previews of the 5 item categories
