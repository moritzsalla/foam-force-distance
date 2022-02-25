import { useDrag } from '@use-gesture/react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { data as dataset } from '../data/index';
import '../styles.css';
import { graphProgram } from './graphProgram';
import Tile from './Tile';

const ZOOM_LEVEL = 3;

/**
 * Component state handled by react.
 * Any repeated positioning/animation should be handled outside of react state.
 * @example https://github.com/d3/d3-force
 * @example https://observablehq.com/@d3/temporal-force-directed-graph?collection=@d3/d3-force
 * @note D3 works implicitly
 */
const ReactiveSVGCanvas = () => {
  // storing mutated data in ref to persist between renders
  const graphRef = useRef(graphProgram(dataset));

  // cleanup
  useEffect(() => graphRef.current?.cleanup(), [graphRef]);

  const x = useSpring(0, { stiffness: 300, damping: 30 });
  const y = useSpring(0, { stiffness: 300, damping: 30 });
  const normX = useTransform(x, [0, window.innerWidth * 2], [-100, 100]);
  const normY = useTransform(y, [0, window.innerHeight * 2], [-100, 100]);

  const bind = useDrag(({ xy }) => {
    x.set(xy[0]);
    y.set(xy[1]);
  });

  // for 1 / 1 zoom level
  // const viewBox = [
  //   -window.innerWidht * 0.5,
  //   -window.innerHeight * 0.5,
  //   window.innerWidth,
  //   window.innerHeight,
  // ];

  const viewBox = [
    (-window.innerWidth / 2) * ZOOM_LEVEL,
    (-window.innerHeight / 2) * ZOOM_LEVEL,
    window.innerWidth * ZOOM_LEVEL,
    window.innerHeight * ZOOM_LEVEL,
  ];

  return (
    <section className='canvas' {...bind()}>
      <motion.div
        className='canvas-draggable-inner'
        // style={{ x: normX, y: normY }}
      >
        <motion.svg className='svg' viewBox={viewBox}>
          {/* link layer */}
          {graphRef.current?.links?.map(({ source, target }, index) => (
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
          {graphRef.current?.nodes?.map(({ id, x, y }) => {
            const boxWidth = 200;
            const boxHeight = 200;

            return (
              <motion.g
                key={`layer-${id}`}
                className='layer'
                animate={{ x, y }}
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
        </motion.svg>
      </motion.div>
    </section>
  );
};

export default ReactiveSVGCanvas;
