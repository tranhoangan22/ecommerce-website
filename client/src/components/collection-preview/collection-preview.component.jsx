import React from "react";
import { withRouter } from "react-router-dom";

import CollectionItem from "../collection-item/collection-item.component.jsx";

// import "./collection-preview.styles.scss";

import {
  CollectionPreviewContainer,
  TitleContainer,
  PreviewContainer,
} from "./collection-preview.styles";

const CollectionPreview = ({ title, items, history, match, routeName }) => (
  <CollectionPreviewContainer>
    <TitleContainer onClick={() => history.push(`${match.path}/${routeName}`)}>
      {title.toUpperCase()}
    </TitleContainer>
    <PreviewContainer>
      {items
        .filter((item, idx) => idx < 4)
        .map((item) => (
          <CollectionItem key={item.id} item={item} />
        ))}
    </PreviewContainer>
  </CollectionPreviewContainer>
);

export default withRouter(CollectionPreview);

/* NOTE
The function calls on the `items` array or any other functions inside the component get called every time the component is rerendered. 
This is a performance concern. We need to handle it somehow.
*/

// NOTE: `CollectionPreview` is instantiated in `CollectionOverview` for each of the shopping item Categories ->  5 times