import ButtonTile from 'components/ButtonTile';

import ImageTile from 'components/ImageTile';
import QuoteTile from 'components/QuoteTile';

import { data } from 'data/';
import { useEffect } from 'react';
import styled from 'styled-components';
import 'styles/main.css';
import ConnectionsGraph from './connectionsGraphProgram';

const Container = styled.div`
  position: relative;
  background: black;
  color: white;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

const ContainerInner = styled.div`
  position: absolute;
  height: max-content;
  width: max-content;
`;

const SVG = styled.svg`
  height: 100vh;
  width: 100vw;
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

/**
 * D3 simulation rendering react components.
 * @note goal is to outsource the position updates to the simulation
 * @example https://github.com/d3/d3-force
 * @example https://observablehq.com/@d3/temporal-force-directed-graph?collection=@d3/d3-force
 * @example https://observablehq.com/@d3/drag-zoom?collection=@d3/d3-drag
 */
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
      <ContainerInner>
        <SVG>
          <g>
            <LinkLayer links={data?.links} />
            <NodeLayer nodes={data?.nodes} />
          </g>
        </SVG>
      </ContainerInner>
    </Container>
  );
};

export default Connections;
