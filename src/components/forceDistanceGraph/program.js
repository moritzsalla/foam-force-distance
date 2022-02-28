import * as d3 from 'd3';
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
} from 'd3-force';
import { data } from 'data/';

const viewbox = [
  -window.innerWidth * 0.5,
  -window.innerHeight * 0.5,
  window.innerWidth,
  window.innerHeight,
];

const program = () => {
  let FOCUS = false;

  const svg = d3.select('svg').attr('viewBox', viewbox);
  const links = d3.selectAll('line.line-link').data(data.links);
  const container = d3.select('g.inner-container');
  const nodes = d3.selectAll('g.layer');

  const zoomed = ({ transform }) => {
    console.log(transform);
    container.attr('transform', transform);
    container.attr('stroke-width', 1 / transform.k);
  };

  const zoom = d3
    .zoom()
    .extent([[0, 0], viewbox])
    .scaleExtent([1, 8])
    .on('zoom', zoomed);

  const reset = (event, { x, y }) => {
    event.stopPropagation();
    FOCUS = false;

    container.call(
      zoom.transform,
      d3.zoomIdentity.translate(0, 0).scale(-2),
      d3.zoomTransform(container.node())
    );
  };

  const clicked = (event, { x, y }) => {
    event.stopPropagation();
    FOCUS = true;

    container.call(
      zoom.transform,
      d3.zoomIdentity.translate(x, y).scale(2),
      d3.pointer(event, container.node())
    );
  };

  // svg.call(zoom);
  nodes.attr('cursor', 'pointer').on('click', () => {
    console.log(FOCUS);
    return FOCUS ? reset() : clicked();
  });

  // ------- ticker -------

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

  // ------- simulation -------

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
