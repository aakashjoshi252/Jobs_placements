export default function About() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">

        {/* Heading */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800">
            About Job
            <span className="text-blue-600">Placements</span>
          </h1>

          <p className="text-lg text-gray-600 mt-4">
            A powerful hiring platform built to connect{" "}
            <strong className="font-semibold text-gray-800">skilled candidates</strong> with
            <strong className="font-semibold text-gray-800"> top recruiters</strong> — quickly and effortlessly.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">Our Vision</h3>
            <p className="text-gray-600">
              To empower job seekers to build successful careers while helping companies grow
              by hiring the right talent.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">What We Do</h3>
            <p className="text-gray-600">
              We provide a smart and intuitive system for posting jobs, applying easily,
              and managing recruitment — all in one place.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">Our Commitment</h3>
            <p className="text-gray-600">
              We stand for fairness, transparency, and innovation — ensuring that every user
              gets the best hiring experience.
            </p>
          </div>

        </div>

        {/* Footer / CTA */}
        <div className="mt-16">
          <h4 className="text-2xl font-semibold text-gray-800">Start Your Journey With Us</h4>
          <p className="text-gray-600 mt-2">
            Unlock endless opportunities. Find the right job. Hire the right talent.
          </p>
        </div>

      </div>
    </section>
  );
}
