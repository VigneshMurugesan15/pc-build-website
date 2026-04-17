import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PCBuilder.css';

const PCBuilder = () => {
  const [components, setComponents] = useState({
    cpu: [],
    motherboard: [],
    gpu: [],
    ram: [],
    storage: [],
    psu: [],
    case: [],
  });

  const [selectedComponents, setSelectedComponents] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [buildName, setBuildName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchComponents();
  }, []);

  const fetchComponents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/components');
      setComponents(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching components:', error);
      setError('Failed to load components. Make sure backend is running on port 5000');
    } finally {
      setLoading(false);
    }
  };

  const handleComponentSelect = (category, component) => {
    setSelectedComponents(prev => ({
      ...prev,
      [category]: component
    }));
    
    let total = 0;
    Object.values({ ...selectedComponents, [category]: component }).forEach(comp => {
      if (comp) total += comp.price;
    });
    setTotalPrice(total);
  };

  const saveBuild = async () => {
    if (!buildName.trim()) {
      alert('Please enter a build name');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/builds', {
        name: buildName,
        components: selectedComponents,
        totalPrice: totalPrice
      });
      alert('Build saved successfully!');
      setBuildName('');
    } catch (error) {
      console.error('Error saving build:', error);
      alert('Failed to save build');
    }
  };

  if (loading) {
    return (
      <div className="pc-builder-container" style={{ textAlign: 'center', color: 'white', marginTop: '100px' }}>
        <h2>Loading components...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pc-builder-container" style={{ textAlign: 'center', color: 'white', marginTop: '100px' }}>
        <h2 style={{ color: '#ff6b6b' }}>❌ {error}</h2>
        <button onClick={fetchComponents} style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="pc-builder-container">
      <h1>🖥️ Custom PC Builder</h1>
      
      <div className="builder-content">
        {/* Components Selection */}
        <div className="components-section">
          {Object.keys(components).map(category => (
            <div key={category} className="category-section">
              <h3>{category}</h3>
              <select 
                onChange={(e) => {
                  const selected = components[category]?.find(
                    c => c.id === parseInt(e.target.value)
                  );
                  if (selected) handleComponentSelect(category, selected);
                }}
              >
                <option value="">Select a {category}</option>
                {components[category]?.map(component => (
                  <option key={component.id} value={component.id}>
                    {component.name} - ${component.price}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Build Summary */}
        <div className="summary-section">
          <h2>Build Summary</h2>
          <div className="selected-components">
            {Object.entries(selectedComponents).length === 0 ? (
              <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
                👆 Select components to get started
              </p>
            ) : (
              Object.entries(selectedComponents).map(([category, component]) => (
                component && (
                  <div key={category} className="selected-item">
                    <span>{category}</span>
                    <span>{component.name}</span>
                    <span className="price">${component.price}</span>
                  </div>
                )
              ))
            )}
          </div>
          
          <div className="total-price">
            <h3>💰 Total: ${totalPrice.toFixed(2)}</h3>
          </div>

          <input
            type="text"
            placeholder="Give your build a name..."
            value={buildName}
            onChange={(e) => setBuildName(e.target.value)}
            className="build-name-input"
          />
          
          <button 
            onClick={saveBuild}
            className="save-button"
          >
            💾 Save Build
          </button>
        </div>
      </div>
    </div>
  );
};

export default PCBuilder;