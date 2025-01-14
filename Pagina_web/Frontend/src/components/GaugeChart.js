import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "../styles/GaugeChart.css"; // Estilos específicos para este botón

// Utilidades para conversiones
const percentToDegree = (p) => p * 360;
const degreeToRadian = (d) => (d * Math.PI) / 180;
const percentToRadian = (p) => degreeToRadian(percentToDegree(p));

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
    // Asegúrate de limpiar cualquier aguja previa
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
      .duration(3000)
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
    const thetaRad = percentToRadian(p / 2),
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

    this.needle = new Needle({
      svg: this.svg,
      len: this.outerRadius * 0.65,
      radius: this.innerRadius * 0.15,
      x: this.outerRadius,
      y: this.outerRadius,
    });
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

    this.needle.render();
  }

  animateTo(p) {
    this.needle.animateTo(p);
  }
}

// Componente React
const Gauge = () => {
  const ref = useRef();

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove(); // Limpia el SVG al inicio

    const gaugeChart = new GaugeChart({
      svg,
      outerRadius: 160,
      innerRadius: 120,
    });

    gaugeChart.render();
    gaugeChart.animateTo(Math.random());

    const interval = setInterval(() => {
      gaugeChart.animateTo(Math.random());
    }, 5000);

    return () => {
      clearInterval(interval);
      svg.selectAll("*").remove(); // Limpia el SVG al desmontar
    };
  }, []);

  return <svg ref={ref} className="c-chart-gauge" style={{ background: "none" }} />;
};

export default Gauge;
