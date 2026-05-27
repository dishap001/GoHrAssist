import { useEffect, useRef, useState } from "react";
import "./App.css";
import hrAudio from "./assets/HR.mp3";
import interviewerAudio from "./assets/Interviewer.mp3";
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
  const [isInterviewer, setIsInterviewer] = useState(false);

  // AUDIO REF
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
  const getCurrentAudio = () => {
    return isInterviewer ? interviewerAudio : hrAudio;
  };
  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;

    if (callAccepted) {
      audioRef.current.play().catch((err) => {
        console.log("Audio play blocked:", err);
      });
    }
  }, [isInterviewer, callAccepted]);

  return (
    <div className="app">
      <div className="caller-dropdown">
        <button
          className="dropdown-btn"
          onClick={() => setDropdownOpen((prev) => !prev)}
        >
          {isInterviewer ? "Inquire interview" : "Attend interview"} ▼
        </button>

        {dropdownOpen && (
          <div className="dropdown-menu">
            <div
              className={`dropdown-item ${!isInterviewer ? "active" : ""}`}
              onClick={() => {
                setIsInterviewer(false);
                setDropdownOpen(false);
              }}
            >
              Attend interview
            </div>

            <div
              className={`dropdown-item ${isInterviewer ? "active" : ""}`}
              onClick={() => {
                setIsInterviewer(true);
                setDropdownOpen(false);
              }}
            >
              Inquire interview
            </div>
          </div>
        )}
      </div>
      {/* AUDIO ELEMENT */}
      <audio ref={audioRef} src={getCurrentAudio()} />

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

                <h1 className="caller-name">
                  {isInterviewer ? "Sarah Jose" : "Trellis HR"}
                </h1>

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

                <h1 className="caller-name">
                  {isInterviewer ? "Sarah Jose" : "Trellis HR"}
                </h1>

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