import React from "react";

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import "@testing-library/jest-dom"; // for matchers like toBeInTheDocument
import App from "./App";
import * as api from "./services/api";

vi.mock("./services/api");

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe("App Component", () => {
  test("renders the initial UI correctly", () => {
    render(<App />);

    expect(
      screen.getByPlaceholderText(/e\.g\. eggs, spinach/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /get calorie breakdown/i })
    ).toBeDisabled();
    expect(screen.getByText(/no stored meal/i)).toBeInTheDocument();
  });

  test("enables button when input is non-empty", () => {
    render(<App />);

    const input = screen.getByPlaceholderText(/e\.g\. eggs, spinach/i);
    const button = screen.getByRole("button", {
      name: /get calorie breakdown/i,
    });

    fireEvent.change(input, { target: { value: "apple" } });
    expect(button).toBeEnabled();

    fireEvent.change(input, { target: { value: " " } });
    expect(button).toBeDisabled();
  });

  // test("fetches calories and adds new item", async () => {
  //   api.fetchCalories.mockResolvedValueOnce({ calories: { kcal: 95 } });

  //   render(<App />);

  //   const input = screen.getByPlaceholderText(/e\.g\. eggs, spinach/i);
  //   const button = screen.getByRole("button", {
  //     name: /get calorie breakdown/i,
  //   });

  //   fireEvent.change(input, { target: { value: "apple" } });
  //   fireEvent.click(button);

  //   expect(button).toBeDisabled(); // loading state disables button

  //   // Wait for the new calorie result to appear
  //   await waitFor(() => {
  //     expect(screen.getByText(/apple/i)).toBeInTheDocument();
  //     expect(screen.getByText(/calories.*95/i)).toBeInTheDocument();
  //   });

  //   // Input should be cleared
  //   expect(input).toHaveValue("");
  // });

  test("shows error message on API failure", async () => {
    api.fetchCalories.mockRejectedValueOnce(new Error("API failed"));

    render(<App />);

    const input = screen.getByPlaceholderText(/e\.g\. eggs, spinach/i);
    const button = screen.getByRole("button", {
      name: /get calorie breakdown/i,
    });

    fireEvent.change(input, { target: { value: "unknown food" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/⚠️\s*api failed/i)).toBeInTheDocument();
    });
  });

  test("toggles item expansion", async () => {
    api.fetchCalories.mockResolvedValueOnce({ calories: { kcal: 50 } });

    render(<App />);

    const input = screen.getByPlaceholderText(/e\.g\. eggs, spinach/i);
    const button = screen.getByRole("button", {
      name: /get calorie breakdown/i,
    });

    fireEvent.change(input, { target: { value: "banana" } });
    fireEvent.click(button);

    await waitFor(() => screen.getByText(/banana/i));

    const toggleBtn = screen.getByText(/hide/i);
    expect(toggleBtn).toBeInTheDocument();

    fireEvent.click(toggleBtn);

    // After toggle, button text changes to "Expand"
    expect(screen.getByText(/expand/i)).toBeInTheDocument();
  });

  test("removes item when delete is clicked", async () => {
    api.fetchCalories.mockResolvedValueOnce({ calories: { kcal: 70 } });

    render(<App />);

    const input = screen.getByPlaceholderText(/e\.g\. eggs, spinach/i);
    const button = screen.getByRole("button", {
      name: /get calorie breakdown/i,
    });

    fireEvent.change(input, { target: { value: "orange" } });
    fireEvent.click(button);

    await waitFor(() => screen.getByText(/orange/i));

    const deleteBtn = screen.getByText(/delete/i);
    fireEvent.click(deleteBtn);

    // The item should be removed from UI
    await waitFor(() => {
      expect(screen.queryByText(/orange/i)).not.toBeInTheDocument();
    });
  });

  test("filters items based on search input", async () => {
    api.fetchCalories.mockResolvedValue({ calories: { kcal: 40 } });

    render(<App />);

    // Add two items
    const input = screen.getByPlaceholderText(/e\.g\. eggs, spinach/i);
    const button = screen.getByRole("button", {
      name: /get calorie breakdown/i,
    });

    fireEvent.change(input, { target: { value: "rice" } });
    fireEvent.click(button);
    await waitFor(() => screen.getByText(/rice/i));

    fireEvent.change(input, { target: { value: "beans" } });
    fireEvent.click(button);
    await waitFor(() => screen.getByText(/beans/i));

    // Type in search bar to filter
    const searchInput =
      screen.getByRole("textbox", { name: /search/i }) ||
      screen.getByPlaceholderText(/search/i);

    fireEvent.change(searchInput, { target: { value: "ric" } });

    expect(screen.getByText(/rice/i)).toBeInTheDocument();
    expect(screen.queryByText(/beans/i)).not.toBeInTheDocument();
  });
});
