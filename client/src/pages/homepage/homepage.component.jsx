import React, { Profiler } from "react";

import Directory from "../../components/directory/directory.component.jsx";

/* 
styles separate from components -> prone to styles bleeding, when different styles are assigned to the same classes by mistake
*/
// import "./homepage.styles.scss";

/*
CSS in JS: Move styles to JS to avoid styles bleeding using `styled-components`
*/
import { HomePageContainer } from "./homepage.styles.jsx";

const HomePage = () => {
  // throw Error; // manually throw an error
  return (
    <HomePageContainer>
      <Profiler
        id="Directory"
        onRender={(id, phase, actualDuration) => {
          console.log({
            id,
            phase,
            actualDuration,
          });
        }}
      >
        <Directory />
      </Profiler>
    </HomePageContainer>
  );
};

export default HomePage;

// `HomePage` is instantiated once in `App` when path is "/"
