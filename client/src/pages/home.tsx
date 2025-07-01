import Navigation from "@/components/navigation";
import Hero from "@/components/hero";
import Services from "@/components/services";
import About from "@/components/about";
import GearHQ from "@/components/gear-hq";
import TwitterFeed from "@/components/twitter-feed";
import Contact from "@/components/contact";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-dark-primary text-white">
      <Navigation />
      <Hero />
      <Services />
      <About />
      <GearHQ />
      <TwitterFeed />
      <Contact />
      <Footer />
    </div>
  );
}
