import { createRoot } from "react-dom/client";
import "katex/dist/katex.min.css";
import "../app/globals.css";
import PhysicsAtlas from "../app/PhysicsAtlas";

const root = document.getElementById("root");

if (!root) {
  throw new Error("找不到網頁根節點");
}

createRoot(root).render(<PhysicsAtlas />);
