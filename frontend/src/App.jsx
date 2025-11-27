import React from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import Home from './Pages/Home';
import AboutUs from './Pages/AboutUs';
import Services from './Pages/Services';
import Header from './Components/NavBar/FarmerHeader';
import Footer from './Components/Footer';
import CropSidebar from './Components/CropSidebar';
import CropLanding from './Pages/CropLanding';
import CropForm from './Pages/CropForm';
import CropTable from './Pages/CropTable';
import CropUpdate from './Pages/CropUpdate';
import CropChart from './Pages/CropChart';
import CropPlanning from './Pages/CropPlanning';

import NaduDetail from './Pages/CropDetails/NaduDetail';
import SambaDetail from './Pages/CropDetails/SambaDetail';
import RedRiceDetail from './Pages/CropDetails/RedRiceDetail';
import Bg352Detail from './Pages/CropDetails/Bg352Detail';
import SuwandelDetail from './Pages/CropDetails/SuwandelDetail';
import PachchaDetail from './Pages/CropDetails/PachchaDetail';
import CropTrackingDetail from './Pages/CropTrackingDetail';
import HarvestStockDetail from './Pages/HarvestStockDetail';
import CostTrackingDetail from './Pages/CostTrackingDetail';
import SmartPlantCareDetail from './Pages/SmartPlantCareDetail';
import FinancialDashboard from './Pages/FinancialDashboard';
import Dashboard from './Pages/Dashboard'; // Path to the Dashboard component
import Login from "./Pages/Login";
import Register from "./Pages/Register"; // Path to the Login page
import StockPage from './Pages/StockManage/StockPage'; // kasuni
import ShopPage from './Pages/StockManage/ShopPage'; // kasuni
import ShopDetailPage from './Pages/StockManage/ShopDetailPage';
import CartPage from './Pages/StockManage/CartPage'; // kasuni
import NaduStockDetail from './Pages/StockManage/NaduStockDetail';   // kasuni
import SambaStockDetail from './Pages/StockManage/SambaStockDetail';
import Bg352StockDetail from './Pages/StockManage/BG352StockDetail'; // kasuni
import SuwandelStockDetail from './Pages/StockManage/SuwandelStockDetail'; // kasuni
import RedRiceStockDetail from './Pages/StockManage/RedRiceStockDetail'; // kasuni // kasuni
import PachchaStockDetail from './Pages/StockManage/PachchaStockDetail'; // kasuni
import DiseaseUser from './Pages/DiseaseUser';
import DiseasesAdmin from './Pages/DiseasesAdmin';
import KnowledgeHub from './Pages/KnowleadgeHub';
import AdminDashboard from './Pages/AdminDashboard';
import AdminCrops from './Pages/AdminCrops';
import AdminFinancialDashboard from './Pages/AdminFinancialDashboard';
import FarmerHome from './Pages/FarmerHome.jsx';
import AdminHome from './Pages/AdminHome.jsx';
import { useAuth } from './contexts/AuthContext';
import { Navigate } from 'react-router-dom';



import './App.css';

import NotAuthorized from "./Pages/NotAuthorized";
import PrivateRoute from "./Components/PrivateRoute";

