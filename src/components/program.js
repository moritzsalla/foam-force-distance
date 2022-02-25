import * as d3 from 'd3';
import { svg } from 'd3';
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
} from 'd3-force';
import { data } from '../data/';
import { drag, zoomed } from '../utils/helpers';

const program = () => {
  const ticked = () => {
    // ------ group layer ------

    d3.selectAll('g.layer')
      .data(data.nodes)
      .attr('transform', ({ x, y }) => {
        return `translate(${x}, ${y})`;
      });

    // ------ line layer ------

    d3.selectAll('line.line-link')
      .data(data.links)
      .attr('x1', ({ source }) => source.x)
      .attr('y1', ({ source }) => source.y)
      .attr('x2', ({ target }) => target.x)
      .attr('y2', ({ target }) => target.y)
      .style('stroke', function ({ value }) {
        return value === 0 ? 'red' : 'white';
      });
  };

  // ------ svg ------
  // https://observablehq.com/@d3/drag-zoom?collection=@d3/d3-drag
  d3.select('svg')
    .attr('viewBox', [
      -window.innerWidth * 0.5,
      -window.innerHeight * 0.5,
      window.innerWidth,
      window.innerHeight,
    ])
    .call(
      d3
        .zoom()
        .extent([
          [0, 0],
          [
            -window.innerWidth * 0.5,
            -window.innerHeight * 0.5,
            window.innerWidth,
            window.innerHeight,
          ],
        ])
        .scaleExtent([1, 8])
        .on('zoom', ({ transform }) => {
          d3.select('g.inner-container').attr('transform', transform);
        })
    );

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
