import React from 'react';

// Define the interface for service card data
interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  link: string;
}

// Sample service data (replace with actual data source or props)
const services: Service[] = [
  {
    id: 1,
    title: 'Buy Used Cars',
    description: 'Browse thousands of quality pre-owned cars with transparent pricing.',
    icon: '🚗',
    link: '/buy-cars',
  },
  {
    id: 2,
    title: 'Sell Your Car',
    description: 'Get the best price for your car with our hassle-free selling process.',
    icon: '💰',
    link: '/sell-cars',
  },
  {
    id: 3,
    title: 'Car Servicing',
    description: 'Book professional car maintenance and repair services.',
    icon: '🔧',
    link: '/servicing',
  },
  {
    id: 4,
    title: 'Finance & Insurance',
    description: 'Explore easy financing options and comprehensive insurance plans.',
    icon: '📄',
    link: '/finance-insurance',
  },
];

// Define props interface for the component
interface ServiceCardsProps {
  className?: string;
}

const ServiceCards: React.FC<ServiceCardsProps> = ({ className = '' }) => {
  return (
    <section className={`py-12 bg-gray-100 ${className}`}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Our Services
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <a
              key={service.id}
              href={service.link}
              className="group bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={`Learn more about ${service.title}`}
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-gray-600">{service.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceCards;