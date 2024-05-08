import { useState, useRef } from 'react';

function PlayableImage({isMobile}) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [sirenImg,setSirenImg] = useState('siren.gif');
    const audioRef = useRef(null);

    const togglePlay = () => {
        setSirenImg(sirenImg=='siren.gif' ?'siren_playing.gif':'siren.gif')
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.currentTime = 0; // Start from the beginning
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleAudioEnd = () => {
        setIsPlaying(false);
        setSirenImg('/siren.gif'); // Change to play image when audio ends
    };

    return (
        <div className="z-40" style={{ position: 'absolute', bottom: isMobile ? 'calc(19vh)' : 'calc(17vh)', left: '20vw', transform: 'translate(-50%, 50%)'}}>
            <img src={sirenImg} alt="click to play a song" onClick={togglePlay} style={{ cursor: 'pointer',width: isMobile ? '96px': '128px',height: isMobile ? '96px': '128px' }} />
            <audio ref={audioRef} src="/sirensong.mp3" onEnded={handleAudioEnd}  />
        </div>
    );
}

export default PlayableImage;
