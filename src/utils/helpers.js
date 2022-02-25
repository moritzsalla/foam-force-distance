import * as d3 from 'd3';

export const Dot = ({ d = 20 }) => (
  <rect
    className='center-dot'
    width={d}
    height={d}
    fill='red'
    x={-d / 2}
    y={-d / 2}
  />
);

export const drag = (simulation) => {
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  return d3
    .drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended);
};

export const zoomed = ({ elem, transform }) => {
  elem.attr('transform', transform);
};
