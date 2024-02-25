// components/Island.js
export default function Island() {
    return (
      <div className="island absolute z-10" style={{ bottom: 'calc(33vh)', left: '50vw', transform: 'translate(-50%, 50%)' }}>
        <img src="/island2.png" alt="Island" style={{ width: 'auto', height: 'auto', maxWidth: 'calc(min(30vw,400px))' }} />
      </div>
    );
  }
  