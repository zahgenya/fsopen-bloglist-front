import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
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

test('clicking the view button show URL, author and likes', async () => {
  const blog = {
    title: 'second test title',
    author: 'zhenek',
    url: 'adfpka.com',
    likes: 12,
  };

  const { getByText } = render(<Blog blog={blog} />);

  const viewButton = getByText('View');
  fireEvent.click(viewButton);

  expect(getByText('likes: 12')).toBeInTheDocument();
  expect(getByText('zhenek')).toBeInTheDocument();
  expect(getByText('adfpka.com')).toBeInTheDocument();
});

test('clicking like button twice return two event handler calls', async () => {
  const blog = {
    title: 'likes test',
    author: 'zhenek',
    url: 'pokasdf.com',
    likes: 0,
  };

  const mockHandler = jest.fn();

  render(<Blog blog={blog} addLike={mockHandler} />);

  const user = userEvent.setup();
  const button = screen.getByText('like');
  await user.click(button);
  await user.click(button);

  expect(mockHandler.mock.calls).toHaveLength(2);
});
