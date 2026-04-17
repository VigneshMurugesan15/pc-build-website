import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

  useEffect(() => {
    fetchComponents();
  }, []);

  const fetchComponents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/components');
      setComponents(response.data);
    } catch (error) {
      console.error('Error fetching components:', error);
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
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🖥️ Custom PC Builder</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Components Selection */}
        <div>
          {Object.keys(components).map(category => (
            <div key={category} style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                {category}
              </label>
              <select 
                onChange={(e) => {
                  const selected = components[category]?.find(
                    c => c.id === parseInt(e.target.value)
                  );
                  if (selected) handleComponentSelect(category, selected);
                }}
                style={{
                  width: '100%',
                  padding: '8px',
                  marginTop: '5px',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
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
        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
          <h2>Build Summary</h2>
          <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '15px' }}>
            {Object.entries(selectedComponents).length === 0 ? (
              <p style={{ color: '#999' }}>No components selected</p>
            ) : (
              Object.entries(selectedComponents).map(([category, component]) => (
                component && (
                  <div key={category} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                    <span><strong>{category}:</strong></span>
                    <span>${component.price}</span>
                  </div>
                )
              ))
            )}
          </div>
          
          <div style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>
            <h3 style={{ margin: '0' }}>Total: ${totalPrice.toFixed(2)}</h3>
          </div>

          <input
            type="text"
            placeholder="Enter build name"
            value={buildName}
            onChange={(e) => setBuildName(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
          />
          
          <button 
            onClick={saveBuild}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Save Build
          </button>
        </div>
      </div>
    </div>
  );
};

export default PCBuilder;