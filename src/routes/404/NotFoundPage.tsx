import { Link } from "react-router-dom";
import "./NotFoundPage.scss";

export default function NotFoundPage() {
  return (
    <div className="error-page">
      <h1 className="error-page__title">Oops!</h1>
      <p className="error-page__subtitle">
        Sorry, the page you are looking for does not exist.
      </p>
      <p className="error-page__subtitle">
        You can always go back to the{" "}
        <Link to="/" className="error-page__link">
          homepage
        </Link>
        .
      </p>
    </div>
  );
}
