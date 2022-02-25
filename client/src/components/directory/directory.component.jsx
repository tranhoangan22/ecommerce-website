import React from "react";
import { connect } from "react-redux";

import { selectDirectorySections } from "../../redux/directory/directory.selectors.js";
import { createStructuredSelector } from "reselect";

import MenuItem from "../menu-item/menu-item.component.jsx";
import "./directory.styles.scss";
// import sections from "./directory.data.js"; // commented out because data is stored in redux store now

const Directory = ({ sections }) => (
  <div className="directory-menu">
    {/* {this.state.sections.map(({title, linkUrl, imageUrl, size, id}) => {
          return (
            <MenuItem key={id} title={title} linkUrl={linkUrl} imageUrl={imageUrl} size={size} />
          );
        })} */}

    {sections.map(({ id, ...otherSectionProps }) => {
      return <MenuItem key={id} {...otherSectionProps} />;
    })}
  </div>
);

const mapStateToProps = createStructuredSelector({
  sections: selectDirectorySections,
});

export default connect(mapStateToProps)(Directory);

// NOTE: `Directory` is instantiated once in `HomePage`
