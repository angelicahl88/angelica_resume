import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { sankey, sankeyLinkHorizontal } from 'd3-sankey';

export default class Graph extends Component {
   static PropTypes : {
      graphData: Proptypes.shape
   }

   constructor() {
      super();

      this.state = {
         graphContainerWidth: 500,
         hoveredNode: null,
         resizeTime: 200
      }
   }

   componentDidMount() {

      window.addEventListener('resize', () => {
         clearTimeout(this.resizeTimeout);
         this.resizeTimeout = setTimeout(() => this._handleResize(), this.state.resizeTime);
      });
   }

   _handleResize() {
      const graphContainer = ReactDOM.findDOMNode(this.refs.sankeyContainer);

      this.setState({
         graphContainerWidth: graphContainer.getBoundingClientRect().width
      });
   }

   _getLinkHoverClass(link) {
      const { hoveredNode } = this.state;

      if (hoveredNode === null) {
         return 'link';
      }

      if (hoveredNode === link.source.node || hoveredNode === link.target.node) {
         return 'link active';
      }

      if (hoveredNode !== link.source.node || hoveredNode !== link.target.node) {
         return 'link inactive';
      }
   }

   _handleNodeEnter({nativeEvent}, node) {
      this.setState({
         hoveredNode: node.node
      });
   }

   _handleNodeLeave({nativeEvent}) {
      this.setState({
         hoveredNode: null
      });
   }

   _getNodeTextElement(node) {
      const leftNode = node.x0 < 400 / 2;

      const xPos = leftNode ? 16 : -20;
      const yPos = (node.y1 - node.y0) / 2;
      const anchor = leftNode ? 'start' : 'end';

      return (
         <text
            id={`textId${node.value}`}
            dx={xPos}
            dy={yPos}
            textAnchor={anchor}
         >
            { node.name }
         </text>
      );
   }

   _getSankeyGraph() {
      return sankey()
         .nodeWidth(10)
         .nodePadding(10)
         .extent([[0,0], [this.state.graphContainerWidth, 598]])
         .nodes(this.props.graphData.nodes)
         .links(this.props.graphData.links);
   }


   render() {
      const sankeyGraph = this._getSankeyGraph();
      const nodes = sankeyGraph().nodes;
      const links = sankeyGraph().links;
      const linkPath = sankeyLinkHorizontal();
      const nodeTextElement = this._getNodeTextElement;


      return (
         <div id="sankey" ref='sankeyContainer'>

            <svg width={this.state.graphContainerWidth} height="600">
               <g className="graphLinks">
                  {
                     links.map((link, index) => (
                        <path
                           key={`${link.value}${index}`}
                           id={`link${link.source.node}`}
                           className={this._getLinkHoverClass(link)}
                           d={ linkPath(link) }
                           strokeWidth="2"
                           strokeDasharray="2,2"
                        />
                     ))
                  }
               </g>
               <g className="graphNodes">
                  {
                     nodes.map((node, index) => (
                        <g
                           key={node.node}
                           className="node"
                           transform={`translate(${node.x0}, ${node.y0 + 2})`}
                        >
                           <rect
                              id={`id${index}`}
                              height={node.y1 - node.y0}
                              width={node.x1 - node.x0}
                              rx="5"
                              ry="5"
                              onMouseEnter={(e) => this._handleNodeEnter(e, node)}
                              onMouseLeave={(e) => this._handleNodeLeave(e)}
                           />
                           {
                              nodeTextElement(node)
                           }
                        </g>
                     ))
                  }
               </g>
            </svg>

         </div>
      )
   }
}
