import { motion } from 'framer-motion';

const Tile = ({ text, x, y }) => {
  return (
    <motion.div
      animate={{ x, y, transform: 'translate(-50%, -50%)' }}
      className='tile'
    >
      {text}
    </motion.div>
  );
};

export default Tile;
