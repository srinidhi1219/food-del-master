const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-2xl font-bold text-orange-500">FoodieExpress</span>
            <p className="text-gray-400 text-sm mt-2">Delivering deliciousness to your door.</p>
          </div>
          <div className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} FoodieExpress. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
