import React, {
  KeyboardEvent, useState, useMemo, ReactNode, useEffect, useRef,
  Fragment,
} from 'react';
import { computeScore } from './scripts';

const INITIAL_SCORE = {
  acc: '0%',
  wpm: '0',
  accText: '0%',
  wpmText: '0 words/m',
  scored: false,
};

const TYPING_COUNTER = 60;

export interface TypingTestProps {
  generatedText: string,
  generateNewText: () => void,
  retrieveScore?: (acc: string, wpm: string) => void,
  children: ReactNode,
}

const TypingTest = ({
  generatedText = '',
  generateNewText,
  retrieveScore,
  children,
}: TypingTestProps) => {
  const arrText = generatedText.trim().split('');
  const [tracked, setTracked] = useState<string[]>([]);
  const [score, setScore] = useState(INITIAL_SCORE);
  const [counter, setCounter] = useState(0);
  const rootRef = useRef(null);

  const handleInitialize = () => {
    setScore(INITIAL_SCORE);
    rootRef.current.focus();
    setTracked([]);
  };

  const handleStart = () => {
    setCounter(TYPING_COUNTER);
    handleInitialize();
  };

  const handleRestart = () => {
    setCounter(0);
    handleInitialize();
  };

  /**
   * 2 instance to capture. When counter hits 0
   * or tracked exceeded the arrText length
   */
  const handleGenerateScore = () => {
    setScore({ ...computeScore(arrText, tracked, true), scored: true });

    setCounter(0);
  };

  /**
   * Counter
   */
  useEffect(() => {
    if (counter === 0 && generatedText) {
      handleGenerateScore();
    }

    const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);

    return () => clearInterval(timer);
  }, [counter]);

  /**
   * Initialize the component
   */
  useEffect(() => {
    generateNewText();
    rootRef.current.focus();
  }, []);

  // Generates new arr objects
  const fieldText = useMemo(() => {
    const newFieldText: any[] = [];

    arrText.forEach((t, i) => {
      newFieldText.push({
        text: t,
        isCorrect: t === tracked[i] || false,
        hasPassed: Boolean(tracked[i]),
      });
    });

    return newFieldText;
  }, [tracked, generatedText]);

  // Listens to keyboard changes
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement >): void => {
    if (counter === 0) {
      return;
    }

    if (tracked.length >= fieldText.length) {
      setCounter(0);
      return;
    }

    if (e.ctrlKey || e.metaKey) {
      return;
    }

    /**
     * Handle unallowed key presses
     */
    switch (e.key) {
      case 'Esc': // IE/Edge specific value
      case 'Escape':
      case 'Shift': // Enter
      case 'Ctrl': // Ctrl
      case 'Alt': // Alt
      case 'Pause/Break': // Pause/Break
      case 'Caps Lock': // Caps Lock
      case 'End': // End
      case 'Home': // Home
      case 'Left': // Left
      case 'Up': // Up
      case 'Right': // Right
      case 'Down': // Down
        break;
      case 'Enter': // Enter
        setTracked([...tracked, ' ']);
        break;
      case 'Backspace':
        setTracked([...tracked.slice(0, tracked.length - 1)]);
        break;
      default:
        setTracked([...tracked, e.key]);
        break;
    }

    setScore({ ...computeScore(arrText, tracked), scored: false });
  };

  // Generated text
  const renderFieldText = fieldText.map((t, key) => (
    <span title={tracked[key]} key={key} className={`${t.isCorrect ? 'correct' : `${t.hasPassed && 'incorrect'}`}`}>{`${t.text}`}</span>
  ));

  const renderScore = (
    <div className="typing-test__score">
      <p>
        Time:
        <span>{` ${counter}s`}</span>
      </p>
      <p>
        Accuracy:
        <span>{` ${score.accText}`}</span>
      </p>
      <p>
        WPM:
        <span>{` ${score.wpmText}`}</span>
      </p>
    </div>
  );

  const renderNote = (
    <p className="typing-test__note">
      {'Made by the DEV Team <3. '}
      <a href="https://github.com/crrmacarse/react-typing-test" title="Its open source!" target="_blank" rel="noopener noreferrer">Github link</a>
    </p>
  );

  const renderSubmit = retrieveScore && tracked.length > 0 && counter === 0 && (
    <button
      onClick={() => {
        retrieveScore(score.acc, score.wpm);
      }}
      type="button"
      color="primary"
    >
      Submit
    </button>
  );

  const renderStartButton = (
    <button
      onClick={handleStart}
      type="button"
      color="secondary"
      style={{ marginRight: '1rem' }}
    >
      {counter === 0 ? 'Start' : 'Start Typing...'}
    </button>
  );

  const renderRestartButton = (
    <button
      onClick={handleRestart}
      type="button"
      color="secondary"
      style={{ marginRight: '1rem' }}
    >
      Restart
    </button>
  );

  return (
    <Fragment>
      {renderScore}
      <div className="typing-test__paper" ref={rootRef} onKeyDown={handleKeyDown} role="presentation" tabIndex={0}>
        {children}
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
        <div className="typing-test__textfield">
          {renderFieldText}
          {/* <div className="typing-test__textfield--tracked">{tracked.map((t) => t)}</div> */}
        </div>
      </div>
      <small>
        Note: You could hover on &quot;information sign&quot; on the
        upper right corner to read more about the manual.
      </small>
      <div className="typing-test__input">
        {tracked.length > 0 ? renderRestartButton : renderStartButton}
        {renderSubmit}
      </div>
      {renderNote}
    </Fragment>
  );
};

export default TypingTest;
