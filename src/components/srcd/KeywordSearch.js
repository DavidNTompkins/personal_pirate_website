// components/KeywordSearch.js
import { useState } from 'react';
import styles from '../../styles/KeywordSearch.module.css';

const KeywordSearch = ({ apiUrl, onResults }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [includeAbstract, setIncludeAbstract] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Handle search
  const handleSearch = async () => {
    if (!searchTerm) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(
        `${apiUrl}/search/keyword?q=${encodeURIComponent(searchTerm)}&includeAbstract=${includeAbstract}`
      );
      
      if (response.ok) {
        const data = await response.json();
        onResults(data);
      }
    } catch (error) {
      console.error('Error searching by keyword:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };
  
  return (
    <div className={styles.keywordSearch}>
      <h2>Search by Keyword</h2>
      <div className={styles.searchDescription}>
        Find posters containing specific keywords in titles {includeAbstract ? 'and abstracts' : ''}.
      </div>
      
      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <div className={styles.inputContainer}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter keyword..."
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.checkboxContainer}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={includeAbstract}
              onChange={() => setIncludeAbstract(!includeAbstract)}
              className={styles.checkbox}
            />
            Include abstracts in search
          </label>
          <div className={styles.checkboxHint}>
            {includeAbstract 
              ? 'Searching in abstracts might be slower but more thorough' 
              : 'Searching only in titles is faster'}
          </div>
        </div>
        
        <button 
          type="submit" 
          className={styles.searchButton}
          disabled={isLoading || !searchTerm}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>
    </div>
  );
};

export default KeywordSearch;
