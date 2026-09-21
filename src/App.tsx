import { useEffect, useRef, useState } from "react";
import "./App.css";
// import hrAudio from "./assets/HR.mp3";
// import AttendInterview from "./assets/VoiseAssistantDemoAttend.mp3";
import AttendInterview from "./assets/BMSDEMO1.mp3";
import interviewerAudio from "./assets/Interviewer.mp3";
import salesCallAudio from "./assets/Sales_Elvora.mp3";
import inquiryCallAudio from "./assets/Cascade_Demo.mp3";
import schoolInquiryAudio from "./assets/School_Inquiry.mp3";
import goaVistaAudio from "./assets/Goa_Vista.mp3";
import { FaPhoneAlt, FaPhoneSlash } from "react-icons/fa";
import admissionInquiryAudio from "./assets/AddmissionInquiryDemo.mp3";

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");

  const secs = (seconds % 60).toString().padStart(2, "0");

  return `${mins}:${secs}`;
};

type CallType =
  | "support"
  | "interview"
  | "sales"
  | "inquiry"
  | "schoolInquiry"
  | "goaVista"
  | "admissionInquiry";

const App = () => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callTime, setCallTime] = useState(0);
  const [callType, setCallType] = useState<CallType>("support");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  /*
   * Get audio based on call type.
   * This is calculated directly from state and doesn't need
   * to be called from inside a useEffect.
   */
  const currentAudio =
    callType === "interview"
      ? interviewerAudio
      : callType === "sales"
        ? salesCallAudio
        : callType === "inquiry"
          ? inquiryCallAudio
          : callType === "schoolInquiry"
            ? schoolInquiryAudio
            : callType === "admissionInquiry"
              ? admissionInquiryAudio
              : callType === "goaVista"
                ? goaVistaAudio
                : AttendInterview;

  /*
   * Get caller name
   */
  const callerName =
    callType === "interview"
      ? "Neha Sinha"
      : callType === "inquiry"
        ? "Cascade Training"
        : callType === "schoolInquiry" ||
          callType === "admissionInquiry"
          ? "Greenfield International School"
          : callType === "goaVista"
            ? "Goa Vista"
            : "Elvora Electronics";

  /*
   * Get dropdown label
   */
  const callTypeLabel =
    callType === "interview"
      ? "Inquire interview"
      : callType === "sales"
        ? "Sales Call"
        : callType === "inquiry"
          ? "Inquiry Call"
          : callType === "schoolInquiry"
            ? "School Inquiry"
            : callType === "goaVista"
              ? "Flight Reschedule"
              : "Support Call";
  /*
   * Call timer
   */
  useEffect(() => {
    let timer: number | undefined;

    if (callAccepted) {
      timer = window.setInterval(() => {
        setCallTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [callAccepted]);

  /*
   * Play / stop audio whenever:
   * - call is accepted
   * - call type changes
   */
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;

    /*
     * Update audio source
     */
    audio.src = currentAudio;

    /*
     * Play only when call is active
     */
    if (callAccepted) {
      audio.play().catch((error) => {
        console.log("Audio play blocked:", error);
      });
    }
  }, [currentAudio, callAccepted]);

  /*
   * Automatically end call when audio finishes
   */
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const handleAudioEnd = () => {
      setCallAccepted(false);
      setCallTime(0);
    };

    audio.addEventListener("ended", handleAudioEnd);

    return () => {
      audio.removeEventListener("ended", handleAudioEnd);
    };
  }, []);

  /*
   * Accept call
   */
  const handleAcceptCall = () => {
    setCallTime(0);
    setCallAccepted(true);
  };

  /*
   * End call
   */
  const handleEndCall = () => {
    setCallAccepted(false);
    setCallTime(0);

    const audio = audioRef.current;

    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  /*
   * Change call type
   */
  const handleCallTypeChange = (type: CallType) => {
    /*
     * End current call first if active
     */
    if (callAccepted) {
      handleEndCall();
    }

    setCallType(type);
    setDropdownOpen(false);
  };

  return (
    <div className="app">

      {/* CALL TYPE DROPDOWN */}
      <div className="caller-dropdown">

        <button
          className="dropdown-btn"
          onClick={() => setDropdownOpen((prev) => !prev)}
        >
          {callTypeLabel} ▼
        </button>

        {dropdownOpen && (
          <div className="dropdown-menu">

            {/* SUPPORT CALL */}
            <div
              className={`dropdown-item ${callType === "support" ? "active" : ""
                }`}
              onClick={() => handleCallTypeChange("support")}
            >
              Support Call
            </div>

            {/* INTERVIEW CALL */}
            <div
              className={`dropdown-item ${callType === "interview" ? "active" : ""
                }`}
              onClick={() => handleCallTypeChange("interview")}
            >
              Inquire interview
            </div>

            {/* SALES CALL */}
            <div
              className={`dropdown-item ${callType === "sales" ? "active" : ""
                }`}
              onClick={() => handleCallTypeChange("sales")}
            >
              Sales Call
            </div>
            {/* INQUIRY CALL */}
            <div
              className={`dropdown-item ${callType === "inquiry" ? "active" : ""
                }`}
              onClick={() => handleCallTypeChange("inquiry")}
            >
              Inquiry Call
            </div>
            {/* SCHOOL INQUIRY CALL */}
            <div
              className={`dropdown-item ${callType === "schoolInquiry" ? "active" : ""
                }`}
              onClick={() => handleCallTypeChange("schoolInquiry")}
            >
              School Inquiry
            </div>
            {/* GOA VISTA */}
            <div
              className={`dropdown-item ${callType === "goaVista" ? "active" : ""
                }`}
              onClick={() => handleCallTypeChange("goaVista")}
            >
              Flight reshedule
            </div>
            {/* ADMISSION INQUIRY */}
            <div
              className={`dropdown-item ${callType === "admissionInquiry" ? "active" : ""
                }`}
              onClick={() => handleCallTypeChange("admissionInquiry")}
            >
              Admission Inquiry
            </div>

          </div>
        )}
      </div>

      {/* AUDIO */}
      <audio ref={audioRef} src={currentAudio} />

      <div className="phone-frame">
        <div className="screen">

          {!callAccepted ? (
            <>
              {/* INCOMING CALL SCREEN */}

              <div className="top-bar">
                <span>12:39 PM</span>
                <span>📶 🔋</span>
              </div>

              <div className="incoming-container">

                {callType !== "inquiry" &&
                  callType !== "schoolInquiry" &&
                  callType !== "admissionInquiry" &&
                  callType !== "goaVista" && (
                    <p className="caller-label">Incoming Call</p>
                  )}
                <h1 className="caller-name">
                  {callerName}
                </h1>

                <div className="avatar">
                  <div className="avatar-circle">
                    <span>👤</span>
                  </div>
                </div>

                {callType !== "inquiry" &&
                  callType !== "schoolInquiry" &&
                  callType !== "admissionInquiry" &&
                  callType !== "goaVista" && (
                    <p className="caller-label">Incoming Call</p>
                  )}

                <div className="incoming-actions">

                  {/* ACCEPT */}
                  <button
                    className="call-btn accept"
                    onClick={handleAcceptCall}
                  >
                    <FaPhoneAlt />
                  </button>

                  {/* REJECT */}
                  <button
                    className="call-btn reject"
                    onClick={handleEndCall}
                  >
                    <FaPhoneSlash />
                  </button>

                </div>

              </div>
            </>
          ) : (
            <>
              {/* ACTIVE CALL SCREEN */}

              <div className="top-bar">
                <span>12:39 PM</span>
                <span>📶 🔋</span>
              </div>

              <div className="active-call-container">

                <p className="caller-label">
                  Connected
                </p>

                <h1 className="caller-name">
                  {callerName}
                </h1>

                <p className="timer">
                  {formatTime(callTime)}
                </p>

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

                {/* END CALL */}
                <button
                  className="end-call-btn"
                  onClick={handleEndCall}
                >
                  <FaPhoneSlash />
                </button>

              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default App;
