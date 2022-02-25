import { createSelector } from "reselect";
import memoize from "lodash.memoize";

export const selectShop = (state) => state.shop;

export const selectCollections = createSelector(
  [selectShop],
  (shop) => shop.collections
);

// Convert `collections` object, from an object to an array
export const selectCollectionsForPreview = createSelector(
  [selectCollections],
  (collections) =>
    collections ? Object.keys(collections).map((key) => collections[key]) : [] // `Object.keys(collections)` gets us an array containing all the keys of the object `collections`
);

// Select, from a specific `collectionUrlParam`, the corresponding `collection` - with Memoization
export const selectCollection = memoize((collectionUrlParam) =>
  createSelector(
    [selectCollections],
    (collections) => (collections ? collections[collectionUrlParam] : null) // Object (Hash Table data structure) is better for searching items than Array!
  )
);

export const selectIsCollectionsFetching = createSelector(
  [selectShop],
  (shop) => shop.isFetching
);

export const selectIsCollectionsLoaded = createSelector(
  [selectShop],
  shop => !!shop.collections  // !! converts the object to boolean true if it is not null and false if it is
)

/* 
`memoize` does the same idea of memoization as reselect does for our selectors, 
    except this time we're memoizing the return of our function which returns our selector.
    
By wrapping this function in memoize, we're saying that whenever this function gets called and receives `collectionUrlParam`, 
    I want to memoize the return of this function (in this case we return a selector). 
    If this function gets called again with the same `collectionUrlParam`, don't rerun this function 
    because we'll return the same value as last time, which we've memoized so just return the selector that's been stored.
*/

/*
JavaScript concept: CURRYING
Currying is an advanced technique of working with functions. It’s used not only in JavaScript, but in other languages as well.
Currying is a transformation of functions that translates a function from callable as f(a, b, c) into callable as f(a)(b)(c).
Currying doesn’t call a function. It just transforms it.
https://javascript.info/currying-partials

          function curry(f) { // curry(f) does the currying transform
            return function(a) {
              return function(b) {
                return f(a, b);
              };
            };
          }
          
          // usage
          function sum(a, b) {
            return a + b;
          }
          
          let curriedSum = curry(sum);
          
          alert( curriedSum(1)(2) ); // 3


*/

/*
Object (Hash Table data structure) is better for searching items than Array!
This is a common computing optimization when talking about data structures. If you want to learn more about why this is, this is a great resource for you to use: https://www.kirupa.com/html5/hashtables_vs_arrays.htm
*/
