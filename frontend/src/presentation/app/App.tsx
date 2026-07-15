import { BrowserRouter } from "react-router-dom";
import { ProductTourHost } from "../features/product-tour/ProductTourHost";
import { AppRouter } from "./AppRouter";

export function App() {
  return (
    <BrowserRouter>
      <ProductTourHost />
      <AppRouter />
    </BrowserRouter>
  );
}
