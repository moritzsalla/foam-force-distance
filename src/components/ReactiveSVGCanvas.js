import { useEffect } from 'react';
import '../styles.css';
import program from './program';
import Tile from './Tile';
import { data } from '../data/';

/**
 * D3 simulation rendering react components.
 * @note goal is to outsource the position updates to the simulation
 * @example https://github.com/d3/d3-force
 * @example https://observablehq.com/@d3/temporal-force-directed-graph?collection=@d3/d3-force
 */
const ReactiveSVGCanvas = () => {
  useEffect(() => {
    program();
    return () => program.destroy();
  }, []);

  return (
    <section className='canvas'>
      <div className='canvas-draggable-inner'>
        <svg className='svg'>
          <g className='inner-container'>
            {/* link layer */}
            {data?.links?.map((_, index) => (
              <line
                key={`link-${index}`}
                className='line-link'
                stroke='white'
              />
            ))}

            {/* component layer */}
            {data?.nodes?.map(({ id, group }, index) => {
              const boxWidth = 100;
              const boxHeight = 100;

              return (
                <g key={`layer-${index}`} className='layer'>
                  <foreignObject
                    x={-boxWidth * 0.5}
                    y={-boxHeight * 0.5}
                    width={boxWidth}
                    height={boxHeight}
                  >
                    <Tile key={`node-${id}`} text={group} />
                  </foreignObject>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </section>
  );
};

export default ReactiveSVGCanvas;
