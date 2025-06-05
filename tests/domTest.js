/**
 * DOM Rendering Test
 * 
 * This is a simple test to verify that the DOM rendering functions don't throw errors.
 * It doesn't actually render anything to a real DOM, but checks that the functions
 * execute without errors and return the expected elements.
 */

import { createGameBoard, createShipPlacement, updateCell, showMessage, createGameContainer } from '../ui/dom.js';

// Mock document functions
global.document = {
  createElement: (tag) => {
    const element = {
      style: {},
      classList: {
        add: (className) => { element.className = element.className ? `${element.className} ${className}` : className; },
        remove: () => {}
      },
      appendChild: (child) => { 
        if (!element.children) element.children = [];
        element.children.push(child);
        return child;
      },
      addEventListener: () => {},
      dataset: {},
      className: '',
      querySelector: (selector) => {
        // Return a mock cell element
        return {
          classList: {
            add: () => {},
            remove: () => {}
          }
        };
      }
    };
    return element;
  },
  getElementById: () => ({
    appendChild: () => {},
    insertBefore: () => {},
    firstChild: {}
  })
};

// Mock document.body
global.document.body = {
  appendChild: () => {}
};

console.log('=== DOM RENDERING TEST ===');

// Test createGameBoard
try {
  const playerBoard = createGameBoard('Player', () => {});
  console.log('✓ createGameBoard - Player board created successfully');
  console.log(`  - Has ${playerBoard.children?.length || 0} children`);
  
  const computerBoard = createGameBoard('Computer', () => {});
  console.log('✓ createGameBoard - Computer board created successfully');
  console.log(`  - Has ${computerBoard.children?.length || 0} children`);
} catch (error) {
  console.error('✗ createGameBoard - Error:', error);
}

// Test createShipPlacement
try {
  const shipPlacement = createShipPlacement(() => {}, () => {});
  console.log('✓ createShipPlacement - Ship placement interface created successfully');
  console.log(`  - Has ${shipPlacement.children?.length || 0} children`);
} catch (error) {
  console.error('✗ createShipPlacement - Error:', error);
}

// Test updateCell
try {
  const board = createGameBoard('Test', () => {});
  updateCell(board, 0, 'ship');
  console.log('✓ updateCell - Cell updated successfully');
} catch (error) {
  console.error('✗ updateCell - Error:', error);
}

// Test showMessage
try {
  showMessage('Test message');
  console.log('✓ showMessage - Message shown successfully');
} catch (error) {
  console.error('✗ showMessage - Error:', error);
}

// Test createGameContainer
try {
  const container = createGameContainer();
  console.log('✓ createGameContainer - Game container created successfully');
  console.log(`  - Has class: ${container.className}`);
} catch (error) {
  console.error('✗ createGameContainer - Error:', error);
}

console.log('\n=== DOM RENDERING TEST COMPLETE ==='); 