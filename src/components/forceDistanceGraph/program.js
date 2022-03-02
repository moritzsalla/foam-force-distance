import * as d3 from 'd3';
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
} from 'd3-force';
import { data } from 'data/';

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const MAX_ZOOM_LEVEL = 2;
const STROKE_WIDTH = 1;
const TRANSITION_DURATION = 550;

const program = () => {
  const viewbox = [-WIDTH / 2, -HEIGHT / 2, WIDTH, HEIGHT];
  const svg = d3.select('svg').attr('viewBox', viewbox);
  const links = d3.selectAll('line').data(data.links);
  const container = d3.select('g');
  const nodes = d3.selectAll('foreignObject');

  // ---------- base styles ----------

  nodes.attr('cursor', 'pointer');
  links.style('transition', 'stroke 0.5s ease');
  links.style('stroke', 'grey');

  // ---------- behaviour ----------

  const handleClicked = (event, { x, y, group }) => {
    links.style('stroke', ({ value }) => (value === group ? 'red' : 'grey'));

    if (getZoomLevel() !== MAX_ZOOM_LEVEL) {
      event.stopPropagation();
    }

    svg
      .transition()
      .duration(TRANSITION_DURATION)
      .call(
        zoom.transform,
        d3.zoomIdentity.scale(MAX_ZOOM_LEVEL).translate(-x, -y),
        d3.pointer(event, container.node())
      );
  };

  const handleWheeled = () => {
    if (getZoomLevel() === MAX_ZOOM_LEVEL) {
      resetView();
    }
  };

  const handleMouseOver = (_, { group }) => {
    links.style('stroke', ({ value }) => {
      return value === group ? 'red' : 'grey';
    });
  };

  const handleMouseOut = () => {
    links.style('stroke', 'grey');
  };

  const zoom = d3
    .zoom()
    .scaleExtent([1, MAX_ZOOM_LEVEL])
    .translateExtent([
      [-WIDTH, -HEIGHT],
      [WIDTH, HEIGHT],
    ])
    .on('start', () => {
      if (getZoomLevel() === MAX_ZOOM_LEVEL) resetView();
    })
    .on('zoom', ({ transform, sourceEvent }) => {
      if (sourceEvent?.type === 'mousemove') svg.attr('cursor', 'grabbing');
      container.attr('transform', transform);
      container.attr('stroke-width', STROKE_WIDTH / transform.k);
    })
    .on('end', () => {
      svg.attr('cursor', 'auto');
    });

  const resetView = () => {
    links.style('stroke', 'grey');

    svg
      .transition()
      .duration(TRANSITION_DURATION)
      .call(
        zoom.transform,
        d3.zoomIdentity,
        d3.zoomTransform(container.node()).invert([WIDTH * 0.5, HEIGHT * 0.5])
      );
  };

  svg.call(zoom);
  svg.on('click', resetView);
  svg.on('wheel.zoom', handleWheeled);
  nodes.on('mouseover', handleMouseOver);
  nodes.on('mouseout', handleMouseOut);
  nodes.on('click', handleClicked);

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
    return d3.zoomTransform(elem)?.k;
  };

  return {
    destroy: () => {
      return simulation.stop();
    },
  };
};

export default program;
