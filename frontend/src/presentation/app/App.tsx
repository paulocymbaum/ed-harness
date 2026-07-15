import { BrowserRouter } from "react-router-dom";
import { ProductTourHost } from "../features/product-tour/ProductTourHost";
import { AppRouter } from "./AppRouter";

export function App() {
  // Vite `base` (e.g. `/app/` in production) must match the router basename
  const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || undefined;

  return (
    <BrowserRouter basename={basename}>
      <ProductTourHost />
      <AppRouter />
    </BrowserRouter>
  );
}
