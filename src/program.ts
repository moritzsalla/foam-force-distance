import {
	select,
	selectAll,
	zoomTransform,
	type Selection,
	type BaseType,
	zoomIdentity,
	pointer,
	zoom,
} from "d3";
import {
	forceCenter,
	forceCollide,
	forceLink,
	forceManyBody,
	forceSimulation,
	type Simulation,
	type SimulationNodeDatum,
} from "d3-force";

export type Node = {
	group: number;
	type: "button" | "image" | "quote";
	id: string;
};

export type Link = {
	group: number;
	source: string;
	target: string;
};

export type Data = {
	nodes: Node[];
	links: Link[];
};

type Init = {
	data: Data;
	width: number;
	height: number;
};

class ConnectionsGenerator {
	#data: Data | null = null;
	#width: number;
	#height: number;

	#svg: Selection<BaseType, unknown, HTMLElement, any>;
	#links: Selection<BaseType, unknown, HTMLElement, any>;
	#container: Selection<BaseType, unknown, HTMLElement, any>;
	#nodes: Selection<BaseType, unknown, HTMLElement, any>;

	#simulation: Simulation<SimulationNodeDatum, undefined> | null = null;

	#maxZoomLevel = 2;
	#strokeWidth = 1;
	#transitionDuration = 550;

	/**
	 * D3 simulation rendering react components.
	 * @see https://github.com/d3/d3-force
	 * @see https://observablehq.com/@d3/temporal-force-directed-graph?collection=@d3/d3-force
	 * @see https://observablehq.com/@d3/drag-zoom?collection=@d3/d3-drag
	 */
	constructor({ data, width, height }: Init) {
		this.#data = data;
		this.#width = width || window.innerWidth;
		this.#height = height || window.innerHeight;

		this.#svg = select("svg");
		this.#links = selectAll("line");
		this.#container = select("g");
		this.#nodes = selectAll("foreignObject");

		this.init();
	}

	init = () => {
		this.#baseStyles();
		this.#bindData();
		this.#simulationRun();
		this.#gestures();
	};

	destroy = () => {
		this.#simulation?.stop();
	};

	#bindData = () => {
		if (this.#data) {
			this.#links?.data(this.#data.links);
		}
	};

	#baseStyles = () => {
		const viewBox = [
			-this.#width / 2,
			-this.#height / 2,
			this.#width,
			this.#height,
		];

		this.#svg?.attr("viewBox", viewBox);
		this.#nodes?.attr("cursor", "pointer");
		this.#links?.style("transition", "stroke 0.5s ease");
		this.#links?.style("stroke", "grey");
	};

	#getZoomLevel = () => {
		const elem = this.#container?.node() as Element;
		return Math.round(zoomTransform(elem)?.k);
	};

	#ticker = () => {
		if (this.#nodes && this.#data) {
			this.#nodes
				.data(this.#data.nodes)
				// @ts-expect-error - where to get d3 types?
				.attr("transform", (node) => `translate(${node.x}, ${node.y})`);
		}

		if (this.#links) {
			this.#links
				// @ts-expect-error - where to get d3 types?
				.attr("x1", ({ source }) => source.x)
				// @ts-expect-error - where to get d3 types?
				.attr("y1", ({ source }) => source.y)
				// @ts-expect-error - where to get d3 types?
				.attr("x2", ({ target }) => target.x)
				// @ts-expect-error - where to get d3 types?
				.attr("y2", ({ target }) => target.y);
		}
	};

	#simulationRun = () => {
		this.#simulation = forceSimulation()
			.nodes(this.#data?.nodes as SimulationNodeDatum[])
			.force(
				"link",
				forceLink(this.#data?.links)
					// @ts-expect-error - where to get d3 types?
					.id(({ id }) => id)
					.strength(0.025)
			)
			.force("charge", forceManyBody().strength(400))
			.force("collide", forceCollide().radius(200).iterations(1).strength(1))
			.force("center", forceCenter().strength(1))
			.on("tick", this.#ticker);
	};

	#gestures = () => {
		// @ts-expect-error - where to get d3 types?
		const handleClicked = (event: Event, { x, y, group: nodeGroup }) => {
			// @ts-expect-error - where to get d3 types?
			this.#links?.style("stroke", ({ linkGroup }) =>
				linkGroup === nodeGroup ? "red" : "grey"
			);

			if (this.#getZoomLevel() !== this.#maxZoomLevel) {
				event.stopPropagation();
			}

			this.#svg?.transition().duration(this.#transitionDuration).call(
				// @ts-expect-error - where to get d3 types?
				zoom.transform,
				zoomIdentity.scale(this.#maxZoomLevel).translate(-x, -y),
				pointer(event, this.#container?.node())
			);
		};

		const handleWheeled = () => {
			if (this.#getZoomLevel() === this.#maxZoomLevel) {
				resetView();
			}
		};

		// @ts-expect-error - where to get d3 types?
		const handleMouseOver = (e: Event, { group: nodeGroup }) => {
			// @ts-expect-error - where to get d3 types?
			this.#links?.style("stroke", ({ group: linkGroup }) => {
				return linkGroup === nodeGroup ? "red" : "grey";
			});
		};

		const handleMouseOut = () => {
			this.#links?.style("stroke", "grey");
		};

		const zoomHandler = () => {
			zoom()
				.scaleExtent([1, this.#maxZoomLevel])
				.translateExtent([
					[-this.#width, -this.#height],
					[this.#width, this.#height],
				])
				.on("zoom", ({ transform, sourceEvent }) => {
					if (sourceEvent?.type === "mousemove")
						this.#svg?.attr("cursor", "grabbing");
					this.#container?.attr("transform", transform);
					this.#container?.attr(
						"stroke-width",
						this.#strokeWidth / transform.k
					);
				})
				.on("end", () => {
					this.#svg?.attr("cursor", "auto");
				});
		};

		const resetView = () => {
			this.#links?.style("stroke", "grey");

			this.#svg
				?.transition()
				.duration(this.#transitionDuration)
				.call(
					// @ts-expect-error - where to get d3 types?
					zoom.transform,
					zoomIdentity,
					zoomTransform(this.#container?.node() as Element).invert([
						this.#width * 0.5,
						this.#height * 0.5,
					])
				);
		};

		this.#svg?.call(zoomHandler);

		this.#svg?.on("click", resetView);
		this.#svg?.on("wheel.zoom", handleWheeled);
		// @ts-expect-error - where to get d3 types?
		this.#nodes?.on("mouseover", handleMouseOver);
		this.#nodes?.on("mouseout", handleMouseOut);
		// @ts-expect-error - where to get d3 types?
		this.#nodes?.on("click", handleClicked);
	};
}

export default ConnectionsGenerator;
