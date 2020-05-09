import { sendEvent } from 'utils/ga';

const SS_TYPING_TEST_SCORE = 'typingTestScore';

const getTTScore = () => window.sessionStorage.getItem(SS_TYPING_TEST_SCORE);
const setTTScore = (newScore: string) => window.sessionStorage.setItem(
  SS_TYPING_TEST_SCORE,
  newScore,
);

export const isMatch = (text: string, input: RegExp): boolean => Boolean(text.match(input));

/**
 * Generates score
 * @param generated - Text generated
 * @param trackedInput - User generated
 *
 * https://www.speedtypingonline.com/typing-equations
 */
export const computeScore = (generated: string[], trackedInput: string[], done = false) => {
  // const generatedTotalChars = generated.join('').trim().length;
  const trackedTotalChars = trackedInput.join('').trim().length;
  const grossWPM = (trackedTotalChars / 5) / 1;

  let tally = {
    acc: 0,
  };

  generated.forEach((gText, i) => {
    if (gText && trackedInput[i]) {
      const generatedChar = gText.split('');
      const trackedChar = trackedInput[i].split('');

      generatedChar.forEach((gChar, a) => {
        if (gChar === trackedChar[a]) {
          tally = {
            acc: tally.acc += 1,
          };
        }
      });
    }
  });

  const accScore = Math.floor((tally.acc / trackedTotalChars) * 100) || 0;
  const isNewHighScore = done && (accScore > (Number(getTTScore()) || 0));

  if (isNewHighScore) {
    setTTScore(String(accScore));
  }

  const score = {
    acc: `${accScore}%${isNewHighScore ? '(Your new highest record!)' : ''}`,
    wpm: `${grossWPM.toFixed(2)} words/m`,
  };

  sendEvent({
    category: 'Typing Test',
    action: `Scored typing test of [acc: ${score.acc}] [wpm: ${score.wpm}]`,
  });

  return score;
};
