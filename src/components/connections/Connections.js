import ButtonTile from 'components/ButtonTile';

import ImageTile from 'components/ImageTile';
import QuoteTile from 'components/QuoteTile';

import { data } from 'data/';
import { useEffect } from 'react';
import styled from 'styled-components';
import 'styles/main.css';
import ConnectionsGraph from './program';

const Container = styled.div`
  position: relative;
  background: black;
  color: white;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

const SVG = styled.svg`
  height: 100%;
  width: 100%;
`;

const COMP_TYPES = {
  button: {
    Comp: ButtonTile,
    dimensions: [200, 200],
  },
  image: {
    Comp: ImageTile,
    dimensions: [100, 100],
  },
  quote: {
    Comp: QuoteTile,
    dimensions: [300, 100],
  },
};

const LinkLayer = ({ links = [] }) => {
  return links.map((_, index) => {
    return <line key={`link-${index}`} />;
  });
};

const NodeLayer = ({ nodes = [] }) => {
  return nodes.map(({ type, group }, index) => {
    const Comp = COMP_TYPES[type]?.Comp || (() => <></>);
    const [width, height] = COMP_TYPES[type]?.dimensions || [];
    return (
      <foreignObject
        key={`node-${index}`}
        x={-width * 0.5}
        y={-height * 0.5}
        width={width}
        height={height}
      >
        <Comp text={group} />
      </foreignObject>
    );
  });
};

const Connections = () => {
  useEffect(() => {
    const graph = new ConnectionsGraph({
      data: data,
      width: window.innerWidth,
      height: window.innerHeight,
    });
    return () => graph.destroy();
  }, []);

  return (
    <Container>
      <SVG>
        <g>
          <LinkLayer links={data?.links} />
          <NodeLayer nodes={data?.nodes} />
        </g>
      </SVG>
    </Container>
  );
};

export default Connections;
