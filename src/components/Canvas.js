import '../styles.css';

import { useEffect, useRef } from 'react';
import Tile from './Tile';

import * as d3 from 'd3';
import { forceSimulation } from 'd3-force';
import { data } from '../data/index';

/**
 * Component state handled by react
 * Positioning/animation handled OUTSIDE OF REACT by framer
 */

const Canvas = () => {
  const ref = useRef();

  useEffect(() => {
    if (!ref) {
      console.error('no ref found');
      return;
    }

    const simulation = forceSimulation(data.nodes)
      .force('x', d3.forceX((d) => d.x).strength(0.05))
      .force('y', d3.forceY((d) => d.y).strength(0.05))
      .force(
        'collide',
        d3.forceCollide((d) => d.r + 1)
      );

    // access data like this: simulation.nodes()
    const handleTick = () => {
      simulation.stop();
      const nodes = simulation.nodes();
      console.log(nodes);
    };
    simulation.on('tick', handleTick);

    return () => {
      simulation.stop();
      simulation.on('end', () => console.log('simulation end'));
    };
  }, []);

  return (
    <section ref={ref} className='canvas'>
      <Tile x={20} y={100} />
    </section>
  );
};

export default Canvas;
