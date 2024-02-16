import Layout from "../../components/Layout";
import { Link } from "react-router-dom";
import { randomId } from "../../utils";
import "./HomePage.scss";

export default function HomePage() {
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
