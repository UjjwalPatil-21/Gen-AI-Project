import React, { useState } from 'react';

const QueryInput = ({ onQuerySubmit }) => {
    const [query, setQuery] = useState('');

    const handleQueryChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSubmit = () => {
        if (!query) {
            alert('Please enter a query.');
            return;
        }
        onQuerySubmit(query);
    };

    return (
        <div>
            <h2>2. Ask a Question</h2>
            <textarea
                value={query}
                onChange={handleQueryChange}
                placeholder="e.g., What are the total sales per product?"
                rows="4"
                cols="50"
            />
            <br />
            <button onClick={handleSubmit}>Get Insights</button>
        </div>
    );
};

export default QueryInput;
