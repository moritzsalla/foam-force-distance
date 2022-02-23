import * as d3 from 'd3';
import { forceSimulation } from 'd3-force';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { data } from '../data/index';
import '../styles.css';

const contains = ({ start, end }, time) => start <= time && time < end;

/**
 * Component state handled by react
 * Positioning/animation handled OUTSIDE OF REACT by framer
 * @example https://github.com/d3/d3-force
 * @example https://observablehq.com/@d3/temporal-force-directed-graph?collection=@d3/d3-force
 * @note D3 mutates original data
 */

const Canvas = () => {
  const ref = useRef();
  const [nodes, setNodes] = useState(null); // how many nodes can we store in react state until it becomes unperformant?

  // const normalize = d3.scaleLinear().domain([0, 100]).range([-100, 100]);

  useEffect(() => {
    if (!ref) {
      console.error('no ref found');
      return;
    }

    /**
     * @note access data like this: simulation.nodes()
     *
     * index - the node’s zero-based index into nodes
     * x - the node’s current x-position
     * y - the node’s current y-position
     * vx - the node’s current x-velocity
     * vy - the node’s current y-velocity
     */
    const ticked = () => {
      const nodes = simulation.nodes();
      setNodes(nodes);
    };

    const simulation = forceSimulation()
      .nodes(data.nodes)
      .force('charge', d3.forceManyBody().strength(-30))
      .force('center', d3.forceCenter(0, 0).strength(0.4))
      .force(
        'collide',
        d3.forceCollide().strength(-0.2).radius(4).iterations(2)
      )
      .force(
        'link',
        d3
          .forceLink()
          .id((d) => d.id) // source, target, value
          .links(data.links)
          .strength(0.008)
      )
      .force('x', d3.forceX().strength(0.01))
      .force('y', d3.forceY().strength(0.01))
      .on('tick', ticked);

    return () => {
      setNodes(null);
      simulation.on('end', () => console.log('simulation end'));
      simulation.stop();
    };
  }, [nodes]);

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
        {nodes?.map(({ id, x, y, vx, vy }) => {
          const boxWidth = 160;
          const boxHeight = 40;

          return (
            <motion.g
              key={`layer-${id}`}
              className='layer'
              style={{ x: x + vx, y: y + vy }}
            >
              {/* <foreignObject
                width={boxWidth}
                height={boxHeight}
                x={-boxWidth / 2}
                y={-boxHeight / 2}
              >
                <Tile key={`node-${id}`} text={id} />
              </foreignObject> */}

              <rect
                className='center-dot'
                width='5px'
                height='5px'
                fill='red'
              />
            </motion.g>
          );
        })}
      </svg>
    </section>
  );
};

export default Canvas;
