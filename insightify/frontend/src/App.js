import React, { useState } from 'react';
import axios from 'axios';
import FileUpload from './components/FileUpload';
import QueryInput from './components/QueryInput';
import ResultDisplay from './components/ResultDisplay';
import SampleQueries from './components/SampleQueries';
import './App.css';

function App() {
    const [filename, setFilename] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleUploadSuccess = (newFilename) => {
        setFilename(newFilename);
    };

    const handleQuerySubmit = async (query) => {
        if (!filename) {
            alert('Please upload a dataset first.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('/query/', {
                filename,
                query,
            });
            setResult(response.data);
        } catch (error) {
            console.error('Error fetching query results:', error);
            alert('Error fetching query results.');
        } finally {
            setLoading(false);
        }
    };

    const handleSampleSelect = (sampleFilename, sampleQuery) => {
        setFilename(sampleFilename);
        handleQuerySubmit(sampleQuery, sampleFilename);
    };

    const originalHandleQuerySubmit = async (query, optionalFilename) => {
        const currentFilename = optionalFilename || filename;
        if (!currentFilename) {
            alert('Please upload a dataset first.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('/query/', {
                filename: currentFilename,
                query,
            });
            setResult(response.data);
        } catch (error) {
            console.error('Error fetching query results:', error);
            alert('Error fetching query results.');
        } finally {
            setLoading(false);
        }
    };

    // Keep the original handleQuerySubmit for the QueryInput component
    const handleQuerySubmitForInput = (query) => {
        originalHandleQuerySubmit(query, filename);
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Insightify</h1>
                <p>Your AI-Powered Data Analytics Platform</p>
            </header>
            <main>
                <FileUpload onUploadSuccess={handleUploadSuccess} />
                <QueryInput onQuerySubmit={handleQuerySubmitForInput} />
                <SampleQueries onSampleSelect={handleSampleSelect} />
                {loading ? <p>Loading...</p> : <ResultDisplay result={result} />}
            </main>
        </div>
    );
}

export default App;
