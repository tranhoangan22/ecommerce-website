import React from "react";

// import "./menu-item.styles.scss";
import {
  MenuItemContainer,
  BackgroundImageContainer,
  ContentContainer,
  ContentTitle,
  ContentSubtitle,
} from "./menu-item.styles";

import { withRouter } from "react-router-dom";

/*
withRouter: is a higher-order component, which is a function that takes the component as an argument and return a modifed component.
In this case, we upgrade our `MenuItem` component to have access to the `history` props from the Router which is called in `App.js`
*/

const MenuItem = ({ title, linkUrl, imageUrl, size, history, match }) => {
  return (
    // string interpolation is a JavaScript thing!
    // `${match.url}${linkUrl}` ---> locahost:3000/shop/hats, locahost:3000/shop/jackets, locahost:3000/shop/sneakers...

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

export default withRouter(MenuItem); // `withRouter` will return us back the powered component (which has access to the props `history`, `match`, `location`) with the same name

/* NOTE: `MenuItem` is instantiated 5 times in `Directory`, for each of the 5 shopping item Categories (their `title`, `linkUrl`, `imageUrl`) in `directory.data.js` 
          (-> 5 rectangles in HomePage, HomePage calls Directory)
*/
