import { motion } from 'framer-motion';
import { createRef, useEffect, useMemo, useRef } from 'react';
import '../styles.css';
import { d3Sim } from './simulation';
import Tile from './Tile';

const ZOOM_LEVEL = 2;

const Dot = ({ d = 20 }) => (
  <rect
    className='center-dot'
    width={d}
    height={d}
    fill='red'
    x={-d / 2}
    y={-d / 2}
  />
);

/**
 * Component state handled by react.
 * Any repeated positioning/animation should be handled outside of react state.
 * @example https://github.com/d3/d3-force
 * @example https://observablehq.com/@d3/temporal-force-directed-graph?collection=@d3/d3-force
 * @note D3 works implicitly
 */
const ReactiveSVGCanvas = () => {
  const {
    current: { data, update, destroy },
  } = useRef(d3Sim());

  const nodeRefs = useMemo(() => {
    const refs = [];
    /* eslint-disable no-unused-expressions */
    data?.nodes?.forEach(({ id }) => {
      refs[id] = createRef(null);
    });
    return refs;
  }, [data]);

  useEffect(() => {
    update();
    return () => destroy();
  }, [nodeRefs, update, destroy]);

  // const x = useSpring(0, { stiffness: 300, damping: 30 });
  // const y = useSpring(0, { stiffness: 300, damping: 30 });
  // const normX = useTransform(x, [0, window.innerWidth * 2], [-100, 100]);
  // const normY = useTransform(y, [0, window.innerHeight * 2], [-100, 100]);

  // const bind = useDrag(({ xy }) => {
  //   x.set(xy[0]);
  //   y.set(xy[1]);
  // });

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
    <section className='canvas'>
      <motion.div
        className='canvas-draggable-inner'
        // style={{ x: normX, y: normY }}
      >
        <motion.svg className='svg' viewBox={viewBox}>
          {/* link layer */}
          {data?.links?.map(({ source, target }, index) => (
            <line
              key={`link-${index}`}
              className='line-link'
              stroke='white'
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
            />
          ))}

          {/* component layer */}
          {data?.nodes?.map(({ id }, index) => {
            const boxWidth = 200;
            const boxHeight = 200;
            return (
              <motion.g
                key={`layer-${index}`}
                ref={nodeRefs[id]}
                className='layer'
              >
                <foreignObject
                  x={-boxWidth / 2}
                  y={-boxHeight / 2}
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
