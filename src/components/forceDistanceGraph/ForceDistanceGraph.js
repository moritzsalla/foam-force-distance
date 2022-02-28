import ButtonTile from 'components/ButtonTile';
import program from 'components/forceDistanceGraph/program';
import ImageTile from 'components/ImageTile';
import QuoteTile from 'components/QuoteTile';

import { data } from 'data/';
import { useEffect } from 'react';
import 'styles/main.css';

const GROUP_COMP_MAP = {
  0: {
    Comp: ImageTile,
    dimensions: [200, 200],
  },
  1: {
    Comp: ImageTile,
    dimensions: [100, 100],
  },
  2: {
    Comp: ButtonTile,
    dimensions: [100, 50],
  },
  3: {
    Comp: QuoteTile,
    dimensions: [300, 100],
  },
};

/**
 * D3 simulation rendering react components.
 * @note goal is to outsource the position updates to the simulation
 * @example https://github.com/d3/d3-force
 * @example https://observablehq.com/@d3/temporal-force-directed-graph?collection=@d3/d3-force
 * @example https://observablehq.com/@d3/drag-zoom?collection=@d3/d3-drag
 */
const ForceDistanceGraph = () => {
  useEffect(() => {
    const graphProgram = program();
    return () => graphProgram.destroy();
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
              const Comp = GROUP_COMP_MAP[group]?.Comp || (() => <></>);
              const [width, height] = GROUP_COMP_MAP[group]?.dimensions || [];

              return (
                <g key={`layer-${index}`} className='layer'>
                  <foreignObject
                    x={-width * 0.5}
                    y={-height * 0.5}
                    width={width}
                    height={height}
                  >
                    <Comp key={`node-${id}`} text={group} />
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

export default ForceDistanceGraph;
