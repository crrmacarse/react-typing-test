import React, {
  KeyboardEvent, useState, ChangeEvent, useMemo, Fragment,
} from 'react';
import { Paper } from '@material-ui/core';
import { generateNewText, computeScore } from './scripts';
import Instruction from './instruction';

const INITIAL_SCORE = { acc: '0%', wpm: '0 words/m', scored: false };

/**
 * @BUG
 * - Problem with ENTER interaction. It should also clear the field
 * - Hitting space will skip check
 */
const TypingTest = ({ generatedText = '' }: { generatedText: string }) => {
  const [input, setInput] = useState('');
  const [tracked, setTracked] = useState<string[]>([]);
  const [score, setScore] = useState(INITIAL_SCORE);
  const [arrText, setArrText] = useState<string[]>(generatedText.split(' '));

  // find better way. this should be generated outside
  const handleFieldReset = () => {
    const fields = generateNewText();

    setArrText(fields.split(' '));
  };

  // generates new object arr
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
  }, [tracked, arrText]);

  // Listens to keyboard changes
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement >): void => {
    if (e.key === ' ') {
      setTracked([...tracked, input.trim()]);
      setInput('');
    }
  };

  // Listens to input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (score.scored) {
      setScore(INITIAL_SCORE);
      handleFieldReset();
      setTracked([]);

      return;
    }

    // exits on last
    if (tracked.length >= fieldText.length) {
      setScore({ ...computeScore(arrText, tracked), scored: true });

      return;
    }

    setInput(e.target.value);
  };

  // Fields
  const renderFieldText = fieldText.map((t, key) => (
    <span title={tracked[key]} key={key} className={`${t.isCorrect ? 'correct' : `${t.hasPassed && 'incorrect'}`}`}>{`${t.text} `}</span>
  ));

  // Results will be render once done
  const renderResults = score.scored && (
    <div className="typing-test__result">
      {tracked.map((t, key) => <span key={key}>{`${t} `}</span>)}
      <br />
      <small>Note: You could hover individually to compare the input</small>
    </div>
  );

  const renderScore = (
    <div className="typing-test__score">
      <p>
        Time:
        <span>{' 60s'}</span>
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
    if (tracked.length === 0) {
      return 'Typing test will start upon first input here';
    }

    if (score.scored) {
      return 'Done! You could find your score on the upper left corner. Do you want to try again? Press any key here';
    }

    return 'Typing Test is still ongoing..';
  };

  return (
    <Fragment>
      {renderScore}
      <Paper className="typing-test__paper">
        <Instruction />
        <div className="typing-test__textfield">
          {renderFieldText}
          {renderResults}
        </div>
      </Paper>
      <input
        type="text"
        placeholder={renderPlaceHolder()}
        value={input}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
      />
      {renderNote}
    </Fragment>
  );
};

export default TypingTest;
