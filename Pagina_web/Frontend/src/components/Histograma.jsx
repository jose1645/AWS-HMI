import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import "../styles/Histograma.css";

const HistogramaConsumo = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    // Configuración del SVG
    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };

    // Limpiar el contenido previo
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Crear escalas
    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data)])
      .range([0, innerWidth]);

    const histogram = d3
      .histogram()
      .domain(xScale.domain())
      .thresholds(xScale.ticks(10));

    const bins = histogram(data);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(bins, (d) => d.length)])
      .range([innerHeight, 0]);

    // Dibujar ejes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg
      .append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(xAxis)
      .append('text')
      .attr('fill', '#000')
      .attr('x', innerWidth / 2)
      .attr('y', 40)
      .attr('text-anchor', 'middle')
      .text('Consumo (kWh)');

    svg
      .append('g')
      .call(yAxis)
      .append('text')
      .attr('fill', '#000')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -40)
      .attr('text-anchor', 'middle')
      .text('Frecuencia');

    // Dibujar barras
    svg
      .selectAll('rect')
      .data(bins)
      .enter()
      .append('rect')
      .attr('x', (d) => xScale(d.x0))
      .attr('y', (d) => yScale(d.length))
      .attr('width', (d) => xScale(d.x1) - xScale(d.x0) - 1)
      .attr('height', (d) => innerHeight - yScale(d.length))
      .attr('fill', 'steelblue');
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default HistogramaConsumo;

// Ejemplo de uso del componente
// En tu archivo App.js o similar:
// import React from 'react';
// import HistogramaConsumo from './HistogramaConsumo';

// const data = [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150];

// const App = () => (
//   <div>
//     <h1>Histograma del Consumo Diario</h1>
//     <HistogramaConsumo data={data} />
//   </div>
// );

// export default App;
