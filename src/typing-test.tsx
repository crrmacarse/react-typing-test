import React, {
  KeyboardEvent, useState, ChangeEvent, useMemo, Fragment, ReactNode, useEffect, useRef,
} from 'react';
import { Paper, Button } from '@material-ui/core';
import { computeScore } from './scripts';

const INITIAL_SCORE = { acc: '0%', wpm: '0 words/m', scored: false };

export interface TypingTestProps {
  generatedText: string,
  generateNewText: () => void,
  retrieveScore?: (acc: string, wpm: string) => void,
  children: ReactNode,
}
/**
 * @BUG
 * - Problem with ENTER interaction. It should also clear the field
 * - counter still running
 */
const TypingTest = ({
  generatedText = '',
  generateNewText,
  retrieveScore,
  children,
}: TypingTestProps) => {
  const arrText = generatedText.split(' ');
  const [input, setInput] = useState('');
  const [tracked, setTracked] = useState<string[]>([]);
  const [score, setScore] = useState(INITIAL_SCORE);
  const [counter, setCounter] = useState(0);
  const inputRef = useRef(null);

  const handleStart = () => {
    generateNewText();
    setCounter(60);
    setScore(INITIAL_SCORE);
    setTracked([]);
    setInput('');
    inputRef.current.focus();
  };

  const handleGenerateScore = () => {
    setScore({ ...computeScore(arrText, tracked, true), scored: true });

    if (typeof retrieveScore === 'function') {
      retrieveScore(score.acc, score.wpm);
    }

    setCounter(0);
    setInput('');
  };

  useEffect(() => {
    if (counter === 0 && generatedText) {
      handleGenerateScore();
    }

    const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);

    return () => clearInterval(timer);
  }, [counter]);

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
    if (e.key === ' ') {
      setTracked([...tracked, input.trim()]);
      setInput('');
    }
  };

  // Listens to input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (counter === 0) {
      return;
    }

    if (tracked.length >= fieldText.length) {
      handleGenerateScore();
      return;
    }

    setScore({ ...computeScore(arrText, tracked), scored: false });
    setInput(e.target.value);
  };

  // Generated text
  const renderFieldText = fieldText.map((t, key) => (
    <span title={tracked[key]} key={key} className={`${t.isCorrect ? 'correct' : `${t.hasPassed && 'incorrect'}`}`}>{`${t.text} `}</span>
  ));

  // Results will be render once done
  const renderResults = score.scored && (
    <div className="typing-test__result">
      {tracked.map((t, key) => <span key={key}>{`${t} `}</span>)}
    </div>
  );

  const renderScore = (
    <div className="typing-test__score">
      <p>
        Time:
        <span>{` ${counter}s`}</span>
      </p>
      <p>
        Accuracy:
        <span>{` ${score.acc}`}</span>
      </p>
      <p>
        WPM:
        <span>{` ${score.wpm}`}</span>
      </p>
    </div>
  );

  const renderNote = (
    <p className="typing-test__note">
      {'Made by the DEV Team <3. '}
      <a href="https://github.com/crrmacarse/react-typing-test" title="Its open source!" target="_blank" rel="noopener noreferrer">Github link</a>
    </p>
  );

  const renderPlaceHolder = () => {
    if (!generatedText) {
      return 'Click Start to begin';
    }

    if (score.scored) {
      return 'Done! You could find your score on the upper left corner.';
    }

    if (tracked.length === 0) {
      return 'Type your input here';
    }

    return 'Typing Test is still ongoing..';
  };

  return (
    <Fragment>
      {renderScore}
      <Paper className="typing-test__paper">
        {children}
        <div className="typing-test__textfield">
          {renderFieldText}
          {renderResults}
        </div>
      </Paper>
      <small>Note: You could hover on the words individually to compare the input</small>
      <div className="typing-test__input">
        <input
          type="text"
          ref={inputRef}
          placeholder={renderPlaceHolder()}
          value={input}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
        />
        <Button
          onClick={handleStart}
          type="button"
          variant="contained"
          color="primary"
        >
          {tracked.length > 0 ? 'Restart' : 'Start'}
        </Button>
      </div>
      {renderNote}
    </Fragment>
  );
};

export default TypingTest;
