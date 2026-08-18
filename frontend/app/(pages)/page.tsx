import Hero from "../components/hero";
import Testimonials from "../components/testimonials";
import FAQ from "../components/faq";
import Footer from "../components/footer";
import Collections from "../components/collections";
import Products from "../components/products/products";
import About from "../components/about";
import CTA from "../components/cta";

import { getHeroBanner } from "@/actions/hero-banner.actions";

const HomePage = async () => {
  const heroBanner = await getHeroBanner();

  return (
      <main>
        <Hero heroBanner={heroBanner} />
        <Collections />
        <Products />
        <About />
        <Testimonials />
        <FAQ />
      </main>
  );
};

export default HomePage;