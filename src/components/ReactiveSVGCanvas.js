import * as d3 from 'd3';
import {
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
} from 'd3-force';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { data } from '../data/';
import '../styles.css';
import { Dot } from '../utils/helpers';
import Tile from './Tile';

const ZOOM_LEVEL = 2;

/**
 * D3 simulation rendering react components.
 * @note goal is to outsource the position updates to the simulation
 * @example https://github.com/d3/d3-force
 * @example https://observablehq.com/@d3/temporal-force-directed-graph?collection=@d3/d3-force
 */
const ReactiveSVGCanvas = () => {
  useEffect(() => {
    const ticked = () => {
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
      .force('center', forceManyBody().strength(-50))
      .force('x', forceX().strength())
      .force('y', forceY().strength())
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
            const boxWidth = 200;
            const boxHeight = 200;

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

                <Dot />
              </motion.g>
            );
          })}
        </motion.svg>
      </motion.div>
    </section>
  );
};

export default ReactiveSVGCanvas;
