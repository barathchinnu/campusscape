import { useState } from 'react';
import { useGameStore } from '../store/gameStore';

const LECTURES = {
  'CSE Block': {
    subject: 'Data Structures & Algorithms',
    topic: 'Graph Representation & Dijkstra\'s Pathfinding',
    slides: [
      'Welcome to CSE 301: Data Structures.',
      'A Graph G = (V, E) consists of Vertices and Edges.',
      'Dijkstra\'s Algorithm solves single-source shortest path problems.',
      'It uses a Min-Priority Queue to select the next node.',
      'Time complexity is O((V + E) log V).',
    ],
    question: 'What is the time complexity of searching in a balanced BST?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correct: 1,
  },
  'ECE Block': {
    subject: 'Digital Signal Processing',
    topic: 'Fourier Transform & Frequency Domain Analysis',
    slides: [
      'Welcome to ECE 304: DSP Lecture.',
      'Continuous signals are converted to discrete via sampling.',
      'Nyquist rate states sampling frequency must be fs > 2 * fmax.',
      'DFT converts time domain sequence to frequency domain.',
      'FFT reduces computing complexity from O(N^2) to O(N log N).',
    ],
    question: 'What does FFT stand for?',
    options: ['Fast Fourier Transform', 'First Fourier Term', 'Frequency Filter Tool', 'Fast Filter Type'],
    correct: 0,
  },
  'Mechanical Block': {
    subject: 'Thermodynamics',
    topic: 'Carnot Cycle & Thermal Efficiency',
    topicIntro: 'Welcome to ME 202: Applied Thermodynamics.',
    slides: [
      'The Carnot Cycle is an idealized thermodynamic cycle.',
      'It consists of four reversible processes: 2 isothermal, 2 adiabatic.',
      'Efficiency depends only on absolute temperatures of source & sink.',
      'No real engine can be more efficient than a Carnot engine.',
      'Thermal efficiency formula: η = 1 - (Tc / Th).',
    ],
    question: 'Which cycle has the highest theoretical efficiency?',
    options: ['Otto Cycle', 'Rankine Cycle', 'Carnot Cycle', 'Diesel Cycle'],
    correct: 2,
  },
  'EEE Block': {
    subject: 'Electrical Machines',
    topic: 'AC Motors & Magnetic Induction',
    slides: [
      'Welcome to EE 204: AC Machines.',
      'AC induction motor operates on Faraday\'s law of induction.',
      'Rotor speed is always slightly less than synchronous speed.',
      'The difference between synchronous speed and rotor speed is Slip.',
      'Formula for synchronous speed: Ns = 120 * f / P.',
    ],
    question: 'What causes the rotation in an induction motor?',
    options: ['Direct current contact', 'Rotating magnetic field', 'Permanent magnets', 'Mechanical crank'],
    correct: 1,
  },
};

