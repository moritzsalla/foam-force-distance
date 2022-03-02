import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import Connections from 'components/connections/Connections';

const rootElement = document.getElementById('root');

ReactDOM.render(
  <StrictMode>
    <Connections />
  </StrictMode>,
  rootElement
);
