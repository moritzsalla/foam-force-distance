import * as d3 from 'd3';
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
} from 'd3-force';
import { data } from '../data/';
import { drag } from '../utils/helpers';

const program = () => {
  const ticked = () => {
    d3.selectAll('g')
      .data(data.nodes)
      .attr('transform', ({ x, y }) => {
        return `translate(${x}, ${y})`;
      })
      .call(drag(simulation));

    d3.selectAll('line')
      .data(data.links)
      .attr('x1', ({ source }) => source.x)
      .attr('y1', ({ source }) => source.y)
      .attr('x2', ({ target }) => target.x)
      .attr('y2', ({ target }) => target.y)
      .style('stroke', function ({ value }) {
        return value === 0 ? 'red' : 'white';
      })
      .call(drag(simulation));
  };

  const simulation = forceSimulation()
    .nodes(data.nodes)
    .force(
      'link',
      forceLink(data.links)
        .id((d) => d.id)
        .strength(0.1)
    )
    .force('charge', forceManyBody().strength(300))
    .force('collide', forceCollide().radius(200).iterations(1).strength(1))
    .force('center', forceCenter().strength(0.01))
    // .force('bounds', () => {
    //   for (let i = 0, n = data.nodes.length, node, k = 0.01; i < n; ++i) {
    //     node = data.nodes[i];
    //     node.vx -= node.x * k;
    //     node.vy -= node.y * k;
    //   }
    // })
    .on('tick', ticked);

  return {
    destroy: () => {
      return simulation.stop();
    },
  };
};

export default program;
