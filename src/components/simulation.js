import {
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
} from 'd3-force';
import { data } from '../data/';
import * as d3 from 'd3';

export const d3Sim = () => {
  const simulation = forceSimulation()
    .nodes(data.nodes)
    .force('charge', forceManyBody().strength(-300))
    .force('center', forceManyBody().strength(-50))
    .force('x', forceX().strength())
    .force('y', forceY().strength())
    .force(
      'link',
      forceLink(data.links)
        .id((d) => d.id)
        .strength(0.01)
    )
    .on('tick', () => console.log('tick'));

  const handleUpdate = () => {
    return d3
      .selectAll('g')
      .data(data.nodes)
      .attr('transform', ({ x, y }) => {
        return `translate(${x}, ${y})`;
      });
  };

  return {
    data: data,
    update: handleUpdate,
    destroy: () => {
      return simulation.stop();
    },
  };
};
