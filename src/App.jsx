import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./v5/components/Layout";
import Home from "./v5/pages/Home";
import HomeV3 from "./v5/pages/HomeV3";
import ProductBiomeBalance from "./v5/pages/ProductBiomeBalance";
import Evidence from "./v5/pages/Evidence";
import Science from "./v5/pages/Science";
import CaseStudies from "./v5/pages/CaseStudies";
import About from "./v5/pages/About";
import Journal from "./v5/pages/Journal";
import JournalPost from "./v5/pages/JournalPost";
import Contact from "./v5/pages/Contact";
import Club from "./v5/pages/Club";
import Quiz from "./v5/pages/Quiz";
import CartPage from "./v5/pages/CartPage";
import Account from "./v5/pages/Account";
import Careers from "./v5/pages/Careers";
import Checkout from "./v5/pages/Checkout";
import OrderConfirmation from "./v5/pages/OrderConfirmation";
import PaymentSuccess from "./v5/pages/PaymentSuccess";
import PaymentFailure from "./v5/pages/PaymentFailure";
import OrderRedirect from "./v5/pages/OrderRedirect";
import PrivacyPolicy from "./v5/pages/PrivacyPolicy";
import TermsOfService from "./v5/pages/TermsOfService";
import NotFound from "./v5/pages/NotFound";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* v5 is the primary site; v3 kept as a supporting variant at /home-v3 */}
        <Route path="/" element={<Home />} />
        <Route path="/home-v5" element={<Home />} />
        <Route path="/home-v3" element={<HomeV3 />} />
        <Route path="/products/biome-balance" element={<ProductBiomeBalance />} />
        {/* legacy paths from the live site keep resolving */}
        <Route path="/products" element={<Navigate to="/products/biome-balance" replace />} />
        <Route path="/products/:categorySlug" element={<Navigate to="/products/biome-balance" replace />} />
        <Route path="/shop" element={<Navigate to="/products/biome-balance" replace />} />
        <Route path="/science" element={<Science />} />
        <Route path="/blogs" element={<Navigate to="/journal" replace />} />
        <Route path="/faq" element={<Navigate to="/#faq" replace />} />
        <Route path="/gut-scoring/interactive-quiz" element={<Navigate to="/quiz" replace />} />

        <Route path="/evidence" element={<Evidence />} />
        <Route path="/case-studies" element={<CaseStudies />} />
        <Route path="/about" element={<About />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/journal/:slug" element={<JournalPost />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/t3b-club" element={<Club />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/account" element={<Account />} />
        <Route path="/careers" element={<Careers />} />

        {/* commerce */}
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderRedirect />} />
        <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmation />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/failure" element={<PaymentFailure />} />

        {/* legal */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
