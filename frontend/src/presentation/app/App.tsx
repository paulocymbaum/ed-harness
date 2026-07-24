import { BrowserRouter } from "react-router-dom";
import { ProductTourHost } from "../features/product-tour/ProductTourHost";
import { AppRouter } from "./AppRouter";

/** Vite `base` (/app/ in production) must match React Router basename. */
function routerBasename(): string | undefined {
  const base = import.meta.env.BASE_URL || "/";
  const normalized = base.replace(/\/$/, "");
  return !normalized || normalized === "/" ? undefined : normalized;
}

export function App() {
  return (
    <BrowserRouter basename={routerBasename()}>
      <ProductTourHost />
      <AppRouter />
    </BrowserRouter>
  );
}
