import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import "./HomePage.scss";

export default function HomePage() {
  return (
    <Layout>
      <div className="home__menu">
        <Link className="home__menu__link" to="/play">
          Singleplayer
        </Link>
        <Link className="home__menu__link" to="/create-room">
          Multiplayer
        </Link>
      </div>
    </Layout>
  );
}
