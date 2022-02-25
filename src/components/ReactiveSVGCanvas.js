import * as d3 from 'd3';
import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
} from 'd3-force';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { data } from '../data/';
import '../styles.css';
import Tile from './Tile';

const ZOOM_LEVEL = 1;

/**
 * D3 simulation rendering react components.
 * @note goal is to outsource the position updates to the simulation
 * @example https://github.com/d3/d3-force
 * @example https://observablehq.com/@d3/temporal-force-directed-graph?collection=@d3/d3-force
 */
const ReactiveSVGCanvas = () => {
  useEffect(() => {
    const drag = (simulation) => {
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
          return value < 0.5 ? 'red' : 'white';
        })
        .call(drag(simulation));
    };

    const simulation = forceSimulation()
      .nodes(data.nodes)
      .force(
        'link',
        forceLink(data.links)
          .id((d) => d.id)
          .strength(0.01)
      )
      .force('charge', forceManyBody().strength(-300))
      .force('collide', forceCollide().radius(100).iterations(1))
      .force('center', forceManyBody().strength(200))
      .on('tick', ticked);

    return () => simulation.stop();
  }, []);

  const viewBox = [
    -window.innerWidth * 0.5 * ZOOM_LEVEL,
    -window.innerHeight * 0.5 * ZOOM_LEVEL,
    window.innerWidth * ZOOM_LEVEL,
    window.innerHeight * ZOOM_LEVEL,
  ];

  return (
    <section className='canvas'>
      <motion.div className='canvas-draggable-inner'>
        <motion.svg className='svg' viewBox={viewBox}>
          {/* link layer */}
          {data?.links?.map((_, index) => (
            <line key={`link-${index}`} className='line-link' stroke='white' />
          ))}

          {/* component layer */}
          {data?.nodes?.map(({ id }, index) => {
            const boxWidth = 100;
            const boxHeight = 100;

            return (
              <motion.g key={`layer-${index}`} className='layer'>
                <foreignObject
                  x={-boxWidth * 0.5}
                  y={-boxHeight * 0.5}
                  width={boxWidth}
                  height={boxHeight}
                >
                  <Tile key={`node-${id}`} />
                </foreignObject>
              </motion.g>
            );
          })}
        </motion.svg>
      </motion.div>
    </section>
  );
};

export default ReactiveSVGCanvas;
