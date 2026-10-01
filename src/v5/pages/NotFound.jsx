import { Link } from "react-router-dom";
import Seo from "../components/Seo";

export default function NotFound() {
  return (
    <>
      <Seo
        title="Page not found"
        description="This page doesn't exist. Head back to Third Biome to explore Biome Balance, our precision postbiotic for gut health."
      />
      <section className="sheet v5-page" data-screen-label="404">
      <div className="wrap">
        <span className="eyebrow">404</span>
        <h1>Lost in the microbiome.</h1>
        <p>The page you're looking for doesn't exist, but your gut still does.</p>
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: "26px",
          }}
        >
          <Link className="btn btn--dark" to="/">
            Back home
          </Link>
          <Link className="btn btn--ghost" to="/products/biome-balance">
            Shop Biome Balance
          </Link>
        </div>
      </div>
      </section>
    </>
  );
}
