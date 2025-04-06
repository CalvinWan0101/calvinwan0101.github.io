import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router";
import { Home } from "../apps/home";

const router = createBrowserRouter(createRoutesFromElements(
  <Route path="/" element={<Home />} />
));

export const PageRouter = () => {
  return <RouterProvider router={router} />;
}