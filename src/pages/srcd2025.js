// pages/posters.js
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { debounce } from 'lodash';
import styles from '../styles/Posters.module.css';

// Components
import TSNEVisualization from '../components/srcd/TSNEVisualization';
import PosterDetails from '../components/srcd/PosterDetails';
import AuthorSearch from '../components/srcd/AuthorSearch';
import KeywordSearch from '../components/srcd/KeywordSearch';
import NearestNeighbors from '../components/srcd/NearestNeighbors';

// API URL - replace with your actual API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.tompkins.computer';

export default function PosterExplorer() {
  // State
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [neighbors, setNeighbors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('tsne');
  const [searchResults, setSearchResults] = useState([]);
  
  // Fetch poster details when selected
  useEffect(() => {
    if (!selectedPoster) {
      setNeighbors([]);
      return;
    }
    
    const fetchNeighbors = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/neighbors/${selectedPoster.id}?count=10`);
        if (response.ok) {
          const data = await response.json();
          setNeighbors(data);
        }
      } catch (error) {
        console.error('Error fetching neighbors:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNeighbors();
  }, [selectedPoster]);
  
  // Handle poster selection
  const handlePosterSelect = async (poster) => {
    if (!poster) {
      setSelectedPoster(null);
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/poster/${poster.id}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedPoster(data);
      }
    } catch (error) {
      console.error('Error fetching poster details:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle author search results
  const handleAuthorResults = (posters) => {
    setSearchResults(posters);
    if (posters.length > 0) {
      handlePosterSelect(posters[0]);
    }
  };
  
  // Handle keyword search results
  const handleKeywordResults = (posters) => {
    setSearchResults(posters);
    if (posters.length > 0) {
      handlePosterSelect(posters[0]);
    }
  };
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Conference Poster Explorer</title>
        <meta name="description" content="Explore conference posters using semantic embeddings" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className={styles.main}>
        <h1 className={styles.title}>Conference Poster Explorer</h1>
        
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'tsne' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('tsne')}
          >
            t-SNE Visualization
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'author' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('author')}
          >
            Author Search
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'keyword' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('keyword')}
          >
            Keyword Search
          </button>
        </div>
        
        <div className={styles.content}>
          <div className={`${styles.tabContent} ${activeTab === 'tsne' ? styles.activeContent : ''}`}>
            <TSNEVisualization 
              apiUrl={API_URL} 
              onPosterSelect={handlePosterSelect} 
            />
          </div>
          
          <div className={`${styles.tabContent} ${activeTab === 'author' ? styles.activeContent : ''}`}>
            <AuthorSearch 
              apiUrl={API_URL} 
              onResults={handleAuthorResults} 
            />
            
            {searchResults.length > 0 && activeTab === 'author' && (
              <div className={styles.searchResults}>
                <h3>Search Results ({searchResults.length} posters)</h3>
                <ul className={styles.resultsList}>
                  {searchResults.map(poster => (
                    <li 
                      key={poster.id}
                      className={`${styles.resultItem} ${selectedPoster?.id === poster.id ? styles.activeResult : ''}`}
                      onClick={() => handlePosterSelect(poster)}
                    >
                      <span className={styles.posterNumber}>{poster.poster_number}</span>
                      <span className={styles.posterTitle}>{poster.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className={`${styles.tabContent} ${activeTab === 'keyword' ? styles.activeContent : ''}`}>
            <KeywordSearch 
              apiUrl={API_URL} 
              onResults={handleKeywordResults} 
            />
            
            {searchResults.length > 0 && activeTab === 'keyword' && (
              <div className={styles.searchResults}>
                <h3>Search Results ({searchResults.length} posters)</h3>
                <ul className={styles.resultsList}>
                  {searchResults.map(poster => (
                    <li 
                      key={poster.id}
                      className={`${styles.resultItem} ${selectedPoster?.id === poster.id ? styles.activeResult : ''}`}
                      onClick={() => handlePosterSelect(poster)}
                    >
                      <span className={styles.posterNumber}>{poster.poster_number}</span>
                      <span className={styles.posterTitle}>{poster.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        
        <div className={styles.detailsContainer}>
          {selectedPoster ? (
            <>
              <PosterDetails poster={selectedPoster} />
              
              <div className={styles.neighborsContainer}>
                <h3>Semantically Similar Posters</h3>
                <NearestNeighbors 
                  neighbors={neighbors} 
                  isLoading={isLoading} 
                  onPosterSelect={handlePosterSelect} 
                />
              </div>
            </>
          ) : (
            <div className={styles.emptyState}>
              <p>Select a poster to view details</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
