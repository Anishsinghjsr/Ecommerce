import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetails";
import Nabvar from './components/Navbar';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PrivateRouter from './components/PrivateRouter';

function App() {
  return (
    <Router>
      <Nabvar/>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage/>}/>
        <Route element={<PrivateRouter/>}>
                    <Route path="/checkout" element={<CheckoutPage/>}/>
                </Route>
                <Route path="/login" element={<Login/>} />
                <Route path="/signup" element={<Signup/>} />
      </Routes>
    </Router>
  );
}

export default App;