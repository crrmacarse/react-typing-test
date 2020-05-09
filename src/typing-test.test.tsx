import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { PublicTypingTest } from 'components/public/typing-test-demo';
import { computeScore } from './scripts';

let wrapper: ShallowWrapper;

beforeEach(() => {
  wrapper = shallow(<PublicTypingTest generatedText="test" handleFetchGeneratedText={jest.fn()} />);
});

describe('<PublicTypingTest />', () => {
  it('renders', () => {
    expect(wrapper).not.toBeNull();
  });

  it('matches asserted perfect score', () => {
    const assertedValue = {
      acc: '100%(Your new highest record!)',
      wpm: '0.80 words/m',
    };
    const tracked = ['test'];
    const generated = ['test'];

    expect(computeScore(tracked, generated, true)).toMatchObject(assertedValue);
  });

  it('matches asserted score', () => {
    const assertedValue = {
      acc: '44%',
      wpm: '1.80 words/m',
    };
    const tracked = ['test', 'unmatched'];
    const generated = ['test', 'test2'];

    expect(computeScore(tracked, generated)).toMatchObject(assertedValue);
  });
});
