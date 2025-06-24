import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, MapPin, Users, Star } from 'lucide-react';

export function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Never be{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-600">
                bored
              </span>{' '}
              again
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover amazing events happening in your city and connect with like-minded people. 
              Eletsa invites you to explore unforgettable experiences.
            </p>
            <Link
              to="/discover"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-pink-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Explore Events
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Eletsa?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We make it easy to discover, book, and enjoy amazing experiences in your area.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-200">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Curated Events</h3>
              <p className="text-gray-600">
                Handpicked events from trusted organizers, ensuring quality experiences every time.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-200 transition-all duration-200">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Local Focus</h3>
              <p className="text-gray-600">
                Discover amazing events happening right in your neighborhood and across South Africa.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 transition-all duration-200">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Community Driven</h3>
              <p className="text-gray-600">
                Connect with like-minded people and build lasting friendships through shared experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-pink-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-blue-100">Events Monthly</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">10K+</div>
              <div className="text-blue-100">Happy Attendees</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-blue-100">Event Organizers</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">4.8</div>
              <div className="text-blue-100 flex items-center justify-center">
                <Star className="h-4 w-4 fill-current mr-1" />
                Average Rating
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to start your adventure?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of people who have already discovered their next favorite experience with Eletsa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/discover"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-pink-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105"
            >
              Browse Events
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-200"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}