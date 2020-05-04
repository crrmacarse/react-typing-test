import { sendEvent } from 'utils/ga';

const SS_TYPING_TEST_SCORE = 'typingTestScore';

const settledInRandTextSinceGettingBlockbyCors = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Curabitur vitae dolor imperdiet, tempor diam in, gravida senectus et netus',
  'Dolor. Etiam ac feugiat velit. Suspendisse in purus id sem ultrices, rhoncus',
  'Rhoncus maximus. Integer semper orci eget porttitor consectetur adipiscing lacinia.',
  'Vestibulum quis neque ultrices, rhoncus justo quis, elementum lectus.',
  'Cras vestibulum urna at convallis aliquet. Maecenas eget orci vel quam ae dolor imperdiet',
  'Dignissim convallis eu at erat. Suspendisse sagittis a orci porttitor',
  'Imperdiet. Mauris quis cursus est. Proin senectus et netus vel leo eros. Pellentesque',
  'Habitant morbi tristique senectus et netus et malesuada fames ac turpis',
  'Egestas. Sed vehicula lacus leo, sed eleifen lorem tincidunt viverra.',
  'Nam tincidunt iaculis sem, in congue ipsum pulvinar non.',
];

export const generateNewText = () => (
  settledInRandTextSinceGettingBlockbyCors[Math.floor(
    Math.random() * settledInRandTextSinceGettingBlockbyCors.length,
  )]
);

const getTSScore = () => window.sessionStorage.getItem(SS_TYPING_TEST_SCORE);
const setTSScore = (newScore: string) => window.sessionStorage.setItem(
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
export const computeScore = (generated: string[], trackedInput: string[]) => {
  const generatedTotalChars = generated.join('').trim().length;
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

  const accScore = Math.floor((tally.acc / generatedTotalChars) * 100);
  const isNewHighScore = accScore > (Number(getTSScore()) || 0);

  if (isNewHighScore) {
    setTSScore(String(accScore));
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
