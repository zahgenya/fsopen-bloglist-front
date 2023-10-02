import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

test('renders title', () => {
  const blog = {
    title: 'test title',
    author: 'zhenek',
    url: 'sdgfgdfsgd.com',
    likes: 2,
  };

  render(<Blog blog={blog} />);

  const element = screen.getByText('test title');
  expect(element).toBeDefined();
});