function App() {
  const location = useLocation();
  const navigate = useNavigate();


  const cropSidebarRoutes = [
    '/crop-form',
    '/crop-table',
    '/crop-update',
    '/crop-chart',
    '/crop-planning'
  ];

  // Check if current path should show Crop Sidebar
  const showCropSidebar = cropSidebarRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  const ProtectedRoute = ({ access, element }) => {
    const { currentUser } = useAuth();
    console.log('current user: ', currentUser);

    if (!currentUser) {
      navigate("/login");
    }

    if (!access.includes(currentUser?.role)) {
      navigate("/");
    }
    
    return element;
  };

  
  const handleNavigation = ({ page, element }) => {
    {/* should be redirect relavant home page acording to the user role */}
    const { currentUser } = useAuth();
    if (currentUser) {
      if (currentUser.role === 'admin') {
        switch (page) {
          case 'home':
            return <Navigate to="/admin-home" />;
          case 'finance':
            return <Navigate to="/admin-finance" />;
          default:
            break;
        }
      } else if (currentUser.role === 'farmer') {
        switch (page) {
          case 'home':
            return <Navigate to="/farmer-home" />;
          case 'finance':
            return <Navigate to="/farmer-finance" />;
          default:
            break;
        }
      }
    }
    return element;
  };

  return (
    <>
      <Header />

      <div className="flex">
        {showCropSidebar && <CropSidebar />}
        <div className="flex-1 p-4">
          <Routes>
            {/* relavant Home Page */}
            <Route path="/" element={handleNavigation({ page: "home", element: <Home /> })} />

            {/* Crop Module */}
            <Route path="/crop-landing" element={<CropLanding />} />
            <Route path="/crop-form" element={<CropForm />} />
            <Route path="/crop-table" element={<CropTable />} />
            <Route path="/crop-update/:id" element={<CropUpdate />} />
            <Route path="/crop-chart" element={<CropChart />} />
            <Route path="/crop-planning" element={<CropPlanning />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/services" element={<Services />} />
            <Route path="/service" element={<Services />} />
            <Route path="/not-authorized" element={<NotAuthorized />} />

            {/* Crop Detail Pages */}
            <Route path="/crop-detail/nadu" element={<NaduDetail />} />
            <Route path="/crop-detail/samba" element={<SambaDetail />} />
            <Route path="/crop-detail/redrice" element={<RedRiceDetail />} />
            <Route path="/crop-detail/bg352" element={<Bg352Detail />} />
            <Route path="/crop-detail/suwandel" element={<SuwandelDetail />} />
            <Route path="/crop-detail/pachchaperumal" element={<PachchaDetail />} />


            {/* ✅ Other Pages */}

            <Route path="/services/crop-tracking" element={<CropTrackingDetail />} />
            <Route path="/services/harvest-stock" element={<HarvestStockDetail />} />
            <Route path="/services/cost-tracking" element={<CostTrackingDetail />} />
            <Route path="/services/smart-plant" element={<SmartPlantCareDetail />} />
            <Route path="/samba-stock-detail" element={<SambaStockDetail />} />
            <Route path="/pachcha-stock-detail" element={<PachchaStockDetail />} />
           <Route path="/redrice-stock-detail" element={<RedRiceStockDetail />} />
            <Route path="/bg352-stock-detail" element={<Bg352StockDetail />} />
            <Route path="/suwandel-stock-detail" element={<SuwandelStockDetail />} />
          
          {/* Protected Dashboards */}
            <Route
              path="/admin/dashboard"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/crops"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <AdminCrops />
                </PrivateRoute>
              }
            />
      
          </Routes>

        </div>
      </div>

          <Routes>
            <Route path="/finance" element={handleNavigation({page: "finance", element: <FinancialDashboard /> }) } />
            <Route path="/farmer-finance" element={<ProtectedRoute access={["farmer"]} element={<FinancialDashboard />} />} />
            <Route path="/admin-dashboard" element={<ProtectedRoute access={["admin"]} element={<AdminDashboard />} />} />
            <Route path="/admin-finance" element={<ProtectedRoute access={["admin"]} element={<AdminFinancialDashboard />} />} />
            <Route path="/stock-management" element={<StockPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* <Route path="/" exact component={<LoginPage />} /> */}
            <Route path="/disease-user" element={<DiseaseUser />} />
            <Route path="/diseases-admin" element={<DiseasesAdmin />} />
            <Route path="/knowledge-hub" element={<KnowledgeHub />} />
            {/* <Route path="/farmer-home" element={<FarmerHome />} /> */}
            <Route path="/farmer-home" element={<ProtectedRoute access={["farmer"]} element={<FarmerHome />} />} />
            <Route path="/admin-home" element={<AdminHome />} />
            {/* kasuni */}
            <Route path="/stock-management" element={<StockPage />} />
            <Route path="/shop" element={<ShopPage />} /> 
            <Route path="/cart" element={<CartPage />} />
            <Route path="/shop-detail/:id" element={<ShopDetailPage />} />
            <Route path="/nadu-stock-detail" element={<NaduStockDetail />} />
                
                

              </Routes>
              <Footer />
    </>
  );
}

export default App;