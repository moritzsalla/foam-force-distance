import { useMemo } from "react";
import { NODE_ELEMENTS } from "./config";

import type { Node } from "program";

type NodeLayerProps = {
	nodes: Node[];
};

const NodeLayer = ({ nodes }: NodeLayerProps) => {
	return nodes.map(({ type }, i) => {
		const [El, { width = 0, height = 0 } = {}] = useMemo(() => {
			return [
				NODE_ELEMENTS[type]?.Comp || (() => <></>),
				NODE_ELEMENTS[type]?.dimensions,
			] as const;
		}, []);

		return (
			<foreignObject
				key={`node-${i}`}
				x={-width * 0.5}
				y={-height * 0.5}
				width={width}
				height={height}
			>
				<El />
			</foreignObject>
		);
	});
};

export default NodeLayer;
