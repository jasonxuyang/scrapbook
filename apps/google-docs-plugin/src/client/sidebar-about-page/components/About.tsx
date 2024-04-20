import React from 'react';
import { serverFunctions } from '../../utils/serverFunctions';

const About = () => (
  <div>
    <p>
      <b>☀️ React app inside a sidebar! ☀️</b>
    </p>
    <p>
      This is a very simple page demonstrating how to build a React app inside a
      sidebar.
    </p>
    <p>
      Visit the Github repo for more information on how to use this project.
    </p>
    <p>- Elisha Nuchi</p>
    <a
      href="https://www.github.com/enuchi/React-Google-Apps-Script"
      target="_blank"
      rel="noopener noreferrer"
    >
      React + Google Apps Script
    </a>
    <button
      onClick={() => {
        console.log('hello');
        serverFunctions
          .getSelectedText()
          .then((value) => console.log(value))
          .catch(alert);
      }}
    >
      Get selected text
    </button>
  </div>
);

export default About;
