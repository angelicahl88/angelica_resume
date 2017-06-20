import React from 'react';
import { render } from 'react-dom';

import resumeData from '../data/resume.json';

// import styles
import css from './styles/main.scss';

import App from './App';

render(
   <App data={resumeData} />,
   document.getElementById('root')
);
