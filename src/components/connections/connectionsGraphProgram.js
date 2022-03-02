import * as d3 from 'd3';
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
} from 'd3-force';

/**
 * todo: zoom out on drag
 * todo: highlight groups on zoom level 2
 */

class ConnectionsGraph {
  #simulation = {};
  #maxZoomLevel = 2;
  #strokeWidth = 1;
  #transitionDuration = 550;

  constructor({
    data,
    width,
    height,
    targetElems: {
      svg = 'svg',
      container = 'g',
      links = 'line',
      nodes = 'foreignObject',
    } = {},
  }) {
    this.data = data;
    this.width = width || window.innerWidth;
    this.height = height || window.innerHeight;

    this.svg = d3.select(svg);
    this.links = d3.selectAll(links);
    this.container = d3.select(container);
    this.nodes = d3.selectAll(nodes);

    this.init();
  }

  init = () => {
    this.#baseStyles();
    this.#bindData();
    this.#simulationRun();
    this.#gestures();
  };

  destroy = () => {
    this.#simulation.stop();
  };

  #bindData = () => {
    this.links.data(this.data.links);
  };

  #baseStyles = () => {
    const viewbox = [
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height,
    ];
    this.svg.attr('viewBox', viewbox);
    this.nodes.attr('cursor', 'pointer');
    this.links.style('transition', 'stroke 0.5s ease');
    this.links.style('stroke', 'grey');
  };

  #getZoomLevel = () => {
    const elem = this.container.node();
    return Math.round(d3.zoomTransform(elem)?.k);
  };

  #ticker = () => {
    this.nodes
      .data(this.data.nodes)
      .attr('transform', ({ x, y }) => `translate(${x}, ${y})`);

    this.links
      .attr('x1', ({ source }) => source.x)
      .attr('y1', ({ source }) => source.y)
      .attr('x2', ({ target }) => target.x)
      .attr('y2', ({ target }) => target.y);
  };

  #simulationRun = () => {
    this.#simulation = forceSimulation()
      .nodes(this.data.nodes)
      .force(
        'link',
        forceLink(this.data.links)
          .id(({ id }) => id)
          .strength(0.025)
      )
      .force('charge', forceManyBody().strength(400))
      .force('collide', forceCollide().radius(200).iterations(1).strength(1))
      .force('center', forceCenter().strength(1))
      .on('tick', this.#ticker);
  };

  #gestures = () => {
    const handleClicked = (event, { x, y, group: nodeGroup }) => {
      this.links.style('stroke', ({ linkGroup }) =>
        linkGroup === nodeGroup ? 'red' : 'grey'
      );

      if (this.#getZoomLevel() !== this.#maxZoomLevel) {
        event.stopPropagation();
      }

      this.svg
        .transition()
        .duration(this.#transitionDuration)
        .call(
          zoom.transform,
          d3.zoomIdentity.scale(this.#maxZoomLevel).translate(-x, -y),
          d3.pointer(event, this.container.node())
        );
    };

    const handleWheeled = () => {
      if (this.#getZoomLevel() === this.#maxZoomLevel) {
        resetView();
      }
    };

    const handleMouseOver = (_, { group: nodeGroup }) => {
      this.links.style('stroke', ({ group: linkGroup }) => {
        return linkGroup === nodeGroup ? 'red' : 'grey';
      });
    };

    const handleMouseOut = () => {
      this.links.style('stroke', 'grey');
    };

    const zoom = d3
      .zoom()
      .scaleExtent([1, this.#maxZoomLevel])
      .translateExtent([
        [-this.width, -this.height],
        [this.width, this.height],
      ])
      .on('start', () => {
        // if (getZoomLevel() !== 0) resetView();
      })
      .on('zoom', ({ transform, sourceEvent }) => {
        if (sourceEvent?.type === 'mousemove')
          this.svg.attr('cursor', 'grabbing');
        this.container.attr('transform', transform);
        this.container.attr('stroke-width', this.#strokeWidth / transform.k);
      })
      .on('end', () => {
        this.svg.attr('cursor', 'auto');
      });

    const resetView = () => {
      this.links.style('stroke', 'grey');

      this.svg
        .transition()
        .duration(this.#transitionDuration)
        .call(
          zoom.transform,
          d3.zoomIdentity,
          d3
            .zoomTransform(this.container.node())
            .invert([this.width * 0.5, this.height * 0.5])
        );
    };

    this.svg.call(zoom);
    this.svg.on('click', resetView);
    this.svg.on('wheel.zoom', handleWheeled);
    this.nodes.on('mouseover', handleMouseOver);
    this.nodes.on('mouseout', handleMouseOut);
    this.nodes.on('click', handleClicked);
  };
}

export default ConnectionsGraph;
