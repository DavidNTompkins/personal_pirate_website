// components/NearestNeighbors.js
import styles from '../../styles/NearestNeighbors.module.css';

const NearestNeighbors = ({ neighbors, isLoading, onPosterSelect }) => {
  if (isLoading) {
    return <div className={styles.loading}>Loading similar posters...</div>;
  }
  
  if (!neighbors || neighbors.length === 0) {
    return <div className={styles.noNeighbors}>No similar posters found</div>;
  }
  
  return (
    <ul className={styles.neighborsList}>
      {neighbors.map((neighbor) => (
        <li 
          key={neighbor.id} 
          className={styles.neighborItem}
          onClick={() => onPosterSelect(neighbor)}
        >
          <div className={styles.neighborHeader}>
            <span className={styles.posterNumber}>{neighbor.poster_number}</span>
            <span className={styles.posterTitle}>{neighbor.title}</span>
          </div>
          <div className={styles.posterAuthors}>
            {neighbor.presenting_author}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NearestNeighbors;
