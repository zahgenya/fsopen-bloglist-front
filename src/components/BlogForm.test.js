import React from "react";
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BlogForm from "./BlogForm";
import userEvent from "@testing-library/user-event";

test('checking if form calls the event handler', async () => {
    const user = userEvent.setup();
    const createBlog = jest.fn();

    render(<BlogForm createBlog={createBlog} />)

    const titleInput = screen.getByLabelText('Title:');
    const authorInput = screen.getByLabelText('Author:');
    const urlInput = screen.getByLabelText('URL:');
    const sendButton = screen.getByText('save');

    await user.type(titleInput, 'testing form...');
    await user.type(authorInput, 'testUser');
    await user.type(urlInput, 'testwebsite.com');
    await user.click(sendButton);

    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog).toHaveBeenCalledWith({
        title: 'testing form...',
        author: 'testUser',
        url: 'testwebsite.com',
        likes: 0,
    });
})