import React from 'react';
import { Grid } from '@material-ui/core';
import TypingTest from './typing-test';
import { generateNewText } from './scripts';

/**
 * @TODO
 * Could pass instruction instead
 * Add button in center to start
 * Add timer
 * Retrieve from backend the text
 */
const PublicTypingTest = () => (
  <Grid container className="typing-test">
    <Grid item xs={12}>
      <TypingTest generatedText={generateNewText()} />
    </Grid>
  </Grid>
);

export default PublicTypingTest;
