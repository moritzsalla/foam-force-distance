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
    .force('charge', forceManyBody().strength(-50))
    .force('center', forceManyBody().strength(-50))
    .force('x', forceX().strength())
    .force('y', forceY().strength())
    .force(
      'link',
      forceLink()
        .id((d) => d.id)
        .strength(0.01)
    );
  // .on('tick', () => console.log('tick'));

  const handleUpdate = (nodes) => {
    if (!nodes) throw RangeError('nodes is undefined');

    const elems = nodes.map(({ current }) => {
      return current;
    });

    // return d3
    //   .selectAll(elems)
    //   .data(data.nodes)
    //   .text((d, i) => {
    //     console.log(d);
    //     return '';
    //   });
  };

  return {
    data: data,
    update: handleUpdate,
    destroy: () => {
      return simulation.stop();
    },
  };
};
