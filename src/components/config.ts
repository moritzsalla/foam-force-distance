import ButtonNode from "./node/ButtonNode";
import ImageNode from "./node/ImageNode";
import QuoteNode from "./node/QuoteNode";

type NodeElMap = {
	[key: string]: {
		Comp: React.FC;
		dimensions: {
			width: number;
			height: number;
		};
	};
};

export const NODE_ELEMENTS: NodeElMap = {
	button: {
		Comp: ButtonNode,
		dimensions: {
			width: 200,
			height: 200,
		},
	},
	image: {
		Comp: ImageNode,
		dimensions: {
			width: 100,
			height: 100,
		},
	},
	quote: {
		Comp: QuoteNode,
		dimensions: {
			width: 300,
			height: 100,
		},
	},
};
