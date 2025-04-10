import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> extends jest.Matchers<R> {
      toBeInTheDocument(): R;
      toHaveClass(className: string): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveTextContent(text: string | RegExp): R;
    }
  }
} 