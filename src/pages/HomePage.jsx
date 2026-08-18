import Hero from "../components/Hero";
import NewsCard from "../components/NewsCard";
import Newsletter from "../components/Newsletter";
import { featuredStory, latestStories } from "../data/articles";


function HomePage() {
  return (
    <main id="main">
      <Hero story={featuredStory} />

      <section className="block">
        <div className="container">
          <div className="section-head">
            <h3>Latest Stories</h3>
            <span className="count">6 of 142 today</span>
          </div>
          <div className="grid">
            {latestStories.map((story) => (
              <NewsCard key={story.id} story={story} />
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </main>
  );
}

export default HomePage;
