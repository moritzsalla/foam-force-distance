export const Dot = ({ d = 20 }) => (
  <rect
    className='center-dot'
    width={d}
    height={d}
    fill='red'
    x={-d / 2}
    y={-d / 2}
  />
);
