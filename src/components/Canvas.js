import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { data as dataset } from '../data/index';
import '../styles.css';
import { graphProgram } from './graphProgram';
import Tile from './Tile';

const ZOOM_LEVEL = 1; // you'll probably want to use 1 here

/**
 * Component state handled by react
 * Positioning/animation handled OUTSIDE OF REACT by framer
 * @example https://github.com/d3/d3-force
 * @example https://observablehq.com/@d3/temporal-force-directed-graph?collection=@d3/d3-force
 * @note D3 mutates original data
 */
const Canvas = () => {
  const graphRef = useRef(graphProgram(dataset));

  useEffect(() => graphRef.current.cleanup(), [graphRef]);

  return (
    <section className='canvas'>
      <svg
        className='layer-container'
        viewBox={[
          (-window.innerWidth / 2) * ZOOM_LEVEL,
          (-window.innerHeight / 2) * ZOOM_LEVEL,
          window.innerWidth * ZOOM_LEVEL,
          window.innerHeight * ZOOM_LEVEL,
        ]}
      >
        {/* link layer */}
        {graphRef.current.links?.map(({ source, target }, index) => (
          <motion.line
            key={`link-${index}`}
            className='line-link'
            stroke='grey'
            animate={{
              x1: source.x,
              y1: source.y,
              x2: target.x,
              y2: target.y,
            }}
          />
        ))}

        {/* component layer */}
        {graphRef.current.nodes?.map(({ id, x, y }) => {
          const boxWidth = 200;
          const boxHeight = 200;

          return (
            <motion.g key={`layer-${id}`} className='layer' animate={{ x, y }}>
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
