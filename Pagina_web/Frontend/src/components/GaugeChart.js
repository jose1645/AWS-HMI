import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "../styles/GaugeChart.css"; // Estilos específicos para este componente

// Clase para la Aguja
class Needle {
  constructor(props) {
    this.svg = props.svg;
    this.group = this.svg.append("g").attr("class", "needle-group");
    this.len = props.len;
    this.radius = props.radius;
    this.x = props.x;
    this.y = props.y;
    this.lastP = 0; // Guarda el último progreso
  }

  render() {
    this.group.selectAll("*").remove();
    this.group.attr("transform", `translate(${this.x},${this.y})`);
    this.group
      .append("circle")
      .attr("class", "c-chart-gauge__needle-base")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", this.radius);
    this.group
      .append("path")
      .attr("class", "c-chart-gauge__needle")
      .attr("d", this._getPath(this.lastP));
  }

  animateTo(p) {
    this.group
      .transition()
      .duration(1000)
      .ease(d3.easeElastic)
      .select("path")
      .tween("progress", () => {
        const self = this;
        const lastP = this.lastP || 0;
        return function (step) {
          const progress = lastP + step * (p - lastP);
          d3.select(this).attr("d", self._getPath(progress));
        };
      })
      .on("end", () => (this.lastP = p));
  }

  _getPath(p) {
    const thetaRad = (-Math.PI / 2) + (Math.PI * p),
      centerX = 0,
      centerY = 0,
      topX = centerX - this.len * Math.cos(thetaRad),
      topY = centerY - this.len * Math.sin(thetaRad),
      leftX = centerX - this.radius * Math.cos(thetaRad - Math.PI / 2),
      leftY = centerY - this.radius * Math.sin(thetaRad - Math.PI / 2),
      rightX = centerX - this.radius * Math.cos(thetaRad + Math.PI / 2),
      rightY = centerY - this.radius * Math.sin(thetaRad + Math.PI / 2);
    return `M ${leftX} ${leftY} L ${topX} ${topY} L ${rightX} ${rightY}`;
  }
}

// Clase para el Gráfico Gauge

class GaugeChart {
  constructor(props) {
    this.svg = props.svg;
    this.group = this.svg.append("g");
    this.outerRadius = props.outerRadius;
    this.innerRadius = props.innerRadius;
    this.range = props.range;
    this.label = props.label; // Recibimos la etiqueta dinámica

    this.needle = new Needle({
      svg: this.svg,
      len: this.outerRadius * 0.65,
      radius: this.innerRadius * 0.15,
      x: this.outerRadius,
      y: this.outerRadius,
    });

    this.textGroup = this.svg.append("g").attr("class", "gauge-text-group");
  }

  render() {
    const gradient = this.svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "c-chart-gauge__gradient");
    const arc = d3.arc();

    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("class", "c-chart-gauge__gradient-stop1");
    gradient
      .append("stop")
      .attr("offset", "33%")
      .attr("class", "c-chart-gauge__gradient-stop2");
    gradient
      .append("stop")
      .attr("offset", "66%")
      .attr("class", "c-chart-gauge__gradient-stop3");
    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("class", "c-chart-gauge__gradient-stop4");

    arc
      .innerRadius(this.innerRadius)
      .outerRadius(this.outerRadius)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2);

    this.group
      .append("path")
      .attr("d", arc)
      .attr("fill", "url(#c-chart-gauge__gradient)")
      .attr(
        "transform",
        `translate(${this.outerRadius},${this.outerRadius})`
      );

    // Texto inicial
    this.renderText(this.range, 0);
    this.needle.render();
  }

  renderText(range, value) {
    const centerX = this.outerRadius;
    const centerY = this.outerRadius;
  
    // Rango del título (primera línea)
    this.textGroup
      .append("text")
      .attr("class", "gauge-title")
      .attr("x", centerX)
      .attr("y", centerY - 40)
      .attr("text-anchor", "middle")
    //  .text(`Rango: ${range[0]} - ${range[1]}`);
  
    // Etiqueta (segunda línea)
    this.textGroup
      .append("text")
      .attr("class", "gauge-label")
      .attr("x", centerX)
      .attr("y", centerY + 30) // Posicionamos justo debajo de la línea del rango
      .attr("text-anchor", "middle")
     // .text(this.label);
  
    // Valor dinámico (tercera línea)
    this.valueText = this.textGroup
      .append("text")
      .attr("class", "gauge-value")
      .attr("x", centerX)
      .attr("y", centerY + 60)
      .attr("text-anchor", "middle")
     // .text(`${value.toFixed(2)} ${this.label}`);
  }

  updateValue(value) {
    const normalizedValue =
      (value - this.range[0]) / (this.range[1] - this.range[0]);
    this.needle.animateTo(normalizedValue); // Mover la aguja
  //  this.valueText.text(`${value.toFixed(2)} ${"VAC"}`); // Actualizar el texto del valor dinámico
  }
  
  
}
// Componente React
const Gauge = ({ range, value, label }) => {
  const ref = useRef();

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove(); // Limpia el SVG al inicio

    const gaugeChart = new GaugeChart({
      svg,
      outerRadius: 160,
      innerRadius: 120,
      range,
      label, // Pasamos la etiqueta aquí
    });

    gaugeChart.render();
    gaugeChart.updateValue(value);

    return () => {
      svg.selectAll("*").remove(); // Limpia el SVG al desmontar
    };
  }, [range, value, label]);

  return <svg ref={ref} className="c-chart-gauge" style={{ background: "none" }} />;
};

export default Gauge;
