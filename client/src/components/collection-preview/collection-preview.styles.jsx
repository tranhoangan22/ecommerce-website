import styled from "styled-components";

export const TitleContainer = styled.h1`
  font-size: 28px;
  cursor: pointer;

  &:hover {
    color: grey;
  }

  @media screen and (max-width: 800px) {
    text-align: center;
  }
`;

export const PreviewContainer = styled.div`
  display: flex;
  justify-content: space-between;
  column-gap: 10px;

  @media screen and (max-width: 800px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
`;

export const CollectionPreviewContainer = styled.div`
  display: flex;
  flex-direction: column;

  @media screen and (max-width: 800px) {
    margin-left: 18px;
    margin-right: 18px;

    ${
      "" /* & > h1 {
      text-align:center;
    } */
    }
`;
