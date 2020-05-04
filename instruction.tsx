import React from 'react';

const PublicTypingTestInstruction = () => (
  <div className="typing-test__instruction">
    <div className="typing-test__instruction__header">
      <h3>XtendOps Typing Test v1.0</h3>
      <small>i</small>
    </div>
    <p>
      This aims to generate accuracy and WPM(word per min) out of user input.
      Both score will be weighed together to identify the user&apos;s capability
      with regards to keyboard interaction.
    </p>
    <h4>Instructions:</h4>
    <ul>
      <li>
        The typing test will only start the moment you put your first input in the textbox.
      </li>
      <li>
        Instruction 2
      </li>
      <li>
        Instruction 3
      </li>
    </ul>
  </div>
);

export default PublicTypingTestInstruction;
