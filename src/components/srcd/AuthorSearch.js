// components/AuthorSearch.js
import { useState, useEffect, useRef } from 'react';
import styles from '../../styles/AuthorSearch.module.css';

const AuthorSearch = ({ apiUrl, onResults }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);
  
  // Fetch author suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchTerm || searchTerm.length < 2) {
        setSuggestions([]);
        return;
      }
      
      try {
        setIsLoading(true);
        const response = await fetch(`${apiUrl}/authors?q=${encodeURIComponent(searchTerm)}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error('Error fetching author suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, apiUrl]);
  
  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle search
  const handleSearch = async () => {
    if (!searchTerm) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/search/author?name=${encodeURIComponent(searchTerm)}`);
      if (response.ok) {
        const data = await response.json();
        onResults(data);
      }
    } catch (error) {
      console.error('Error searching by author:', error);
    } finally {
      setIsLoading(false);
      setShowSuggestions(false);
    }
  };
  
  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    // Trigger search with the selected author
    setTimeout(() => handleSearch(), 0);
  };
  
  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };
  
  return (
    <div className={styles.authorSearch}>
      <h2>Search by Author</h2>
      <div className={styles.searchDescription}>
        Find posters by author name. Type at least 2 characters to see suggestions.
      </div>
      
      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <div className={styles.inputContainer} ref={suggestionsRef}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter author name..."
            className={styles.searchInput}
            onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
          />
          
          {showSuggestions && suggestions.length > 0 && (
            <ul className={styles.suggestions}>
              {suggestions.map((suggestion, index) => (
                <li 
                  key={index} 
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={styles.suggestionItem}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
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

export default AuthorSearch;
