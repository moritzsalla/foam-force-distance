import {
  forceCenter,
  forceCollide,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  forceLink,
} from 'd3-force';

const TICKER = 500;

export const graphProgram = (data) => {
  const { nodes, links } = data || {};

  const simulation = forceSimulation(nodes)
    .stop()
    .force('charge', forceManyBody().strength(-50))
    // .force('center', forceCenter(0, 0).strength(0.4))
    .force('collide', forceCollide().strength(4).radius(200).iterations(10))
    .force('x', forceX().strength())
    .force('y', forceY().strength())
    .force(
      'link',
      forceLink()
        .id((d) => d.id)
        .links(links)
        .strength(0.01)
    )
    .tick(TICKER);

  return {
    nodes,
    links,
    cleanup: () => {
      return simulation.stop();
    },
  };
};
