import React, { useState } from 'react';
import axios from 'axios';
import FileUpload from './components/FileUpload';
import QueryInput from './components/QueryInput';
import ResultDisplay from './components/ResultDisplay';
import SampleQueries from './components/SampleQueries';
import './App.css';

function App() {
    const [apiKey, setApiKey] = useState('');
    const [filename, setFilename] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleUploadSuccess = (newFilename) => {
        setFilename(newFilename);
    };

    const handleQuerySubmit = async (query, optionalFilename) => {
        const currentFilename = optionalFilename || filename;
        if (!currentFilename) {
            alert('Please upload a dataset first.');
            return;
        }
        if (!apiKey) {
            alert('Please enter your OpenAI API key.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('/query/', {
                filename: currentFilename,
                query,
                api_key: apiKey,
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

    return (
        <div className="App">
            <header className="App-header">
                <h1>Insightify</h1>
                <p>Your AI-Powered Data Analytics Platform</p>
            </header>
            <main>
                <div>
                    <h2>Enter your OpenAI API Key</h2>
                    <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="sk-..."
                        style={{ width: '400px' }}
                    />
                </div>
                <FileUpload onUploadSuccess={handleUploadSuccess} />
                <QueryInput onQuerySubmit={handleQuerySubmit} />
                <SampleQueries onSampleSelect={handleSampleSelect} />
                {loading ? <p>Loading...</p> : <ResultDisplay result={result} />}
            </main>
        </div>
    );
}

export default App;
