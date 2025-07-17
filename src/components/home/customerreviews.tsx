"use client";

import { Star } from "lucide-react";
import { useState } from "react";

const reviews = [
  {
    id: 1,
    name: "shreya1",
    message:
      "Car was well served by cars24 & finance & security team for thee support",
    rating: 5,
    date: "15 mar 2025",
    avatar:
      "https://robohash.org/61c07857b22a030c6dd42727eff0015e?set=set4&bgset=bg1&size=400x400",
  },
  {
    id: 1,
    name: "shreya2",
    message:
      "Car was well served by cars24 & finance & security team for thee support",
    rating: 4.5,
    date: "15 mar 2025",
    avatar:
      "https://robohash.org/61c07857b22a030c6dd42727eff0015e?set=set4&bgset=bg1&size=400x400",
  },
  {
    id: 1,
    name: "shreya3",
    message:
      "Car was well served by cars24 & finance & security team for thee support",
    rating: 4,
    date: "15 mar 2025",
    avatar:
      "https://robohash.org/61c07857b22a030c6dd42727eff0015e?set=set4&bgset=bg1&size=400x400",
  },
];
export default function CustomerReviews() {
  const [currentindex, setCurrentindex] = useState(0);
  const nextreview = () => {
    setCurrentindex((i) => (i + 1) % reviews.length);
  };
  const prereview = () => {
    setCurrentindex((i) => (i - 1 + reviews.length) % reviews.length);
  };
  return (
    <>
      <div className="py-12">
        <div className="bg-gray-50 rounded-2xl py-8 px-6 md:px-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              What motivates us
            </h2>
            <div className="flex items-center justify-center">
              <div className="text-4xl font-bold text-blue-600">4.5+</div>
              <div className="ml-3 text-left">
                <div className="font-medium text-gray-500">Average</div>
                <div className="text-gray-600">Online rating</div>
              </div>
            </div>
            <div className="flex mt-3 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4${
                    star <= 4
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-yellow-400"
                  }`}
                />
              ))}
            </div>
            <div className="flex mt-3 justify-center gap-6 flex-wrap">
              {reviews.map((review) => (
                <div
                  key={review.id + review.name}
                  className="bg-white rounded-xl shadow-md p-5 flex flex-col items-center w-72 transition-transform hover:scale-105"
                >
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-16 h-16 rounded-full mb-3 border-2 border-blue-100 object-cover"
                  />
                  <div className="font-semibold text-gray-900">
                    {review.name}
                  </div>
                  <div className="text-xs text-gray-400 mb-2">
                    {review.date}
                  </div>
                  <div className="text-center text-gray-700 mb-3">
                    {review.message}
                  </div>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= Math.floor(review.rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    {review.rating % 1 !== 0 && (
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 opacity-50" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
