import Signup from '../Signup';
import {registerUser, isUsernameEqual, authenticateUser} from '../Users';
import App from "../App";
import {act} from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";
import {render, screen, waitFor} from '@testing-library/react';


jest.mock('./Users', () => ({
    registerUser: jest.fn(),
    isUsernameEqual: jest.fn(),
}));
// Signup tests
describe('Signup', () => {


    beforeEach(() => {
        // Reset mocks and clear any side effects

        registerUser.mockClear();
        isUsernameEqual.mockClear();
    });


    it('shows the correct message when signing up with a password less than 8 characters', async () => {
        render(<App/>);
        const createAccountButton = screen.getByRole('button', {name: /create new account/i});

        await act(async () => {
            userEvent.click(createAccountButton);
        });
        await act(async () => {
            // Enter signup details
            userEvent.type(screen.getAllByPlaceholderText('Username')[1], 'testuser');
            userEvent.type(screen.getAllByPlaceholderText('Password')[1], 'pass');
            userEvent.type(screen.getByPlaceholderText('Confirm Password'), 'pass');
            userEvent.type(screen.getByPlaceholderText('Display Name'), 'Test User');
        });

        // Submit the form
        const SignUpButton = screen.getByRole('button', {name: /Sign Up/i});
        await act(async () => {
            userEvent.click(SignUpButton);
        });

        // Check for error message
        await waitFor(() => {
            expect(screen.getByText('Password must be at least 8 characters long')).toBeInTheDocument();
        });

        // Ensure registerUser was not called
        expect(registerUser).not.toHaveBeenCalled();
    });

});