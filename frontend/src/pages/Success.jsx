import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const Success = () => {
  return (
    <div className="flex-grow bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-6" />
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Order Confirmed!</h2>
        <p className="text-gray-600 mb-8">
          Your payment was successful. Your delicious food is being prepared and will be delivered to you shortly.
        </p>
        <div className="space-y-4">
          <Link 
            to="/" 
            className="block w-full bg-orange-600 text-white font-medium px-6 py-3 rounded-md hover:bg-orange-700 transition-colors shadow-sm"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Success;
