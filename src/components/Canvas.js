import '../styles.css';

import { useEffect, useRef, useState } from 'react';
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
  const [nodes, createNodes] = useState([]); // how many nodes can we store in react state until it becomes unperformant?

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
      createNodes(simulation.nodes());
      console.log('tick');
      simulation.stop();
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
      {nodes?.map(({ x = 0, y = 0 }, i) => (
        <Tile key={`node-${i}`} text={`Node ${i}`} x={x} y={y} />
      ))}
    </section>
  );
};

export default Canvas;
