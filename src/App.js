import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch predictions on load
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      const response = await axios.get('http://localhost:5001/predictions/view');
      setPredictions(response.data.predictions);
    } catch (err) {
      setError('Failed to fetch predictions');
    }
  };

  const handleLogin = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:5001/users/login', { username, password });
      setUser(response.data);
      setError('');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5001/users/logout');
      setUser(null);
      setError('');
    } catch (err) {
      setError('Failed to logout');
    }
  };

  const handleRegister = async (username, password, email) => {
    try {
      await axios.post('http://localhost:5001/users/register', { username, password, email });
      setError('');
    } catch (err) {
      setError('Registration failed');
    }
  };

  const handlePredictionSubmit = async (match, prediction) => {
    try {
      const response = await axios.post('http://localhost:5001/predictions/submit', {
        user_id: user.id,
        match,
        prediction
      });
      fetchPredictions();
      setError('');
    } catch (err) {
      setError('Failed to submit prediction');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Football Predictions</h1>
        {error && <div className="error">{error}</div>}
        {user ? (
          <>
            <button onClick={handleLogout}>Logout</button>
            <div>Welcome, User {user.id}</div>
            <PredictionForm onSubmit={handlePredictionSubmit} />
          </>
        ) : (
          <>
            <LoginForm onLogin={handleLogin} />
            <RegisterForm onRegister={handleRegister} />
          </>
        )}
        <PredictionsList predictions={predictions} />
      </header>
    </div>
  );
}

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
};

const RegisterForm = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(username, password, email);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button type="submit">Register</button>
    </form>
  );
};

const PredictionForm = ({ onSubmit }) => {
  const [match, setMatch] = useState('');
  const [prediction, setPrediction] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(match, prediction);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Match" value={match} onChange={(e) => setMatch(e.target.value)} />
      <input type="text" placeholder="Prediction" value={prediction} onChange={(e) => setPrediction(e.target.value)} />
      <button type="submit">Submit Prediction</button>
    </form>
  );
};

const PredictionsList = ({ predictions }) => {
  return (
    <ul>
      {predictions.map(prediction => (
        <li key={prediction.id} dangerouslySetInnerHTML={{ __html: `${prediction.match}: ${prediction.prediction} (User ${prediction.user_id})` }} />
      ))}
    </ul>
  );
};

export default App;
