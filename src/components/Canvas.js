import * as d3 from 'd3';
import { forceSimulation } from 'd3-force';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { data } from '../data/index';
import '../styles.css';
import Tile from './Tile';

/**
 * Component state handled by react
 * Positioning/animation handled OUTSIDE OF REACT by framer
 * @example https://github.com/d3/d3-force
 * @example https://observablehq.com/@d3/temporal-force-directed-graph?collection=@d3/d3-force
 * @note D3 mutates original data
 */

const Canvas = () => {
  useEffect(() => {
    const simulation = forceSimulation()
      .nodes(data.nodes)
      .force('charge', d3.forceManyBody().strength(-50))
      .force('center', d3.forceCenter(0, 0).strength(0.4))
      .force(
        'collide',
        d3
          .forceCollide()
          .strength(-0.2)
          .radius(10) // component bounds
          .iterations(2)
      )
      .force(
        'link',
        d3
          .forceLink()
          .id((d) => d.id) // source, target, value
          .links(data.links)
          .strength(0.008)
      )
      .force('x', d3.forceX().strength())
      .force('y', d3.forceY().strength());

    return () => {
      simulation.on('end', () => console.log('simulation end'));
      simulation.stop();
    };
  }, []);

  return (
    <section className='canvas'>
      <svg
        className='layer-container'
        viewBox={[
          -window.innerWidth / 2,
          -window.innerHeight / 2,
          window.innerWidth,
          window.innerHeight,
        ]}
      >
        {/* link layer */}
        {data?.links?.map(({ source, target }, index) => (
          <line
            key={`link-${index}`}
            className='line-link'
            stroke='grey'
            x1={source.x}
            y1={source.y}
            x2={target.x}
            y2={target.y}
          />
        ))}

        {/* component layer */}
        {data?.nodes?.map(({ id, x, y, vx, vy }) => {
          const boxWidth = 160;
          const boxHeight = 40;

          return (
            <motion.g
              key={`layer-${id}`}
              className='layer'
              style={{ x: x + vx, y: y + vy }}
            >
              <foreignObject
                width={boxWidth}
                height={boxHeight}
                x={-boxWidth / 2}
                y={-boxHeight / 2}
              >
                <Tile key={`node-${id}`} text={id} />
              </foreignObject>

              {/* <rect
                className='center-dot'
                width='5px'
                height='5px'
                fill='red'
              /> */}
            </motion.g>
          );
        })}
      </svg>
    </section>
  );
};

export default Canvas;
