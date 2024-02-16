import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import "./HomePage.scss";

export default function HomePage() {
  const randomId = () => Math.random().toString(36).substring(2, 10);

  return (
    <Layout>
      <div className="home__menu">
        <Link className="home__menu__link" to="/play">
          Singleplayer
        </Link>
        <Link className="home__menu__link" to={`/room/${randomId()}`}>
          Multiplayer
        </Link>
      </div>
    </Layout>
  );
}
