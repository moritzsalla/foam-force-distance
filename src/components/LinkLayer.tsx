import type { Link } from "program";

type LinkLayerProps = {
	links: Link[];
};

const LinkLayer = ({ links = [] }: LinkLayerProps) => {
	return links.map(({}, i) => {
		return <line key={`link-${i}`} />;
	});
};

export default LinkLayer;
