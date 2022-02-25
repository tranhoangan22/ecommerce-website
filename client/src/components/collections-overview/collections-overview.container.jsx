/* 
Container Component is a component where an interested component gets wrapped in all the HOCs that it needs in order to run as expected
Container component communicates directly with the redux store
Container components do not render anything. They just pass props down (from redux store) to components
*/

import { connect } from "react-redux";
import { compose } from "redux"; // https://redux.js.org/api/compose
import { createStructuredSelector } from "reselect";

import { selectIsCollectionsFetching } from "../../redux/shop/shop.selectors.js";

import WithSpinner from "../with-spinner/with-spinner.component.jsx";

import CollectionsOverview from "./collections-overview.component.jsx";

const mapStateToProps = createStructuredSelector({
  isLoading: selectIsCollectionsFetching,
});

// const CollectionsOverviewContainer = connect(mapStateToProps)(
//   WithSpinner(CollectionOverview)
// );

const CollectionsOverviewContainer = compose(
  connect(mapStateToProps),
  WithSpinner // Equip the `CollectionOverview` with the "Spinner functionality" by passing each into the HOC `WithSpinner`
)(CollectionsOverview); // evaluate from right to left

export default CollectionsOverviewContainer;
