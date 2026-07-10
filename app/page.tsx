import type { Metadata } from "next";
import PhysicsAtlas from "./PhysicsAtlas";

export const metadata: Metadata = {
  title: "普通物理知識圖譜",
  description:
    "以 185 個可評量概念與先修關係，重組大學微積分版普通物理：從測量與力學一路探索電磁學、光學、相對論與量子。",
};

export default function Home() {
  return <PhysicsAtlas />;
}
