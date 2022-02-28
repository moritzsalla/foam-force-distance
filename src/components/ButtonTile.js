import styled from 'styled-components';
import { base } from 'styles/base';

const Button = styled.button`
  ${base};
  border-radius: 0;
  cursor: pointer;
`;

const ButtonTile = ({ text }) => (
  <Button onClick={() => alert('clicked')}>Press me!</Button>
);

export default ButtonTile;
