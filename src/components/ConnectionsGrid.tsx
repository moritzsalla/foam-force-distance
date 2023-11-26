import dataLinks from "data/links.json";
import dataNodes from "data/nodes.json";

import { useEffect } from "react";
import styled from "styled-components";

import ConnectionsGraph, { type Data, type Link, type Node } from "../program";

import "styles/main.css";
import LinkLayer from "./LinkLayer";
import NodeLayer from "./NodeLayer";

const ConnectionsGrid = () => {
	useEffect(() => {
		// Create the graph when the component mounts
		const graph = new ConnectionsGraph({
			data: {
				links: dataLinks.links as Data["links"],
				nodes: dataNodes.nodes as Data["nodes"],
			},
			width: window.innerWidth,
			height: window.innerHeight,
		});

		// Destroy the graph when the component unmounts
		return () => {
			graph.destroy();
		};
	}, []);

	return (
		<StyledContainer>
			<StyledSvg>
				<g>
					<LinkLayer links={dataLinks.links as Link[]} />
					<NodeLayer nodes={dataNodes.nodes as Node[]} />
				</g>
			</StyledSvg>
		</StyledContainer>
	);
};

const StyledContainer = styled.div`
	position: relative;
	background: black;
	color: white;
	height: 100vh;
	width: 100vw;
	overflow: hidden;
`;

const StyledSvg = styled.svg`
	height: 100%;
	width: 100%;
`;

export default ConnectionsGrid;
