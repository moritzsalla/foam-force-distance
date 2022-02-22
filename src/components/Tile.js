import { motion } from "framer-motion";

const Tile = ({ id = "tile", x, y }) => {
  return (
    <motion.div
      animate={{ x, y, transform: "translate(-50%, -50%)" }}
      className="tile"
    >
      {id}
    </motion.div>
  );
};

export default Tile;
