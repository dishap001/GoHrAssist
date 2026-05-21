import { useEffect, useRef, useState } from "react";
import "./App.css";

// IMPORT AUDIO
import callAudio from "./assets/VBDEMO.mp3";
import { FaPhoneAlt, FaPhoneSlash } from "react-icons/fa";

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");

  const secs = (seconds % 60).toString().padStart(2, "0");

  return `${mins}:${secs}`;
};

const App = () => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callTime, setCallTime] = useState(0);

  // AUDIO REF
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let timer: number;

    if (callAccepted) {
      timer = window.setInterval(() => {
        setCallTime((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [callAccepted]);

  // ACCEPT CALL
  const handleAcceptCall = async () => {
    setCallAccepted(true);
    setCallTime(0);

    // PLAY AUDIO
    if (audioRef.current) {
      audioRef.current.currentTime = 0;

      try {
        await audioRef.current.play();
      } catch (error) {
        console.log("Audio play blocked:", error);
      }
    }
  };

  // END CALL
  const handleEndCall = () => {
    setCallAccepted(false);
    setCallTime(0);

    // STOP AUDIO
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <div className="app">
      {/* AUDIO ELEMENT */}
      <audio ref={audioRef} src={callAudio} />

      <div className="phone-frame">
        <div className="screen">
          {!callAccepted ? (
            <>
              {/* Incoming Call Screen */}
              <div className="top-bar">
                <span>12:39 PM</span>
                <span>📶 🔋</span>
              </div>

              <div className="incoming-container">
                <p className="caller-label">Incoming Call</p>

                <h1 className="caller-name">Trellis HR</h1>

                <div className="avatar">
                  <div className="avatar-circle">
                    <span>👤</span>
                  </div>
                </div>

                <p className="calling-text">CALLING...</p>

                <div className="incoming-actions">

                  <button className="call-btn accept" onClick={handleAcceptCall}>
                    <FaPhoneAlt />
                  </button>

                  <button className="call-btn reject" onClick={handleEndCall}>
                    <FaPhoneSlash />
                  </button>
                </div>

              </div>
            </>
          ) : (
            <>
              {/* Active Call Screen */}
              <div className="top-bar">
                <span>12:39 PM</span>
                <span>📶 🔋</span>
              </div>

              <div className="active-call-container">
                <p className="caller-label">Connected</p>

                <h1 className="caller-name">Trellis HR</h1>

                <p className="timer">{formatTime(callTime)}</p>

                <div className="call-options">
                  <div className="option">
                    <div className="option-icon">🔇</div>
                    <span>Mute</span>
                  </div>

                  <div className="option">
                    <div className="option-icon">➕</div>
                    <span>Add Call</span>
                  </div>

                  <div className="option">
                    <div className="option-icon">⏸</div>
                    <span>Hold</span>
                  </div>

                  <div className="option">
                    <div className="option-icon">🎙</div>
                    <span>Record</span>
                  </div>

                  <div className="option">
                    <div className="option-icon">🔊</div>
                    <span>Speaker</span>
                  </div>

                  <div className="option">
                    <div className="option-icon">⌨</div>
                    <span>Keypad</span>
                  </div>
                </div>


                <button className="end-call-btn" onClick={handleEndCall}>
                  <FaPhoneSlash />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;