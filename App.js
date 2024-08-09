// src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import Header from './Header';
import Results from './Results';
import './App.css'; // Include your CSS styles

const App = () => {
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');

    const getData = async (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            const userInput = e.target.previousElementSibling.value || e.target.parentElement.querySelector('input').value;
            if (!userInput) return;

            const endpoint = 'https://en.wikipedia.org/w/api.php?';
            const params = {
                origin: '*',
                format: 'json',
                action: 'query',
                prop: 'extracts',
                exchars: 250,
                exintro: true,
                explaintext: true,
                generator: 'search',
                gsrlimit: 20,
                gsrsearch: userInput,
            };

            try {
                const { data } = await axios.get(endpoint, { params });
                if (data.error) throw new Error(data.error.info);
                const gatheredResults = Object.values(data.query.pages).map(page => ({
                    pageId: page.pageid,
                    title: page.title,
                    intro: page.extract,
                }));
                setResults(gatheredResults);
                setError('');
            } catch (err) {
                setError(err.message);
                setResults([]);
            }
        }
    };

    return (
        <div className="App">
            <Header onSearch={getData} />
            <Results results={results} error={error} />
        </div>
    );
};

export default App;