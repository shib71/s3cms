import React from 'react';
import Root from 'app/components/root';
import { store } from 'app/store';

React.render(
	// The child must be wrapped in a function
	// to work around an issue in React 0.13.
	<Root />,
	document.body
);