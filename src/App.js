import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [healthData, setHealthData] = useState([]);
  const [exerciseData, setExerciseData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const response = await fetch('https://rapidapi.com');
        if (!response.ok) {
          throw new Error('Failed to fetch health data');
        }
        const data = await response.json();
        setHealthData(data);
      } catch (error) {
        console.error('Error fetching health data:', error);
      }
    };
    
  
    const fetchExerciseData = async () => {
      const url = 'https://exercisedb.p.rapidapi.com/exercises/bodyPart/back?limit=10';
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '513bc9feecmsh53e013a3f7ea66ep1db005jsnd2085072aac0',
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        }
      };
    
      let delay = 1000; // Initial delay
      while (true) {
        try {
          const response = await fetch(url, options);
          const data = await response.json();
          setExerciseData(data.exercises);
          break; // Exit the loop on successful response
        } catch (error) {
          console.error('Error fetching exercise data:', error);
          // Implement exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2; // Double the delay for the next retry
        }
      }
    };
    
  
    fetchHealthData();
    fetchExerciseData();
  }, []);
  

  useEffect(() => {
    if (!searchTerm) {
      setFilteredData([...healthData, ...exerciseData]);
      return;
    }

    const filtered = [...healthData, ...exerciseData].filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, healthData, exerciseData]);

  return (
    <div>
      <header>
        <h1>Physical Health Website</h1>
      </header>
      <input
        type="text"
        placeholder="Search health topics and exercises..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div>
        {filteredData.map((item) => (
          <div key={item.id}>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
