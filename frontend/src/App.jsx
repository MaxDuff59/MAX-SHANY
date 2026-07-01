import React, { useEffect, useState } from "react";
import LoadingPage from "./components/LoadingPage.jsx";
import CoursesPanel from "./components/CoursesPanel.jsx";
import TodoPanel from "./components/TodoPanel.jsx";
import BottomNav from "./components/BottomNav.jsx";
import useIsMobile from "./hooks/useIsMobile.js";
import "./App.css";

const LOADING_DURATION_MS = 1800;

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("courses");
  const isMobile = useIsMobile();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), LOADING_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }

  // ---- Téléphone : deux pages séparées + barre de navigation en bas ----
  if (isMobile) {
    return (
      <div className="board board--mobile">
        <header className="board__header">
          <h1>
            Max <span className="board__amp">&amp;</span> Shany
          </h1>
        </header>
        <main className="board__main board__main--mobile">
          {activeTab === "courses" ? <CoursesPanel /> : <TodoPanel />}
        </main>
        <BottomNav active={activeTab} onChange={setActiveTab} />
      </div>
    );
  }

  // ---- Ordinateur / tablette : les deux listes côte à côte ----
  return (
    <div className="board">
      <header className="board__header">
        <h1>
          Max <span className="board__amp">&amp;</span> Shany
        </h1>
      </header>
      <main className="board__main">
        <CoursesPanel />
        <div className="board__divider" aria-hidden="true"></div>
        <TodoPanel />
      </main>
    </div>
  );
}
