import { render, screen } from '@testing-library/react';
import Home from '../Home';
import { BrowserRouter } from 'react-router-dom';
import UserContext from '../../../UserContext';
import { CartProvider } from '../../ShoppingCart/CartContext';

const MockHome = () => {
  return (
    <UserContext.Provider value={{ user: null, setUser: () => {}, isLoggedIn: false, setIsLoggedIn: () => {} }}>
      <CartProvider>
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      </CartProvider>
    </UserContext.Provider>
  );
};

test('should render Heading in home component', () => {
  render(<MockHome />);
  const heading = screen.getByRole('heading', { level: 3 });
  expect(heading).toBeInTheDocument();
});

test('should render button in Home component', () => {
  render(<MockHome />);
  const button = screen.getByTestId('btn');
  expect(button).toBeInTheDocument();
});

test('should render social media images', () => {
  render(<MockHome />);
  const images = screen.getByTestId('images');
  expect(images).toBeInTheDocument();
});