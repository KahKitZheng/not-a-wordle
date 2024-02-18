import { NavLink } from "react-router-dom";
import { GameContextProvider } from "../../contexts/GameContext";
import "./layout.scss";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <header className="logo-wrapper">
        <NavLink className="logo" to="/">
          Wordle clone
        </NavLink>
      </header>
      <main className="game-wrapper">
        <GameContextProvider>{children}</GameContextProvider>
      </main>
    </>
  );
}
