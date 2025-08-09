import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const ResultDisplay = ({ result }) => {
    if (!result) {
        return null;
    }

    const { result: textResult, visualization } = result;

    const renderVisualization = () => {
        if (!visualization) {
            return null;
        }

        const { type, data } = visualization;

        if (type === 'bar') {
            return <Bar data={data} />;
        }

        if (type === 'line') {
            return <Line data={data} />;
        }

        if (type === 'table') {
            return (
                <table>
                    <thead>
                        <tr>
                            {data.columns.map((col) => (
                                <th key={col}>{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.rows.map((row, i) => (
                            <tr key={i}>
                                {data.columns.map((col) => (
                                    <td key={col}>{row[col]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }

        return null;
    };

    return (
        <div>
            <h2>3. Insights</h2>
            <p>{textResult}</p>
            {renderVisualization()}
        </div>
    );
};

export default ResultDisplay;
