// components/PosterDetails.js
import styles from '../../styles/PosterDetails.module.css';

const PosterDetails = ({ poster }) => {
  if (!poster) {
    return null;
  }
  
  return (
    <div className={styles.posterDetails}>
      <div className={styles.posterHeader}>
        <div className={styles.posterNumber}>{poster.poster_number}</div>
        <h2 className={styles.posterTitle}>{poster.title}</h2>
      </div>
      
      <div className={styles.posterAuthors}>
        <div className={styles.presentingAuthor}>
          <strong>Presenting Author:</strong> {poster.presenting_author || 'Not specified'}
        </div>
        {poster.all_authors && (
          <div className={styles.allAuthors}>
            <strong>All Authors:</strong> {poster.all_authors}
          </div>
        )}
      </div>
      
      {poster.panel && (
        <div className={styles.posterPanel}>
          <strong>Panel:</strong> {poster.panel}
        </div>
      )}
      
      {poster.session_id && (
        <div className={styles.posterSession}>
          <strong>Session:</strong> {poster.session_id}
        </div>
      )}
      
      <div className={styles.abstractHeading}>Abstract</div>
      <div className={styles.abstractContent}>
        {poster.abstract ? (
          <p>{poster.abstract}</p>
        ) : (
          <p className={styles.noAbstract}>No abstract available</p>
        )}
      </div>
    </div>
  );
};

export default PosterDetails;
