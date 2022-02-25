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
  /**
   * @note
   * calling forceSimulation class auto-runs similation until
   * the simulation is cold (no more forces to equalise).
   * **stop()** stops the simulation.
   * **tick()** calls the ticker a set number of times.
   */
  const simulation = forceSimulation()
    .stop() // stops the simulation
    .nodes(data.nodes)
    .force(
      'link',
      forceLink(data.links)
        .id((d) => d.id)
        .strength(0.01)
    )
    .force('charge', forceManyBody().strength(-300))
    .force('center', forceManyBody().strength(-50))
    .force('x', forceX().strength())
    .force('y', forceY().strength())
    .tick(200)
    .on('tick', () => console.log('tick'));

  return {
    data: data,

    /**
     * @todo this could make use of the dom refs to target
     * specific elements in the future. For now, we are binding
     * the simulation to arbitrary svg groups.
     */
    update: (nodes) => {
      d3.selectAll('g')
        .data(data.nodes)
        .attr('transform', ({ x, y }) => {
          return `translate(${x}, ${y})`;
        });

      d3.selectAll('line')
        .data(data.links)
        .attr('x1', ({ source }) => source.x)
        .attr('y1', ({ source }) => source.y)
        .attr('x2', ({ target }) => target.x)
        .attr('y2', ({ target }) => target.y);
    },

    destroy: () => {
      return simulation.stop();
    },
  };
};
