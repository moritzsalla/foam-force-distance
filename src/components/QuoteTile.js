import styled from 'styled-components';
import { base } from 'styles/base';

const Quote = styled.div`
  ${base};
  font-size: 1rem;
  padding: 0.5rem;
  font-style: italic;
`;

const QuoteTile = ({ text }) => (
  <Quote>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua.
  </Quote>
);

export default QuoteTile;
