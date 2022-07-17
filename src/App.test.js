import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";

describe("App component", () => {
  it("renders without error", () => {
    render(<App />);

    const fileInput = screen.getByTestId("file-input");
    expect(fileInput).toBeInTheDocument();

    const emailInput = screen.getByTestId("email-input");
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).not.toBeChecked();

    const phoneInput = screen.getByTestId("phone-input");
    expect(phoneInput).toBeInTheDocument();
    expect(phoneInput).not.toBeChecked();

    const submitButton = screen.getByTestId("submit-button");
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it("enables submit button when file and filter type is selected", () => {
    let mockCsv = new File([""], "mockFile.csv", { type: "text/csv" });
    render(<App />);
    const submitButton = screen.getByTestId("submit-button");
    const emailInput = screen.getByTestId("email-input");
    const fileInput = screen.getByTestId("file-input");

    fireEvent.change(fileInput, { target: { files: [mockCsv] } });
    expect(fileInput.files[0]).toBe(mockCsv);
    expect(fileInput.files[0].type).toBe("text/csv");

    expect(submitButton).toBeDisabled();
    fireEvent.click(emailInput);
    expect(emailInput).toBeChecked();
    expect(submitButton).toBeEnabled();
  });

  it("filters out by email", async () => {
    const csvData = `Luffy,MonkeyD,captain@sunny.com,1112223333
    Luffy,MonkeyD,pirate@sunny.com,1112223333
    Sanji,Vinsmoke,pirate@sunny.com,9990008888`;
    jest.spyOn(global, "File").mockImplementation(function () {
      this.text = () => csvData;
    });
    let mockCsvFile = new File([csvData], "mockFile.csv", { type: "text/csv" });

    const expectedString = `Luffy,MonkeyD,captain@sunny.com,1112223333
    Luffy,MonkeyD,pirate@sunny.com,1112223333`;
    const newCsvFile = encodeURI(
      "data:text/csv;charset=utf-8," + expectedString
    );

    render(<App />);
    const fileInput = screen.getByTestId("file-input");
    const emailInput = screen.getByTestId("email-input");
    const submitButton = screen.getByTestId("submit-button");
    const windowSpy = jest.spyOn(window, "open");
    windowSpy.mockImplementation(jest.fn());

    fireEvent.change(fileInput, { target: { files: [mockCsvFile] } });
    fireEvent.click(emailInput);
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(windowSpy).toHaveBeenCalledWith(newCsvFile);
    });
  });

  it("filters out by phone number", async () => {
    const csvData = `Luffy,MonkeyD,captain@sunny.com,1112223333
    Luffy,MonkeyD,pirate@sunny.com,1112223333
    Sanji,Vinsmoke,pirate@sunny.com,9990008888`;
    jest.spyOn(global, "File").mockImplementation(function () {
      this.text = () => csvData;
    });
    let mockCsvFile = new File([csvData], "mockFile.csv", { type: "text/csv" });

    const expectedString = `Luffy,MonkeyD,captain@sunny.com,1112223333
    Sanji,Vinsmoke,pirate@sunny.com,9990008888`;
    const newCsvFile = encodeURI(
      "data:text/csv;charset=utf-8," + expectedString
    );

    render(<App />);
    const fileInput = screen.getByTestId("file-input");
    const phoneInput = screen.getByTestId("phone-input");
    const submitButton = screen.getByTestId("submit-button");
    const windowSpy = jest.spyOn(window, "open");
    windowSpy.mockImplementation(jest.fn());

    fireEvent.change(fileInput, { target: { files: [mockCsvFile] } });
    fireEvent.click(phoneInput);
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(windowSpy).toHaveBeenCalledWith(newCsvFile);
    });
  });

  it("filters out by email and phone number", async () => {
    const csvData = `Luffy,MonkeyD,captain@sunny.com,1112223333
    Luffy,MonkeyD,pirate@sunny.com,1112223333
    Sanji,Vinsmoke,pirate@sunny.com,9990008888
    Chopper,TonyTony,pirate@sunny.com,2223334444`;
    jest.spyOn(global, "File").mockImplementation(function () {
      this.text = () => csvData;
    });
    let mockCsvFile = new File([csvData], "mockFile.csv", { type: "text/csv" });

    const expectedString = `Luffy,MonkeyD,captain@sunny.com,1112223333
    Sanji,Vinsmoke,pirate@sunny.com,9990008888`;
    const newCsvFile = encodeURI(
      "data:text/csv;charset=utf-8," + expectedString
    );

    render(<App />);
    const fileInput = screen.getByTestId("file-input");
    const phoneInput = screen.getByTestId("phone-input");
    const emailInput = screen.getByTestId("email-input");
    const submitButton = screen.getByTestId("submit-button");
    const windowSpy = jest.spyOn(window, "open");
    windowSpy.mockImplementation(jest.fn());

    fireEvent.change(fileInput, { target: { files: [mockCsvFile] } });
    fireEvent.click(emailInput);
    fireEvent.click(phoneInput);
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(windowSpy).toHaveBeenCalledWith(newCsvFile);
    });
  });

  it("does not filter out blank entries as duplicates", async () => {
    const csvData = `Luffy,MonkeyD,captain@sunny.com,1112223333
    Luffy,MonkeyD,,
    Sanji,Vinsmoke,,9990008888
    Chopper,TonyTony,pirate@sunny.com,`;
    jest.spyOn(global, "File").mockImplementation(function () {
      this.text = () => csvData;
    });
    let mockCsvFile = new File([csvData], "mockFile.csv", { type: "text/csv" });

    const expectedString = csvData;
    const newCsvFile = encodeURI(
      "data:text/csv;charset=utf-8," + expectedString
    );

    render(<App />);
    const fileInput = screen.getByTestId("file-input");
    const phoneInput = screen.getByTestId("phone-input");
    const emailInput = screen.getByTestId("email-input");
    const submitButton = screen.getByTestId("submit-button");
    const windowSpy = jest.spyOn(window, "open");
    windowSpy.mockImplementation(jest.fn());

    fireEvent.change(fileInput, { target: { files: [mockCsvFile] } });
    fireEvent.click(emailInput);
    fireEvent.click(phoneInput);
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(windowSpy).toHaveBeenCalledWith(newCsvFile);
    });
  });
});
