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
      .force('charge', d3.forceManyBody())
      .force(
        'link',
        d3.forceLink().id((d) => d.id)
      )
      .force('x', d3.forceX())
      .force('y', d3.forceY());

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
      {nodes?.map(({ x = 0, y = 0, vy = 0, vx = 0, id }) => (
        <Tile key={`node-${id}`} text={id} x={x + vx} y={y + vy} />
      ))}
    </section>
  );
};

export default Canvas;
