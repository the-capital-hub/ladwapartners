import React, { useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Star, User, ChevronDown, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ReviewAndRatings = ({ reviews = [] }) => {
  const [selectedRating, setSelectedRating] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showRatingFilter, setShowRatingFilter] = useState(true);
  const [showTopicFilter, setShowTopicFilter] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const totalReviews = reviews.length;
  const overallRating = totalReviews
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : 0;

  const ratingBreakdown = [5, 4, 3, 2, 1].map(stars => {
    const count = reviews.filter(r => r.rating === stars).length;
    const percentage = totalReviews ? Math.round((count / totalReviews) * 100) : 0;
    return { stars, count, percentage };
  });

  const filterTabs = [
    { id: 'all', label: 'All Reviews' },
    { id: 'photos', label: 'With Photo & Video' },
    { id: 'description', label: 'With Description' },
    { id: 'your', label: 'Write Your Review' }
  ];

  const ratingOptions = [
    { value: 'all', label: 'All', count: null },
    ...ratingBreakdown.map(r => ({
      value: String(r.stars),
      label: String(r.stars),
      count: r.count
    }))
  ];

  const reviewTopics = [
    { id: 'quality', label: 'Product Quality', checked: false },
    { id: 'service', label: 'Seller Services', checked: false },
    { id: 'price', label: 'Product Price', checked: false },
    { id: 'shipment', label: 'Shipment', checked: false },
    { id: 'description', label: 'Match with Description', checked: false }
  ];

  const renderStars = (rating, size = 'w-4 h-4') => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`${size} ${index < rating ? 'fill-orange-400 text-orange-400' : 'text-gray-300'
          }`}
      />
    ));
  };

  const handleTopicChange = (topicId) => {
    setSelectedTopic(prev =>
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto p-4 md:p-6 bg-white min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.Card
        className="shadow-lg"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <CardContent className="p-0">
          {/* Header */}
          <motion.div
            className="bg-white md:p-1 p-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Product Reviews</h1>
          </motion.div>

          {/* Rating Summary Section with Border */}
          <motion.div
            className="border-2 border-dotted border-gray-200  my-4 md:my-6 rounded-lg p-4 md:p-6 bg-white"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex flex-col md:flex-row items-center md:space-x-8 space-y-6 md:space-y-0">
              {/* Circular Rating with Progress */}
              <motion.div
                className="text-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 200 }}
              >
                <div className="relative w-40 h-40 mx-auto mb-2">
                  {/* Background circle */}
                  <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="none"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#f97316"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray="251.2 251.2"
                      initial={{ strokeDashoffset: 251.2 }}
                      animate={{ strokeDashoffset: 251.2 - ((overallRating / 5) * 251.2) }}
                      transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                    />
                  </svg>
                  {/* Rating text */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.8 }}
                  >
                    <span className="text-2xl font-bold text-orange-600">{overallRating}</span>
                  </motion.div>
                </div>
                <motion.p
                  className="text-sm text-gray-600"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.9 }}
                >
                  from {totalReviews.toLocaleString()} reviews
                </motion.p>
              </motion.div>

              {/* Rating Breakdown Bars */}
              <div className="flex-1 space-y-3 w-full">
                {ratingBreakdown.map((item, index) => (
                  <motion.div
                    key={item.stars}
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 + (index * 0.1) }}
                  >
                    <span className="text-sm font-medium w-6">{item.stars}.0</span>
                    <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="bg-gray-800 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ duration: 0.8, delay: 0.7 + (index * 0.1), ease: "easeOut" }}
                      />
                    </div>
                    <motion.span
                      className="text-sm text-gray-600 w-12 text-right"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 1 + (index * 0.1) }}
                    >
                      {item.count}
                    </motion.span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="flex flex-col lg:flex-row">
            {/* Left Sidebar - Filters */}
            <motion.div
              className="w-full lg:w-1/4 bg-white border-2 rounded-xl border-dotted border-gray-200 p-4 md:p-6 "
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {/* Rating Filter */}
              <div className=' '>
                <div
                  className="flex items-center justify-between w-full mb-3"
                >
                  <span className="font-medium text-gray-900">Reviews Filter</span>
                </div>

                {showRatingFilter && (
                  <div className="space-y-2 mb-8 ">
                    <button onClick={() => setShowRatingFilter(!showRatingFilter)} 
                    className="font-medium flex  w-full items-center justify-between text-gray-700 mb-2">Rating
                      {showRatingFilter ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>

                    {ratingOptions.map((option) => (
                      <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedRating === option.value}
                          onChange={() => setSelectedRating(option.value)}
                          className="rounded border-gray-300"
                        />
                        <span className="flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-orange-400 text-orange-400" />
                          <span className="text-sm">{option.label}</span>
                          {option.count !== null && (
                            <span className="text-xs text-gray-500">({option.count})</span>
                          )}
                        </span>
                      </label>
                    ))}
                  <div className='border-b-2 border-gray-200 border-dotted mt-4'></div>
                  </div>
                )}
              {/* Review Topics Filter */}
              <div>
                <button
                  className="flex items-center justify-between w-full mb-3"
                  onClick={() => setShowTopicFilter(!showTopicFilter)}
                >
                  <span className="font-medium text-gray-900">Review Topics</span>
                  {showTopicFilter ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>

                {showTopicFilter && (
                  <div className="space-y-2">
                    {reviewTopics.map((topic) => (
                      <label key={topic.id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedTopic.includes(topic.id)}
                          onChange={() => handleTopicChange(topic.id)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-700">{topic.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              </div>

            </motion.div>

            {/* Right Content - Reviews */}
            <motion.div
              className="flex-1 bg-white px-3"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {/* Filter Tabs */}
              <div className="border-b-2 border-gray-200 border-dotted">
                <div className="p-4 md:p-6 pb-0">
                  <h2 className="text-lg font-semibold mb-4">Review Lists</h2>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {filterTabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-3 md:px-4 py-2 text-xs md:text-sm font-medium rounded-md transition-colors ${activeTab === tab.id
                          ? 'bg-gray-800 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="p-4 md:p-6 border-b-2 border-gray-200 border-dotted">
                <div className="space-y-6">
                  {reviews.map((review, index) => (
                    <motion.div
                      key={review.id}
                      className="border-b-2 border-dotted border-gray-200 pb-6 last:border-b-0"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.8 + (index * 0.2) }}
                    >
                      <div className="flex items-center space-x-1 mb-3">
                        {renderStars(review.rating)}
                      </div>

                      <p className="text-gray-900 mb-3 font-medium text-sm md:text-base">
                        {review.comment}
                      </p>

                      <div className="text-xs text-gray-500 mb-4">
                        {new Date(review.createdAt).toLocaleString()}
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {review.user?.firstName} {review.user?.lastName}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
              </div>
                <div className="flex items-center justify-center space-x-2 mt-8">
                  <button
                    className={`w-8 h-8 rounded flex items-center justify-center text-sm ${currentPage === 1
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    1
                  </button>
                  <button className="w-8 h-8 rounded flex items-center justify-center text-sm bg-gray-100 text-gray-600 hover:bg-gray-200">
                    2
                  </button>
                  <span className="text-gray-400">...</span>
                  <button className="w-8 h-8 rounded flex items-center justify-center text-sm bg-gray-100 text-gray-600 hover:bg-gray-200">
                    10
                  </button>
                  <button className="w-8 h-8 rounded flex items-center justify-center text-sm bg-gray-100 text-gray-600 hover:bg-gray-200">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
            </motion.div>
          </div>
        </CardContent>
      </motion.Card>
    </motion.div>
  );
};

export default ReviewAndRatings;