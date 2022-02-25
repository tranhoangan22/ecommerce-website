import React, { useEffect, lazy, Suspense } from "react";
import { Route } from "react-router-dom";

import { connect } from "react-redux";

import { fetchCollectionsStart } from "../../redux/shop/shop.actions"; // import a function which is an action creator which creates an action of type FETCH_COLLECTIONS_START, this action being dispatched will trigger the Saga to carry out asynchronous events

import Spinner from "../../components/spinner/spinner.component";

const CollectionsOverviewContainer = lazy(() =>
  import("../../components/collections-overview/collections-overview.container")
);
const CollectionPageContainer = lazy(() =>
  import("../collection/collection.container")
);

const ShopPage = ({ fetchCollectionsStart, match }) => {
  /* 
    NOTE: we don't want to ever move any of the API requests into the lifecycle methods that occur before `componentDidMount()` (eg, the `constructor`, `UNSAFE_componentWillMount`)
      - the reason for this is because it would cause all the connected components to rerender 
      - it is highly suggested that all the API resquests are located in `componentDidMount()`
  */

  /* 
    NOTE: we don't want to ever move any of the API requests into the lifecycle methods that occur before `componentDidMount()` (eg, the `constructor`)
      - No matter how fast your server is, response will be undefined by the time constructor sets state, because as soon as JavaScript will see API call, it will have to go through event loop then component rendering and re-rendering will happen. So by calling API in constructor() is going to increase code complexity.
      - not a syntax error but increases code complexity and hampers performance https://medium.com/devinder/why-api-call-is-recommended-in-componentdidmount-38c8c3c57834  
      - it is highly suggested that all the API resquests are located in `componentDidMount()`
  */

  useEffect(() => {
    fetchCollectionsStart();
  }, [fetchCollectionsStart]); // only fires when `fetchCollectionsStart` changes. The same effect can be achieved with the empty 2nd array argument.

  return (
    <div className="shop-page">
      <Suspense fallback={<Spinner />}>
        <Route
          exact
          path={`${match.path}`}
          component={CollectionsOverviewContainer}
        />
        <Route
          path={`${match.path}/:collectionId`}
          component={CollectionPageContainer}
        />
      </Suspense>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  fetchCollectionsStart: () => dispatch(fetchCollectionsStart()),
});

export default connect(null, mapDispatchToProps)(ShopPage);

// NOTE: normally SHOP_DATA is stored at backend

/* NOTE: `ShopPage` is instantiated once depending on the URL. 
    - if the URL is localhost:3000/shop, `CollectionOverview` will be rendered 
    - else if the URL is localhost:3000/shop/:collectionId, corresponding `CollectionPage` will be rendered
*/

/*
NOTE:
Firebase allows us to use their firestore database as API, which is accesible via a URL. https://firebase.google.com/docs/firestore/use-rest-api#making_rest_calls
*/
