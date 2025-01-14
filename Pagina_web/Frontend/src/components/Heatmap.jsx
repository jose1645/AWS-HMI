import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import "../styles/Heatmap.css";

const Heatmap = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    const margin = { top: 50, right: 30, bottom: 50, left: 70 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Configurar o limpiar el SVG
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Limpia el SVG antes de redibujar

    const g = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Extraer valores únicos para los ejes
    const phases = [...new Set(data.map((d) => d.phase))];
    const times = [...new Set(data.map((d) => d.time))];

    // Crear escalas
    const xScale = d3
      .scaleBand()
      .domain(times)
      .range([0, width])
      .padding(0.05);

    const yScale = d3
      .scaleBand()
      .domain(phases)
      .range([0, height])
      .padding(0.05);

    const colorScale = d3
      .scaleSequential()
      .interpolator(d3.interpolateReds)
      .domain([0, d3.max(data, (d) => d.difference)]);

    // Dibujar ejes
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickSize(0))
      .selectAll("text")
      .style("text-anchor", "middle")
      .style("font-size", "12px");

    g.append("g")
      .call(d3.axisLeft(yScale).tickSize(0))
      .selectAll("text")
      .style("font-size", "12px");

    // Agregar rectángulos del heatmap
    g.selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", (d) => xScale(d.time))
      .attr("y", (d) => yScale(d.phase))
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth())
      .style("fill", (d) => colorScale(d.difference))
      .style("stroke", "white")
      .on("mouseover", function (event, d) {
        d3.select(this).style("opacity", 0.8);
      })
      .on("mouseout", function (event, d) {
        d3.select(this).style("opacity", 1);
      });

    // Etiquetas dentro de las celdas
    g.selectAll(".label")
      .data(data)
      .join("text")
      .attr("x", (d) => xScale(d.time) + xScale.bandwidth() / 2)
      .attr("y", (d) => yScale(d.phase) + yScale.bandwidth() / 2)
      .attr("dy", ".35em")
      .text((d) => d.difference.toFixed(2))
      .style("text-anchor", "middle")
      .style("fill", "#000")
      .style("font-size", "10px");
  }, [data]);

  return (
    <div className="heatmap-container">
      <h2 className="heatmap-title">Mapa de Calor: Diferencias de Voltaje mes</h2>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default Heatmap;