/* 
Container Component is where an interested component gets wrapped in all the HOCs to get certain functionalities (eg, spinner) 
Container Components pass props down (from redux store) to components. They do not render anything. They just 
Container component communicates directly with the redux store
*/

import { connect } from "react-redux";
import { compose } from "redux"; // https://redux.js.org/api/compose

import { selectIsCollectionsLoaded } from "../../redux/shop/shop.selectors.js";

import WithSpinner from "../../components/with-spinner/with-spinner.component.jsx";

import CollectionPage from "./collection.component.jsx";

const mapStateToProps = (state) => ({
  isLoading: !selectIsCollectionsLoaded(state), // note that the props defined in `WithSpinner` to decide whether to render a spinner is `isLoading`
});

// const CollectionPageContainer = connect(mapStateToProps)(
//   WithSpinner(CollectionPage)
// );

const CollectionPageContainer = compose(
  connect(mapStateToProps),
  WithSpinner // Equip the `CollectionPage` with the "Spinner functionality" by passing each into the HOC `WithSpinner`
)(CollectionPage);

export default CollectionPageContainer;
