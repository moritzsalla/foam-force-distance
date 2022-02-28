import styled from 'styled-components';
import { base } from 'styles/base';

const ImageContainer = styled.img`
  ${base};
`;

const ImageTile = ({ text }) => {
  const url = `https://picsum.photos/id/${Math.round(
    Math.random() * 400
  )}/200/300`;

  return <ImageContainer src={url} />;
};

export default ImageTile;
