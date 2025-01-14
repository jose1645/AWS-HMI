import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Keymap from './components/Keymap';
import Heatmap from "./components/Heatmap";
import HistogramaConsumo from './components/Histograma';
import GaugeChart from './components/GaugeChart';

const App = () => {
  const [value, setValue] = useState(120);

  useEffect(() => {
    //const interval = setInterval(() => {
    //  setValue(Math.random() * 240); // Simular datos en tiempo real
    //}, 1000);
   // return () => clearInterval(interval);
  }, []);

  const data = [
    { time: "2025-01-06T22:20:32", phase: "AN-BN", difference: 10 },
    { time: "2025-01-06T22:20:32", phase: "AN-CN", difference: 15 },
    { time: "2025-01-06T22:20:32", phase: "BN-CN", difference: 5 },
    { time: "2025-01-06T22:20:32", phase: "AB-BC", difference: 20 },
    { time: "2025-01-06T22:20:32", phase: "AC-BC", difference: 25 },
    { time: "2025-01-06T22:30:32", phase: "AN-BN", difference: 8 },
    { time: "2025-01-06T22:30:32", phase: "AN-CN", difference: 12 },
    { time: "2025-01-06T22:30:32", phase: "BN-CN", difference: 7 },
    { time: "2025-01-06T22:30:32", phase: "AB-BC", difference: 18 },
    { time: "2025-01-06T22:30:32", phase: "AC-BC", difference: 22 },
  ];

  const data1 = [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150];

  return (
    <div className="App">
      <Header />
      <main>


      <div>
          <GaugeChart/>
        </div>
        <div>
          <Keymap />
        </div>
        <div>
          <Heatmap data={data} />
        </div>
        <div>
          <h1>Histograma del Consumo Diario</h1>
          <HistogramaConsumo data={data1} />
        </div>
      </main>
    </div>
  );
};

export default App;