export default function Classroom() {
  const classroomBuilding = useGameStore((s) => s.classroomBuilding);
  const setClassroomBuilding = useGameStore((s) => s.setClassroomBuilding);
  const addPoints = useGameStore((s) => s.addPoints);
  const showToast = useGameStore((s) => s.showToast);

  const [slideIndex, setSlideIndex] = useState(0);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  if (!classroomBuilding) return null;

  const deptName = classroomBuilding.name;
  const lecture = LECTURES[deptName] || {
    subject: 'General Education',
    topic: 'KEC Campus Orientation',
    slides: [
      'Welcome to Kongu Engineering College.',
      'Keep campus clean and green.',
      'Maintain 75% attendance for all classes.',
    ],
    question: 'When was KEC founded?',
    options: ['1984', '1990', '2000', '2010'],
    correct: 0,
  };

  const handleNextSlide = () => {
    if (slideIndex < lecture.slides.length - 1) {
      setSlideIndex(p => p + 1);
    }
  };

  const handlePrevSlide = () => {
    if (slideIndex > 0) {
      setSlideIndex(p => p - 1);
    }
  };

  const handleAttendance = () => {
    if (attendanceMarked) return;
    setAttendanceMarked(true);
    addPoints(50);
    showToast('📝 Attendance Marked: Present! +50 Points!');
  };

  const handleQuizAnswer = (idx) => {
    if (quizAnswered) return;
    setSelectedOption(idx);
    setQuizAnswered(true);
    if (idx === lecture.correct) {
      addPoints(30);
      showToast('🎉 Correct answer! +30 Points!');
    } else {
      showToast('❌ Wrong answer. Keep studying!');
    }
  };

  const handleExit = () => {
    setClassroomBuilding(null);
    setSlideIndex(0);
    setAttendanceMarked(false);
    setQuizAnswered(false);
    setSelectedOption(null);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 2200,
      background: 'rgba(5, 10, 20, 0.9)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', sans-serif",
      pointerEvents: 'auto',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #0b1528 0%, #030812 100%)',
        border: '2px solid #2ecc71',
        borderRadius: 24,
        width: 820,
        maxWidth: '95vw',
        height: '85vh',
        boxShadow: '0 12px 48px rgba(46, 204, 113, 0.25)',
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(90deg, #102a1e 0%, #06150f 100%)',
          borderBottom: '2px solid #2ecc71',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#2ecc71' }}>
              🏫 KEC LECTURE HALL — {deptName.toUpperCase()}
            </div>
            <div style={{ fontSize: 13, color: '#aaa', marginTop: 2 }}>
              Subject: <strong>{lecture.subject}</strong> | Topic: <em>{lecture.topic}</em>
            </div>
          </div>
          <button
            onClick={handleExit}
            style={{
              background: '#e74c3c',
              border: 'none',
              borderRadius: 8,
              color: '#fff',
              padding: '8px 20px',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(231,76,60,0.3)',
            }}
          >
            🚪 Exit Class
          </button>
        </div>

        {/* Content Area */}
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20, padding: 24, overflowY: 'auto' }}>
          {/* Left: Projector Screen */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{
              background: '#fff',
              color: '#1a1a2e',
              border: '12px solid #333',
              borderRadius: 8,
              aspectRatio: '16/10',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 30,
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3)',
              textAlign: 'center',
              position: 'relative',
            }}>
              {/* Projector light beam overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 80%)',
                pointerEvents: 'none',
              }} />
              
              <div style={{ fontSize: 14, color: '#2ecc71', fontWeight: 800, marginBottom: 12 }}>
                SLIDE {slideIndex + 1} OF {lecture.slides.length}
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0, lineHeight: 1.4 }}>
                {lecture.slides[slideIndex]}
              </h2>
            </div>

            {/* Slide Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
              <button
                onClick={handlePrevSlide}
                disabled={slideIndex === 0}
                style={{
                  flex: 1,
                  background: slideIndex === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.15)',
                  color: slideIndex === 0 ? '#666' : '#fff',
                  border: 'none',
                  padding: '10px',
                  borderRadius: 8,
                  fontWeight: 600,
                  cursor: slideIndex === 0 ? 'not-allowed' : 'pointer',
                }}
              >
                ◀ Prev Slide
              </button>
              <button
                onClick={handleNextSlide}
                disabled={slideIndex === lecture.slides.length - 1}
                style={{
                  flex: 1,
                  background: slideIndex === lecture.slides.length - 1 ? 'rgba(255,255,255,0.05)' : '#2ecc71',
                  color: slideIndex === lecture.slides.length - 1 ? '#666' : '#fff',
                  border: 'none',
                  padding: '10px',
                  borderRadius: 8,
                  fontWeight: 600,
                  cursor: slideIndex === lecture.slides.length - 1 ? 'not-allowed' : 'pointer',
                }}
              >
                Next Slide ▶
              </button>
            </div>
          </div>

          {/* Right: Classroom Desk Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Teacher section */}
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 14,
              padding: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}>
              <div style={{ fontSize: 32 }}>👨‍🏫</div>
              <div>
                <div style={{ fontWeight: 700 }}>Prof. Ramanujan</div>
                <div style={{ fontSize: 11, color: '#aaa' }}>Faculty of {deptName.split(' ')[0]}</div>
              </div>
              <div style={{
                marginLeft: 'auto',
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#2ecc71',
                boxShadow: '0 0 8px #2ecc71',
              }} />
            </div>

            {/* Attendance board */}
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 14,
              padding: 16,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 13, color: '#aaa', marginBottom: 10 }}>DAILY ATTENDANCE</div>
              <button
                onClick={handleAttendance}
                disabled={attendanceMarked}
                style={{
                  width: '100%',
                  background: attendanceMarked ? '#1e3828' : 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)',
                  color: attendanceMarked ? '#2ecc71' : '#fff',
                  border: 'none',
                  padding: '12px',
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: attendanceMarked ? 'default' : 'pointer',
                  boxShadow: attendanceMarked ? 'none' : '0 4px 12px rgba(46,204,113,0.3)',
                }}
              >
                {attendanceMarked ? '✓ Present Marked (+50 pts)' : '📝 Mark Attendance'}
              </button>
            </div>

            {/* Quiz section */}
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 14,
              padding: 16,
            }}>
              <div style={{ fontSize: 12, color: '#f1c40f', fontWeight: 800, marginBottom: 8, letterSpacing: '0.05em' }}>
                🧠 CLASS POP QUIZ
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.4, marginBottom: 12 }}>
                {lecture.question}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {lecture.options.map((opt, idx) => {
                  const isCorrect = idx === lecture.correct;
                  const isSelected = idx === selectedOption;
                  let bg = 'rgba(255,255,255,0.08)';
                  let border = '1px solid rgba(255,255,255,0.15)';
                  let color = '#fff';

                  if (quizAnswered) {
                    if (isCorrect) {
                      bg = 'rgba(46,204,113,0.2)';
                      border = '1px solid #2ecc71';
                      color = '#2ecc71';
                    } else if (isSelected) {
                      bg = 'rgba(231,76,60,0.2)';
                      border = '1px solid #e74c3c';
                      color = '#e74c3c';
                    } else {
                      bg = 'rgba(255,255,255,0.02)';
                      border = '1px solid rgba(255,255,255,0.05)';
                      color = '#888';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleQuizAnswer(idx)}
                      disabled={quizAnswered}
                      style={{
                        background: bg,
                        border: border,
                        color: color,
                        padding: '10px 12px',
                        borderRadius: 8,
                        fontSize: 12,
                        textAlign: 'left',
                        cursor: quizAnswered ? 'default' : 'pointer',
                        transition: 'background 0.2s',
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          background: 'rgba(0,0,0,0.2)',
          padding: '12px 24px',
          textAlign: 'center',
          fontSize: 11,
          color: '#666',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          Kongu Engineering College • Perundurai • Erode
        </div>
      </div>
    </div>
  );
}
