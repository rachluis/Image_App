
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { TreeNode } from '../types';

interface TreeRendererProps {
  data: TreeNode;
  width?: number;
  height?: number;
}

const TreeRenderer: React.FC<TreeRendererProps> = ({ data, width = 800, height = 500 }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create hierarchy
    const root = d3.hierarchy(data, d => {
      const children = [];
      if (d.left) children.push(d.left);
      if (d.right) children.push(d.right);
      return children;
    });

    const treeLayout = d3.tree<TreeNode>().size([innerWidth, innerHeight]);
    treeLayout(root);

    // Links
    g.selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d3.linkVertical()
        .x(d => (d as any).x)
        .y(d => (d as any).y) as any
      )
      .attr('fill', 'none')
      .attr('stroke', '#cbd5e1')
      .attr('stroke-width', 2);

    // Nodes
    const node = g.selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`);

    node.append('circle')
      .attr('r', 22)
      .attr('fill', '#fff')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 3)
      .style('filter', 'drop-shadow(0px 2px 2px rgba(0,0,0,0.1))');

    node.append('text')
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .text(d => d.data.value)
      .style('font-weight', '600')
      .style('font-size', '14px')
      .style('fill', '#1e293b')
      .style('user-select', 'none');

  }, [data, width, height]);

  return (
    <div className="w-full h-full flex items-center justify-center overflow-auto bg-white rounded-xl border border-slate-200 shadow-inner">
      <svg ref={svgRef} width={width} height={height}></svg>
    </div>
  );
};

export default TreeRenderer;
