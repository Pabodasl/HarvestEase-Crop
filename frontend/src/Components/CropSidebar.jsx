import { Link, useLocation } from 'react-router-dom';
import { 
  FaClipboardList, 
  FaTable, 
  FaChartLine,
  FaLeaf
} from 'react-icons/fa';

const CropSidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-green-50 to-green-100 border-r border-green-200 p-6 flex flex-col">
      {/* Branding Header */}
      <div className="flex items-center mb-8 pt-4">
        <FaLeaf className="text-3xl text-green-700 mr-3" />
        <h1 className="text-xl font-bold text-green-800">
          Crop Tracking
        </h1>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-2 flex-1">
        <Link
          to="/crop-form"
          className={`flex items-center px-4 py-3 rounded-lg transition-all ${
            location.pathname === "/crop-form"
              ? 'bg-green-600 text-white shadow-md'
              : 'text-green-700 hover:bg-green-200'
          }`}
        >
          <FaClipboardList className="mr-3" />
          <span className="font-medium">Crop Form</span>
        </Link>

        <Link
          to="/crop-table"
          className={`flex items-center px-4 py-3 rounded-lg transition-all ${
            location.pathname === "/crop-table"
              ? 'bg-green-600 text-white shadow-md'
              : 'text-green-700 hover:bg-green-200'
          }`}
        >
          <FaTable className="mr-3" />
          <span className="font-medium">Crop Records</span>
        </Link>

        <Link
          to="/crop-chart"
          className={`flex items-center px-4 py-3 rounded-lg transition-all ${
            location.pathname === "/crop-chart"
              ? 'bg-green-600 text-white shadow-md'
              : 'text-green-700 hover:bg-green-200'
          }`}
        >
          <FaChartLine className="mr-3" />
          <span className="font-medium">Crop Analytics</span>
        </Link>
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-green-200">
        <p className="text-xs text-green-600 text-center">
          HarnessEase Crop Management
        </p>
      </div>
    </div>
  );
};

export default CropSidebar;
