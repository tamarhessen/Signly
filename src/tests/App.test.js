// App.test.js

import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';
import {act} from "react-dom/test-utils";
import {authenticateUser, getAuthenticatedUserData, registerUser} from "../Users";

// Test for App
describe('App', () => {
    it('renders correctly in the start', () => {
        render(
                <App />
        );
        // Add assertions here to ensure that the app renders correctly initially
        expect(screen.getByText('facebook')).toBeInTheDocument();
    });
});

// Tests for Login
describe('Login', () => {
    it('opens the modal when clicking on "Create new account"', async () => {
        render(
                <App />
        );
        const createAccountButton = screen.getByRole('button', { name: /create new account/i });
        userEvent.click(createAccountButton);
        // Add assertions here to check if the modal opens
        await waitFor(() => {
            expect(screen.getByText('By clicking Sign Up, you agree to our Terms, Data Policy and Cookies Policy. You may receive SMS notifications from us and can opt out at any time.')).toBeInTheDocument();
        });
    });

    it('shows the correct message when clicking on Log In without writing anything', async () => {
        render(
            <App />
        );

        const loginButton = screen.getByRole('button', { name: /log in/i });

        await act(async () => {
            userEvent.click(loginButton);
        });

        // Add assertions here to check if the correct error message is displayed
        expect(await screen.findByText('Invalid username or password')).toBeInTheDocument();
    });
});





describe('Authentication', () => {
    const mockUsers = [
        { username: 'user1', password: 'password1' },
        { username: 'user2', password: 'password2' },
    ];

    beforeAll(() => {
        // Populate users array with mock data
        mockUsers.forEach(user => registerUser(user));
    });

    test('User authentication with correct credentials should return true', () => {
        expect(authenticateUser('user1', 'password1')).toBe(true);
    });

    test('User authentication with incorrect credentials should return false', () => {
        expect(authenticateUser('user1', 'wrongpassword')).toBe(false);
    });

    test('getAuthenticatedUserData should return user data when user is authenticated', () => {
        const authenticatedUserData = getAuthenticatedUserData('user1');
        expect(authenticatedUserData).toEqual(mockUsers[0]);
    });

    test('getAuthenticatedUserData should return null when user is not authenticated', () => {
        const authenticatedUserData = getAuthenticatedUserData('unknownUser');
        expect(authenticatedUserData).toBeNull();
    });
});
