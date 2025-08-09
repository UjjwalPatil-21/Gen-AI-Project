import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SampleQueries = ({ onSampleSelect }) => {
    const [samples, setSamples] = useState([]);

    useEffect(() => {
        const fetchSamples = async () => {
            try {
                const response = await axios.get('/sample-queries/');
                setSamples(response.data.samples);
            } catch (error) {
                console.error('Error fetching sample queries:', error);
            }
        };
        fetchSamples();
    }, []);

    return (
        <div>
            <h2>Or try a sample query:</h2>
            <ul>
                {samples.map((sample, index) => (
                    <li key={index} onClick={() => onSampleSelect(sample.filename, sample.query)}>
                        {sample.title}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SampleQueries;
