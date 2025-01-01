import React from 'react';

export function TestimonialsSection() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-sage-900 sm:text-4xl">
            Loved by Professionals
          </h2>
          <p className="mt-6 text-lg leading-8 text-sage-600">
            See how others are advancing their careers with our platform.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm leading-6 text-sage-900 sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-cols-3">
          {[
            {
              name: 'Sarah Chen',
              role: 'Software Engineer',
              imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
              quote: "This tool has transformed how I track my achievements. It's made performance reviews a breeze!",
            },
            {
              name: 'Marcus Rodriguez',
              role: 'Product Manager',
              imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
              quote: "I can finally show my impact with real data. It's helped me secure promotions and negotiate raises.",
            },
            {
              name: 'Emily Taylor',
              role: 'UX Designer',
              imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
              quote: "The best career development tool I've used. It keeps me focused on my goals and growth.",
            },
          ].map((testimonial) => (
            <div
              key={testimonial.name}
              className="rounded-2xl bg-sage-50 p-10 ring-1 ring-inset ring-sage-200"
            >
              <figure className="h-full flex flex-col justify-between">
                <blockquote className="text-lg font-semibold leading-8 text-sage-900">
                  <p>"{testimonial.quote}"</p>
                </blockquote>
                <figcaption className="mt-10 flex items-center gap-x-6">
                  <img
                    className="h-12 w-12 rounded-full bg-sage-50"
                    src={testimonial.imageUrl}
                    alt=""
                  />
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sage-600">{testimonial.role}</div>
                  </div>
                </figcaption>
              </figure>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}