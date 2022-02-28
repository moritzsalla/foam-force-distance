import * as d3 from 'd3';
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
} from 'd3-force';
import { data } from 'data/';

/** @todo links: hightlight group on click */

/** @todo double check if links are in synch with ui */

/** @todo ease zoom, pan */

const program = () => {
  const viewbox = [
    -window.innerWidth * 0.5,
    -window.innerHeight * 0.5,
    window.innerWidth,
    window.innerHeight,
  ];

  const svg = d3.select('svg').attr('viewBox', viewbox);
  const links = d3.selectAll('line.line-link').data(data.links);
  const container = d3.select('g.inner-container');
  const nodes = d3.selectAll('g.layer');

  const ticked = () => {
    nodes
      .data(data.nodes)
      .attr('transform', ({ x, y }) => `translate(${x}, ${y})`);

    links
      .attr('x1', ({ source }) => source.x)
      .attr('y1', ({ source }) => source.y)
      .attr('x2', ({ target }) => target.x)
      .attr('y2', ({ target }) => target.y)
      .style('stroke', (value) => (value === 0 ? 'red' : 'white'));
  };

  svg.call(
    d3
      .zoom()
      .extent([[0, 0], viewbox])
      .scaleExtent([1, 8])
      .on('zoom', ({ transform }) => container.attr('transform', transform))
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
    .on('tick', ticked);

  return {
    destroy: () => {
      return simulation.stop();
    },
  };
};

export default program;
