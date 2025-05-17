// components/TSNEVisualization.js
import { useState, useEffect, useRef } from 'react';
import styles from '../../styles/TSNEVisualization.module.css';

// We'll use react-plotly.js for the visualization
// Install it with: npm install react-plotly.js plotly.js
import dynamic from 'next/dynamic';

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const TSNEVisualization = ({ apiUrl, onPosterSelect }) => {
  const [tsneData, setTsneData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredPoster, setHoveredPoster] = useState(null);
  const [error, setError] = useState(null);
  
  // Fetch t-SNE data
  useEffect(() => {
    const fetchTsneData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${apiUrl}/tsne`);
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }
        const data = await response.json();
        setTsneData(data);
      } catch (error) {
        console.error('Error fetching t-SNE data:', error);
        setError('Failed to load visualization data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTsneData();
  }, [apiUrl]);
  
  // Prepare data for Plotly
  const plotData = [{
    x: tsneData.map(d => d.x),
    y: tsneData.map(d => d.y),
    mode: 'markers',
    type: 'scatter',
    marker: {
      size: 8,
      opacity: 0.7,
      color: '#1f77b4',
      line: {
        width: 1,
        color: '#444'
      }
    },
    hoverinfo: 'none', // We'll handle hover ourselves
    customdata: tsneData.map(d => ({
      id: d.id,
      title: d.title,
      poster_number: d.poster_number
    }))
  }];
  
  // Plotly layout
  const layout = {
    autosize: true,
    hovermode: 'closest',
    margin: { l: 40, r: 40, b: 40, t: 40 },
    showlegend: false,
    xaxis: {
      showgrid: false,
      zeroline: false,
      showticklabels: false
    },
    yaxis: {
      showgrid: false,
      zeroline: false,
      showticklabels: false
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)'
  };
  
  // Handle point hover
  const handleHover = (data) => {
    const point = data.points[0];
    const posterData = point.customdata;
    
    setHoveredPoster({
      id: posterData.id,
      title: posterData.title,
      poster_number: posterData.poster_number,
      x: point.x,
      y: point.y
    });
  };
  
  // Handle point click
  const handleClick = (data) => {
    const point = data.points[0];
    const posterData = point.customdata;
    
    onPosterSelect({
      id: posterData.id,
      title: posterData.title,
      poster_number: posterData.poster_number
    });
  };
  
  // Handle mouse leave
  const handleMouseLeave = () => {
    setHoveredPoster(null);
  };
  
  if (isLoading) {
    return <div className={styles.loading}>Loading visualization...</div>;
  }
  
  if (error) {
    return <div className={styles.error}>{error}</div>;
  }
  
  return (
    <div className={styles.tsneContainer}>
      <div className={styles.visualizationInfo}>
        <p>
          This t-SNE visualization shows the semantic relationships between all posters.
          Similar research topics appear closer together in the visualization.
        </p>
        <p>
          <strong>Hover</strong> over points to preview titles. <strong>Click</strong> on a point to view the full abstract.
        </p>
      </div>
      
      <div className={styles.plotContainer} onMouseLeave={handleMouseLeave}>
        <Plot
          data={plotData}
          layout={layout}
          useResizeHandler={true}
          style={{ width: '100%', height: '600px' }}
          onHover={handleHover}
          onClick={handleClick}
        />
        
        {hoveredPoster && (
          <div 
            className={styles.hoverInfo}
            style={{
              left: `calc(${hoveredPoster.x}px + 15px)`,
              top: `calc(${hoveredPoster.y}px - 15px)`
            }}
          >
            <div className={styles.posterNumber}>{hoveredPoster.poster_number}</div>
            <div className={styles.posterTitle}>{hoveredPoster.title}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TSNEVisualization;
