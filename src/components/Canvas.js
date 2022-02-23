import '../styles.css';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Tile from './Tile';

import * as d3 from 'd3';
import { forceSimulation } from 'd3-force';
import { data } from '../data/index';

/**
 * Component state handled by react
 * Positioning/animation handled OUTSIDE OF REACT by framer
 * @example https://github.com/d3/d3-force
 * @example https://observablehq.com/@d3/temporal-force-directed-graph?collection=@d3/d3-force
 * @note D3 mutates original data
 */

const Canvas = () => {
  const ref = useRef();
  const [nodes, createNodes] = useState([]); // how many nodes can we store in react state until it becomes unperformant?

  const normalize = d3.scaleLinear().domain([0, 100]).range([-100, 100]);

  useEffect(() => {
    if (!ref) {
      console.error('no ref found');
      return;
    }

    const simulation = forceSimulation(data.nodes)
      .force('charge', d3.forceManyBody())
      .force(
        'link',
        d3.forceLink().id((d) => d.id)
      )
      .force('x', d3.forceX())
      .force('y', d3.forceY())
      .force(
        'collide',
        d3
          .forceCollide()
          .radius((d) => d.r + 10)
          .iterations(2)
      );

    /**
     * @note access data like this: simulation.nodes()
     *
     * index - the node’s zero-based index into nodes
     * x - the node’s current x-position
     * y - the node’s current y-position
     * vx - the node’s current x-velocity
     * vy - the node’s current y-velocity
     */
    const handleTick = () => {
      const nodes = simulation.nodes();
      createNodes(nodes);
    };
    simulation.on('tick', handleTick);

    return () => {
      simulation.on('end', () => console.log('simulation end'));
      simulation.stop();
    };
  }, []);

  console.log(nodes);

  return (
    <section ref={ref} className='canvas'>
      <svg
        className='layer-container'
        viewBox={[
          -window.innerWidth / 2,
          -window.innerHeight / 2,
          window.innerWidth,
          window.innerHeight,
        ]}
      >
        {nodes?.map(({ id, x = 0, y = 0 }) => {
          return (
            <motion.g key={`layer-${id}`} class='layer' animate={{ x, y }}>
              <rect width='5px' height='5px' fill='red' />

              {/* <Tile key={`node-${id}`} text={id} x={x} y={y} /> */}
            </motion.g>
          );
        })}
      </svg>
    </section>
  );
};

export default Canvas;
