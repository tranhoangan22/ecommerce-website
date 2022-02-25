/*
styled-components: https://styled-components.com/docs/api
- Automatic critical CSS
- No class name bugs
- Easier deletion of CSS
- Simple dynamic styling
- Painless maintenance
- Automatic vendor prefixing
*/
import styled from "styled-components"; // This is the default export. This is a low-level factory we use to create the styled.tagname helper methods

export const HomePageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 10px;
`;
