import { screen, fireEvent } from "@testing-library/react";
import { useDispatch } from "react-redux";
import Navigation from "../navigation.component";
import { renderWithProvider } from "../../../utils/test/test.utils";
import { signOutStart } from "../../../store/user/user.action";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
}));

describe("Navigation tests", () => {
  test("It should render a Sign In link and not a Sign Out link if there is no currentUser", () => {
    renderWithProvider(<Navigation />, {
      preloadedState: {
        user: {
          currentUser: null,
        },
      },
    });

    const signInLinkElement = screen.getByText(/sign in/i);
    expect(signInLinkElement).toBeInTheDocument();

    const signOutLinkElement = screen.queryByText(/sign out/i);
    expect(signOutLinkElement).toBeNull();
  });

  test("It should render Sign Out link and not Sign In link if there is a currentUser", () => {
    renderWithProvider(<Navigation />, {
      preloadedState: {
        user: {
          currentUser: {},
        },
      },
    });

    const signInLinkElement = screen.queryByText(/sign in/i);
    expect(signInLinkElement).toBeNull();

    const signOutLinkElement = screen.getByText(/sign out/i);
    expect(signOutLinkElement).toBeInTheDocument();
  });

  test("it should not render a cart dropdown if isCartOpen is false", () => {
    renderWithProvider(<Navigation />, {
      preloadedState: {
        cart: {
          isCartOpen: false,
          cartItems: [],
        },
      },
    });

    const dropdownTextElement = screen.queryByText(/your cart is empty/i);
    expect(dropdownTextElement).toBeNull();
  });

  test("it should render a cart dropdown if isCartOpen is true", () => {
    renderWithProvider(<Navigation />, {
      preloadedState: {
        cart: {
          isCartOpen: true,
          cartItems: [],
        },
      },
    });

    const dropdownTextElement = screen.getByText(/your cart is empty/i);
    expect(dropdownTextElement).toBeInTheDocument();
  });

  test("it should dispatch signOutStart action when clicking on the Sign Out link", async () => {
    const mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);

    renderWithProvider(<Navigation />, {
      preloadedState: {
        user: {
          currentUser: {},
        },
      },
    });

    const signOutLinkElement = screen.getByText(/sign out/i);
    expect(signOutLinkElement).toBeInTheDocument();

    await fireEvent.click(signOutLinkElement);

    expect(mockDispatch).toHaveBeenCalled();

    const signOutAction = signOutStart();
    expect(mockDispatch).toHaveBeenLastCalledWith(signOutAction);

    mockDispatch.mockClear();
  });
});
