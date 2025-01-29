import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "../styles/Histograma.css";

const ConsumoElectrico = ({ data }) => {
  const svgRef = useRef();
  const [filtro, setFiltro] = useState("dia");
  const [datosFiltrados, setDatosFiltrados] = useState(data);

  useEffect(() => {
    let datosFiltrados = data;
    const ahora = new Date();
    const inicio = new Date();

    switch (filtro) {
      case "semana":
        inicio.setDate(1); // Primer día del mes actual
        datosFiltrados = data.filter((d) => {
          const fecha = new Date(d.fecha);
          return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear();
        });
        break;
      case "mes":
        inicio.setMonth(0); // Primer mes del año actual
        inicio.setDate(1);
        datosFiltrados = data.filter((d) => {
          const fecha = new Date(d.fecha);
          return fecha.getFullYear() === ahora.getFullYear();
        });
        break;
      case "año":
        inicio.setFullYear(ahora.getFullYear() - 9);
        inicio.setMonth(0);
        inicio.setDate(1);
        datosFiltrados = data.filter((d) => {
          const fecha = new Date(d.fecha);
          return fecha.getFullYear() >= ahora.getFullYear() - 9;
        });
        break;
      default:
        inicio.setDate(1); // Días transcurridos del mes actual
        datosFiltrados = data.filter((d) => {
          const fecha = new Date(d.fecha);
          return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear();
        });
    }

    setDatosFiltrados(datosFiltrados);
  }, [filtro, data]);

  useEffect(() => {
    if (!datosFiltrados || datosFiltrados.length === 0) return; // Asegúrate de que no esté vacío

    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3
    .scaleTime()
    .domain(d3.extent(datosFiltrados, (d) => new Date(d.fecha_hora))) // Cambié d.fecha por d.fecha_hora
    .range([0, innerWidth]);


    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(datosFiltrados, (d) => d.consumo)])
      .range([innerHeight, 0]);

    const xAxis = d3.axisBottom(xScale).ticks(5);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(xAxis)
      .append("text")
      .attr("fill", "#000")
      .attr("x", innerWidth / 2)
      .attr("y", 40)
      .attr("text-anchor", "middle")
      .text("Tiempo");

    svg.append("g")
      .call(yAxis)
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -40)
      .attr("text-anchor", "middle")
      .text("Consumo (kWh)");

      svg.selectAll("rect")
      .data(datosFiltrados)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(new Date(d.fecha_hora))) // Cambié d.fecha por d.fecha_hora
      .attr("y", (d) => yScale(d.consumo))
      .attr("width", 10)
      .attr("height", (d) => innerHeight - yScale(d.consumo))
      .attr("fill", "steelblue");
  }, [datosFiltrados]);

  return (
    <div>
      <label>Filtrar por: </label>
      <select onChange={(e) => setFiltro(e.target.value)} value={filtro}>
        <option value="dia">Días del mes</option>
        <option value="semana">Semanas del mes</option>
        <option value="mes">Meses del año</option>
        <option value="año">Últimos 10 años</option>
      </select>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default ConsumoElectrico;
