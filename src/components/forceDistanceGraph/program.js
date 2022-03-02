import * as d3 from 'd3';
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
} from 'd3-force';
import { data } from 'data/';

const width = window.innerWidth;
const height = window.innerHeight;
const maxZoomLevel = 2;
const strokeWidth = 1;

const program = () => {
  const svg = d3
    .select('svg')
    .attr('viewBox', [-width / 2, -height / 2, width, height]);
  const links = d3.selectAll('line.line-link').data(data.links);
  const container = d3.select('g.inner-container');
  const nodes = d3.selectAll('g.layer');

  // ---------- base styles ----------

  nodes.attr('cursor', 'pointer');
  links.style('stroke', 'grey');

  // ---------- behaviour ----------

  const clicked = (event, { x, y, group }) => {
    links.style('stroke', ({ value }) => (value === group ? 'red' : 'grey'));
    if (getZoomLevel() !== maxZoomLevel) event.stopPropagation();

    svg
      .transition()
      .duration(750)
      .call(
        zoom.transform,
        d3.zoomIdentity.scale(maxZoomLevel).translate(-x, -y),
        d3.pointer(event, container.node())
      );
  };

  const wheeled = () => {
    if (getZoomLevel() === maxZoomLevel) reset();
  };

  const zoom = d3
    .zoom()
    .scaleExtent([1, maxZoomLevel])
    .translateExtent([
      [-width, -height],
      [width, height],
    ])
    .on('start', () => {
      if (getZoomLevel() === maxZoomLevel) reset();
    })
    .on('zoom', ({ transform, sourceEvent }) => {
      if (sourceEvent?.type === 'mousemove') svg.attr('cursor', 'grabbing');
      container.attr('transform', transform);
      container.attr('stroke-width', strokeWidth / transform.k);
    })
    .on('end', () => {
      svg.attr('cursor', 'auto');
    });

  const reset = () => {
    links.style('stroke', 'grey');

    svg
      .transition()
      .duration(750)
      .call(
        zoom.transform,
        d3.zoomIdentity,
        d3.zoomTransform(container.node()).invert([width * 0.5, height * 0.5])
      );
  };

  nodes.on('click', clicked);
  svg.call(zoom).on('click', reset).on('wheel.zoom', wheeled);

  // ------- ticker -------

  const ticked = () => {
    nodes
      .data(data.nodes)
      .attr('transform', ({ x, y }) => `translate(${x}, ${y})`);

    links
      .attr('x1', ({ source }) => source.x)
      .attr('y1', ({ source }) => source.y)
      .attr('x2', ({ target }) => target.x)
      .attr('y2', ({ target }) => target.y);
  };

  // ------- simulation -------

  const simulation = forceSimulation()
    .nodes(data.nodes)
    .force(
      'link',
      forceLink(data.links)
        .id(({ id }) => id)
        .strength(0.1)
    )
    .force('charge', forceManyBody().strength(300))
    .force('collide', forceCollide().radius(350).iterations(1).strength(1))
    .force('center', forceCenter().strength(1))
    .on('tick', ticked);

  // ---------- utils ----------

  const getZoomLevel = () => {
    const elem = container.node();
    const { k } = d3.zoomTransform(elem);
    return k;
  };

  return {
    destroy: () => {
      return simulation.stop();
    },
  };
};

export default program;
