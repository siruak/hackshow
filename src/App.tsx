import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import ProjectDetail from "./pages/ProjectDetail";
import Submit from "./pages/Submit";
import Admin from "./pages/Admin";
import Slideshow from "./pages/Slideshow";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/submit" element={<Submit />} />
        <Route path="/admin" element={<Admin />} />
      </Route>
      <Route path="/slideshow" element={<Slideshow />} />
    </Routes>
  );
}
