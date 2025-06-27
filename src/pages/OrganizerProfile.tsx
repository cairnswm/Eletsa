import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useEvents } from "../hooks/useEvents";
import { organizers as organizersData } from "../data/organizers";
import { users as usersData } from "../data/users";
import {
  Award,
  Calendar,
  Star,
  Users,
  Mail,
  Phone,
  ArrowLeft,
  Quote,
} from "lucide-react";
import { EventsGrid } from "../components/EventsGrid";
import { FollowButton } from "../components/FollowButton";

interface Organizer {
  id: number;
  name: string;
  bio: string;
  eventCount: number;
  averageRating: number;
  testimonials: number[];
  avatar?: string;
  email?: string;
  phone?: string;
}

export function OrganizerProfile() {
  const { id } = useParams<{ id: string }>();
  const { events, reviews, isPastEvent, getOrganizerTestimonials } =
    useEvents();
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [activeTab, setActiveTab] = useState<"events" | "testimonials">(
    "events"
  );
  const [showPastEvents, setShowPastEvents] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (id) {
      fetchOrganizer(id);
    }
  }, [id]);

  const fetchOrganizer = (organizerId: string) => {
    const org = organizersData.find((o: Organizer) => o.id === organizerId);
    if (org) {
      setOrganizer(org);
    }
  };

  if (!organizer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Organizer not found
          </h2>
          <Link
            to="/discover"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const organizerEvents = events.filter(
    (event) => event.organizerId === organizer.id
  );
  const upcomingEvents = organizerEvents.filter((event) => !isPastEvent(event));
  const pastEvents = organizerEvents.filter((event) => isPastEvent(event));
  const displayEvents = showPastEvents ? pastEvents : upcomingEvents;

  // Get all reviews for this organizer's events
  const organizerReviews = reviews.filter((review) =>
    organizerEvents.some((event) => event.id === review.eventId)
  );

  // Get testimonials using the new function
  const testimonials = getOrganizerTestimonials(organizer.id);

  // Get event details and reviewer names for testimonials
  const testimonialsWithDetails = testimonials
    .map((testimonial) => {
      const event = events.find((e) => e.id === testimonial.eventId);
      const reviewer = usersData.find((u) => u.id === testimonial.userId);
      return { ...testimonial, event, reviewer };
    })
    .filter((t) => t.event && t.reviewer); // Only include testimonials with valid events and reviewers

  const tabs = [
    {
      id: "events",
      label: "Events",
      count: organizerEvents.length,
      icon: Calendar,
    },
    {
      id: "testimonials",
      label: "Testimonials",
      count: testimonials.length,
      icon: Quote,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/discover"
          className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Link>

        {/* Organizer Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="bg-gradient-to-br from-purple-100 to-blue-100 p-6 md:p-8">
            {/* Mobile Layout: Image and Name in top row */}
            <div className="flex items-center space-x-4 mb-6 md:hidden">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                {organizer.avatar ? (
                  <img
                    src={organizer.avatar}
                    alt={organizer.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <Award className="h-8 w-8 text-purple-600" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {organizer.name}
                </h1>
              </div>
              <FollowButton
                targetUserId={organizer.id}
                targetUserName={organizer.name}
                size="sm"
                variant="icon"
              />
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex md:items-start md:space-x-6 md:mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                {organizer.avatar ? (
                  <img
                    src={organizer.avatar}
                    alt={organizer.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <Award className="h-12 w-12 text-purple-600" />
                )}
              </div>
                <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 me-8">
                  {organizer.name}
                  
                <FollowButton
                  targetUserId={organizer.id}
                  targetUserName={organizer.name}
                  size="sm"
                  variant="icon"
                  className="ms-4"
                />
                </h1>
                </div>
            </div>

            {/* Bio - Full width on mobile */}
            <p className="text-base md:text-lg text-gray-700 mb-6 leading-relaxed">
              {organizer.bio}
            </p>

            {/* Stats Grid - Full width */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center text-gray-700">
                <Calendar className="h-5 w-5 mr-3 text-purple-600 flex-shrink-0" />
                <div>
                  <div className="font-semibold">{organizer.eventCount}</div>
                  <div className="text-sm text-gray-600">Events Organized</div>
                </div>
              </div>

              <div className="flex items-center text-gray-700">
                <Star className="h-5 w-5 mr-3 text-amber-500 fill-current flex-shrink-0" />
                <div>
                  <div className="font-semibold">
                    {organizer.averageRating.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
              </div>

              <div className="flex items-center text-gray-700">
                <Users className="h-5 w-5 mr-3 text-purple-600 flex-shrink-0" />
                <div>
                  <div className="font-semibold">{organizerReviews.length}</div>
                  <div className="text-sm text-gray-600">Total Reviews</div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {organizer.email && (
                <div className="flex items-center text-gray-700">
                  <Mail className="h-5 w-5 mr-3 text-purple-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-medium">Email</div>
                    <a
                      href={`mailto:${organizer.email}`}
                      className="text-purple-600 hover:text-purple-700 transition-colors break-all"
                    >
                      {organizer.email}
                    </a>
                  </div>
                </div>
              )}

              {organizer.phone && (
                <div className="flex items-center text-gray-700">
                  <Phone className="h-5 w-5 mr-3 text-purple-600 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Phone</div>
                    <a
                      href={`tel:${organizer.phone}`}
                      className="text-purple-600 hover:text-purple-700 transition-colors"
                    >
                      {organizer.phone}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? "border-purple-500 text-purple-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                    {tab.count > 0 && (
                      <span
                        className={`ml-2 px-2 py-1 rounded-full text-xs ${
                          activeTab === tab.id
                            ? "bg-purple-100 text-purple-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Events Tab */}
            {activeTab === "events" && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {showPastEvents ? "Past Events" : "Upcoming Events"}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowPastEvents(false)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        !showPastEvents
                          ? "bg-purple-600 text-white"
                          : "text-gray-600 hover:text-purple-600 border border-gray-300"
                      }`}
                    >
                      Upcoming ({upcomingEvents.length})
                    </button>
                    <button
                      onClick={() => setShowPastEvents(true)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        showPastEvents
                          ? "bg-purple-600 text-white"
                          : "text-gray-600 hover:text-purple-600 border border-gray-300"
                      }`}
                    >
                      Past ({pastEvents.length})
                    </button>
                  </div>
                </div>

                <EventsGrid
                  events={showPastEvents ? pastEvents : upcomingEvents}
                />
              </div>
            )}

            {/* Testimonials Tab */}
            {activeTab === "testimonials" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Featured Testimonials
                  </h2>
                  <p className="text-gray-600">
                    Reviews that {organizer.name} has chosen to highlight from
                    their events
                  </p>
                </div>

                {testimonialsWithDetails.length > 0 ? (
                  <div className="space-y-6">
                    {testimonialsWithDetails
                      .sort(
                        (a, b) =>
                          new Date(b.date).getTime() -
                          new Date(a.date).getTime()
                      )
                      .map((testimonial) => (
                        <div
                          key={testimonial.id}
                          className="bg-gray-50 rounded-xl p-6 border border-gray-200"
                        >
                          {/* Review Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                                <User className="h-6 w-6 text-purple-600" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  {testimonial.reviewer.name}
                                </div>
                                <div className="text-sm text-gray-600 capitalize">
                                  {testimonial.reviewer.role}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {testimonial.date}
                                </div>
                              </div>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-5 w-5 ${
                                    star <= testimonial.rating
                                      ? "text-amber-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                              <span className="ml-2 font-medium text-gray-900">
                                {testimonial.rating}/5
                              </span>
                            </div>
                          </div>

                          {/* Review Content */}
                          <blockquote className="text-gray-700 leading-relaxed mb-4 italic">
                            "{testimonial.comment}"
                          </blockquote>

                          {/* Event Reference */}
                          <div className="border-t border-gray-200 pt-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm text-gray-600">
                                  Review for:
                                </div>
                                <Link
                                  to={`/event/${testimonial.event.id}`}
                                  className="font-medium text-purple-600 hover:text-purple-700 transition-colors"
                                >
                                  {testimonial.event.title}
                                </Link>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-600">
                                  Event Date:
                                </div>
                                <div className="text-sm font-medium text-gray-900">
                                  {new Date(
                                    testimonial.event.date
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Quote className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No testimonials yet
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      {organizer.name} hasn't featured any testimonials yet.
                      Check back later to see what attendees are saying about
                      their events!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Content (only show on Events tab) */}
        {activeTab === "events" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-3">
              {/* Content is already shown above in the tabs */}
            </div>
          </div>
        )}

        {/* Sidebar for additional info (when on events tab) */}
        {activeTab === "events" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
            <div className="lg:col-span-3">
              {/* Events content is handled above */}
            </div>

            <div className="space-y-6">
              {/* Rating Breakdown */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Rating Breakdown
                </h3>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = organizer.eventRatings.filter(
                      (r) => r === rating
                    ).length;
                    const percentage =
                      organizer.eventRatings.length > 0
                        ? (count / organizer.eventRatings.length) * 100
                        : 0;

                    return (
                      <div key={rating} className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1 w-12">
                          <span className="text-sm font-medium">{rating}</span>
                          <Star className="h-3 w-3 text-amber-400 fill-current" />
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-amber-400 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-8">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Events</span>
                    <span className="font-semibold">
                      {organizer.eventCount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Upcoming Events</span>
                    <span className="font-semibold">
                      {upcomingEvents.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Past Events</span>
                    <span className="font-semibold">{pastEvents.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Reviews</span>
                    <span className="font-semibold">
                      {organizerReviews.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Featured Testimonials</span>
                    <span className="font-semibold">{testimonials.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Average Rating</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-amber-400 fill-current" />
                      <span className="font-semibold">
                        {organizer.averageRating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
