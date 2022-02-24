import { motion } from 'framer-motion';

const Tile = ({ text, x, y, style }) => (
  <motion.div
    animate={{ x, y, transform: 'translate(-50%, -50%)' }}
    style={style}
    className='tile'
  >
    {text}
  </motion.div>
);

export default Tile;
