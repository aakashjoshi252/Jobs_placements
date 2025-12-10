export default function Contact() {
    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-6xl mx-auto px-6">

                {/* Heading */}
                <h1 className="text-4xl font-bold text-center text-gray-800">Contact Us</h1>
                <p className="text-center text-gray-600 mt-2">
                    Have questions or need assistance? We’d love to hear from you!
                </p>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12">

                    {/* ===== Left: Form ===== */}
                    <form className="bg-white p-6 rounded-xl shadow space-y-4">

                        <div>
                            <label htmlFor="name" className="block text-gray-700 font-medium">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                placeholder="Enter your name"
                                required
                                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-gray-700 font-medium">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter your email"
                                required
                                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-gray-700 font-medium">
                                Message
                            </label>
                            <textarea
                                id="message"
                                rows="5"
                                placeholder="Write your message..."
                                required
                                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                            Send Message
                        </button>
                    </form>

                    {/* ===== Right: Info Section ===== */}
                    <div className="space-y-4">

                        <h3 className="text-2xl font-semibold text-gray-800">Get in Touch</h3>

                        <p className="text-gray-700">
                            <strong className="text-gray-900">Address:</strong> 123 JobPlacements Lane, Tech City, India
                        </p>
                        <p className="text-gray-700">
                            <strong className="text-gray-900">Email:</strong> support@jobplacements.com
                        </p>
                        <p className="text-gray-700">
                            <strong className="text-gray-900">Phone:</strong> +91 98765 43210
                        </p>

                        <h4 className="text-xl font-semibold text-gray-800 mt-6">Follow Us</h4>

                        <div className="flex space-x-4 mt-3">
                            <a href="#" className="text-blue-600 hover:text-blue-800 text-xl">
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href="#" className="text-blue-400 hover:text-blue-600 text-xl">
                                <i className="fab fa-twitter"></i>
                            </a>
                            <a href="#" className="text-blue-700 hover:text-blue-900 text-xl">
                                <i className="fab fa-linkedin-in"></i>
                            </a>
                            <a href="#" className="text-pink-600 hover:text-pink-800 text-xl">
                                <i className="fab fa-instagram"></i>
                            </a>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}
