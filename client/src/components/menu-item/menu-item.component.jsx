import React from "react";

import {
  MenuItemContainer,
  BackgroundImageContainer,
  ContentContainer,
  ContentTitle,
  ContentSubtitle,
} from "./menu-item.styles";

import { withRouter } from "react-router-dom";

const MenuItem = ({ title, linkUrl, imageUrl, size, history, match }) => {
  return (
    <MenuItemContainer
      size={size}
      onClick={() => history.push(`${match.url}${linkUrl}`)}
    >
      <BackgroundImageContainer imageUrl={imageUrl} />
      <ContentContainer>
        <ContentTitle>{title.toUpperCase()}</ContentTitle>
        <ContentSubtitle>SHOP NOW</ContentSubtitle>
      </ContentContainer>
    </MenuItemContainer>
  );
};

export default withRouter(MenuItem);

/* NOTE: `MenuItem` is instantiated 5 times in `Directory`, for each of the 5 shopping item Categories (their `title`, `linkUrl`, `imageUrl`) in `directory.data.js` 
          (-> 5 rectangles in HomePage, HomePage calls Directory)
*/
