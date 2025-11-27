import React, { useState, useEffect } from 'react';
import { 
  Card, Form, Input, Button, Table, Modal, Menu, Divider, Tag, Select, DatePicker, 
  Tabs, Statistic, Row, Col, Alert, Space, Popconfirm, message, Badge, Switch, Avatar,
  Descriptions, TreeSelect, Cascader, InputNumber, Upload, Radio, Checkbox, List
} from 'antd';
import { Bar, Pie, Line, Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
  ShoppingOutlined,
  PieChartOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DollarCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  BarChartOutlined,
  TagsOutlined,
  HistoryOutlined,
  TeamOutlined,
  AuditOutlined,
  AreaChartOutlined,
  WarningOutlined,
  SettingOutlined,
  SyncOutlined,
  FileSyncOutlined,
  DashboardOutlined,
  GlobalOutlined,
  FundOutlined,
  BankOutlined,
  MoneyCollectOutlined,
  CalculatorOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs'; // ✅ Single import for dayjs
import isBetween from 'dayjs/plugin/isBetween';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import relativeTime from 'dayjs/plugin/relativeTime'; // ✅ Add this for fromNow()

dayjs.extend(isBetween);
dayjs.extend(advancedFormat);
dayjs.extend(weekOfYear);
dayjs.extend(relativeTime); // ✅ Extend relativeTime for fromNow()
ChartJS.register(...registerables);
const { Option } = Select;
const { TabPane } = Tabs;

const getBase64Image = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob); 
    reader.onloadend = () => {
      resolve(reader.result);
    }
  });
};

export default function AdminFinancialDashboard() {
  const [sales, setSales] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [profitData, setProfitData] = useState({ 
    revenue: 0, 
    expenses: 0, 
    profit: 0, 
    roi: 0,
    farmerCount: 0,
    avgProfit: 0,
    topPerformer: null
  });
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [expenseForm] = Form.useForm();
  const [farmerForm] = Form.useForm();
  const [isSaleModalVisible, setIsSaleModalVisible] = useState(false);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isFarmerModalVisible, setIsFarmerModalVisible] = useState(false);
  const [editSale, setEditSale] = useState(null);
  const [editExpense, setEditExpense] = useState(null);
  const [editFarmer, setEditFarmer] = useState(null);
  const [view, setView] = useState('overview');
  const [activeTab, setActiveTab] = useState('1');
  const [dateRange, setDateRange] = useState([dayjs().subtract(1, 'month'), dayjs()]);
  const [cropFilter, setCropFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [alertSettings, setAlertSettings] = useState({
    unusualSpending: true,
    lowProfitMargin: true,
    highExpenseRatio: false,
    revenueDrop: true
  });
  const [reportConfig, setReportConfig] = useState({
    frequency: 'weekly',
    format: 'pdf',
    recipients: ['admin@harvestease.com']
  });

  const expenseCategories = [
    'Seeds', 'Fertilizers', 'Pesticides', 'Labor', 
    'Machinery', 'Irrigation', 'Transport', 'Land Preparation', 
    'Packaging', 'Other'
  ];
  
  const cropTypes = [
    'Samba Rice', 'Nadu Rice', 'Red Rice', 'BG 352', 
    'Suwandel'
  ];

  const regions = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale',
    'Nuwara Eliya', 'Galle', 'Matara', 'Hambantota', 'Jaffna',
    'Kilinochchi', 'Mannar', 'Vavuniya', 'Mullaitivu', 'Batticaloa',
    'Ampara', 'Trincomalee', 'Kurunegala', 'Puttalam', 'Anuradhapura',
    'Polonnaruwa', 'Badulla', 'Moneragala', 'Ratnapura', 'Kegalle'
  ];

  const menuItems = [
    {
      key: 'overview',
      icon: <DashboardOutlined />,
      label: 'System Overview',
      onClick: () => setView('overview')
    },
    {
      key: 'farmers',
      icon: <TeamOutlined />,
      label: 'Farmers Management',
      onClick: () => setView('farmers')
    },
    {
      key: 'sales',
      icon: <ShoppingOutlined />,
      label: 'Sales Administration',
      onClick: () => setView('sales')
    },
    {
      key: 'expenses',
      icon: <TagsOutlined />,
      label: 'Expense Tracking',
      onClick: () => setView('expenses')
    },
    {
      key: 'analysis',
      icon: <FundOutlined />,
      label: 'Advanced Analytics',
      onClick: () => setView('analysis')
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Financial Settings',
      onClick: () => setView('settings')
    }
  ];

  const calculateSystemProfitData = () => {
    const data = {};
    
    cropTypes.forEach(crop => {
      data[crop] = { revenue: 0, expenses: 0, farmers: new Set() };
    });

    sales.forEach(sale => {
      if (sale.cropType) {
        data[sale.cropType] = data[sale.cropType] || { revenue: 0, expenses: 0, farmers: new Set() };
        data[sale.cropType].revenue += sale.quantity * sale.price;
        if (sale.user) { // Changed from sale.farmerId to sale.user
          data[sale.cropType].farmers.add(sale.user);
        }
      }
    });

    expenses.forEach(expense => {
      if (expense.crop && data[expense.crop]) {
        data[expense.crop].expenses += expense.amount;
        if (expense.user) { // Changed from expense.farmerId to expense.user
          data[expense.crop].farmers.add(expense.user);
        }
      } else if (!expense.crop) {
        const cropsWithRevenue = Object.keys(data).filter(crop => data[crop].revenue > 0);
        if (cropsWithRevenue.length > 0) {
          const amountPerCrop = expense.amount / cropsWithRevenue.length;
          cropsWithRevenue.forEach(crop => {
            data[crop].expenses += amountPerCrop;
            if (expense.user) { // Changed from expense.farmerId to expense.user
              data[crop].farmers.add(expense.user);
            }
          });
        }
      }
    });

    // Convert Sets to counts
    Object.keys(data).forEach(crop => {
      data[crop].farmerCount = data[crop].farmers.size;
      delete data[crop].farmers;
    });

    return data;
  };

  const calculateFarmerPerformance = () => {
    const farmerMap = {};
  
    // Initialize all farmers with default values
    farmers.forEach(farmer => {
      farmerMap[farmer._id] = {
        name: farmer.name,
        region: farmer.region || 'Unknown',
        revenue: 0,
        expenses: 0,
        salesCount: 0,
        expenseCount: 0
      };
    });
  
    // Calculate revenue from sales
    sales.forEach(sale => {
      if (sale.user && farmerMap[sale.user]) {
        farmerMap[sale.user].revenue += (sale.quantity || 0) * (sale.price || 0);
        farmerMap[sale.user].salesCount += 1;
      }
    });
  
    // Calculate expenses
    expenses.forEach(expense => {
      if (expense.user && farmerMap[expense.user]) {
        farmerMap[expense.user].expenses += expense.amount || 0;
        farmerMap[expense.user].expenseCount += 1;
      }
    });
  
    // Convert to array and calculate profit/ROI
    return Object.entries(farmerMap).map(([id, data]) => ({
      id,
      ...data,
      profit: data.revenue - data.expenses,
      roi: data.expenses > 0 ? ((data.revenue - data.expenses) / data.expenses * 100) : 0
    }));
  };

  const getTabItems = (cropProfitData) => {
    return [
      {
        key: '1',
        label: 'System Alerts',
        children: (
          <div className="space-y-4">
            <Alert
              message="Unusual Spending Patterns"
              description="3 farmers have expenses exceeding 150% of their 3-month average."
              type="warning"
              showIcon
              action={
                <Button size="small" type="text">
                  Review
                </Button>
              }
            />
            <Alert
              message="Low Profit Margins"
              description="7 farmers have profit margins below 10%. Consider sending cost-saving recommendations."
              type="error"
              showIcon
              action={
                <Button size="small" type="text">
                  View List
                </Button>
              }
            />
            {/*<Alert
              message="Top Performers",
              description={
                (() => {
                  const topFarmers = calculateFarmerPerformance()
                    .sort((a, b) => b.profit - a.profit)
                    .slice(0, 2)
                    .map(f => f.name);
                  
                  return topFarmers.length > 1 
                    ? `${topFarmers.join(' and ')} are your top performing farmers this period.`
                    : `${topFarmers[0] || 'None'} is your top performing farmer this period.`;
                })()
              }
              type="success"
              showIcon
            />*/}
          </div>
        )
      },
      {
        key: '2',
        label: 'Regional Insights',
        children: (
          <div className="space-y-4">
            <Alert
              message="High Yield Region"
              description="Farmers in Kalutara district are achieving 23% higher yields than regional average."
              type="info"
              showIcon
            />
            <Alert
              message="Subsidy Opportunities"
              description="New equipment subsidy program available for farmers in Northern Province."
              type="info"
              showIcon
            />
          </div>
        )
      }
    ];
  };

  const getCurrentUserId = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user._id : null;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [salesResponse, expensesResponse, farmersResponse] = await Promise.all([
        fetch('http://localhost:5000/api/admin/sales').then(res => res.json()),
        fetch('http://localhost:5000/api/admin/expenses').then(res => res.json()),
        fetch('http://localhost:5000/api/admin/farmers').then(res => res.json())
      ]);

      console.log('Sales data:', salesResponse);
      console.log('Expenses data:', expensesResponse);
      console.log('Farmers data:', farmersResponse);

      setSales(Array.isArray(salesResponse) ? salesResponse : []);
      setExpenses(Array.isArray(expensesResponse) ? expensesResponse : []);
      setFarmers(Array.isArray(farmersResponse) ? farmersResponse : []);

      const revenue = salesResponse.reduce((sum, sale) => sum + ((sale.quantity || 0) * (sale.price || 0)), 0);
      const expensesTotal = expensesResponse.reduce((sum, expense) => sum + (expense.amount || 0), 0);
      const profit = revenue - expensesTotal;
      const roi = expensesTotal > 0 ? (profit / expensesTotal * 100) : 0;

      const farmerPerformance = calculateFarmerPerformance();
      const topPerformer = farmerPerformance.length > 0
        ? farmerPerformance.reduce((max, farmer) => farmer.profit > max.profit ? farmer : max, farmerPerformance[0])
        : null;

      setProfitData({
        revenue,
        expenses: expensesTotal,
        profit,
        roi: parseFloat(roi.toFixed(2)),
        farmerCount: farmersResponse.length,
        avgProfit: farmersResponse.length > 0 ? profit / farmersResponse.length : 0,
        topPerformer
      });

    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchData(); 
  }, [dateRange, cropFilter, regionFilter]);

  useEffect(() => {
    const farmerPerformance = calculateFarmerPerformance().sort((a, b) => b.profit - a.profit);
    if (farmerPerformance.length > 0) {
      const topPerformer = farmerPerformance[0];
      if (!profitData.topPerformer || profitData.topPerformer.id !== topPerformer.id) {
        setProfitData(prev => ({
          ...prev,
          topPerformer
        }));
      }
    } else {
      if (profitData.topPerformer) {
        setProfitData(prev => ({
          ...prev,
          topPerformer: null
        }));
      }
    }
  }, [sales, expenses, farmers]);

  const generateSystemReport = async () => {
    try {
      const cropProfitData = calculateSystemProfitData();
      const doc = new jsPDF();
      
      // Add logo and header
      let logoHeight = 0;
      try {
        const logoBase64 = await getBase64Image('/Yellow Vintage Wheat Rice Oats logo.png');
        if (logoBase64) {
          const logoWidth = 20;
          logoHeight = 20;
          doc.addImage(logoBase64, 'PNG', 14, 10, logoWidth, logoHeight);
          doc.setFontSize(20);
          doc.setTextColor(245, 158, 11);
          doc.setFont('helvetica', 'bold');
          doc.text('HarvestEase Admin Report', 14 + logoWidth + 5, 25); 
        }
      } catch (error) {
        console.error('Error loading logo:', error);
        doc.setFontSize(20);
        doc.setTextColor(245, 158, 11);
        doc.setFont('helvetica', 'bold');
        doc.text('HarvestEase Admin Report', 14, 25);
      }
  
      // Report metadata
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      
      const reportDate = dayjs().format('YYYY-MM-DD hh:mm A');
      doc.text(`Report Generated: ${reportDate}`, 14, 40); 
      
      const formattedStartDate = dateRange?.[0]?.isValid() ? dateRange[0].format('YYYY-MM-DD') : '';
      const formattedEndDate = dateRange?.[1]?.isValid() ? dateRange[1].format('YYYY-MM-DD') : '';
      doc.text(`Date Range: ${formattedStartDate} to ${formattedEndDate}`, 14, 50);
      
      doc.text(`Farmers Included: ${farmers.length}`, 14, 60);
      doc.text(`Region Filter: ${regionFilter === 'all' ? 'All Regions' : regionFilter}`, 14, 70);
      
      // System summary
      doc.setFontSize(12);
      doc.autoTable({
        head: [['System Metric', 'Value']],
        body: [
          ['Total Revenue', `Rs ${profitData.revenue.toLocaleString()}`],
          ['Total Expenses', `Rs ${profitData.expenses.toLocaleString()}`],
          ['Net Profit', `Rs ${profitData.profit.toLocaleString()}`],
          ['Average ROI', `${profitData.roi}%`],
          ['Active Farmers', profitData.farmerCount],
          ['Average Profit/Farmer', `Rs ${Math.round(profitData.avgProfit).toLocaleString()}`],
          ['Top Performer', profitData.topPerformer ? `${profitData.topPerformer.name} (Rs ${Math.round(profitData.topPerformer.profit).toLocaleString()})` : 'N/A']
        ],
        startY: 80,
        styles: { cellPadding: 5, fontSize: 12 },
        headStyles: { fillColor: [22, 160, 133] }
      });
  
      // Crop-wise profitability
      const filteredCropRows = Object.entries(cropProfitData)
        .filter(([crop]) => cropFilter === 'all' || crop === cropFilter)
        .map(([crop, data]) => [
          crop,
          `Rs ${data.revenue.toLocaleString()}`,
          `Rs ${data.expenses.toLocaleString()}`,
          `Rs ${(data.revenue - data.expenses).toLocaleString()}`,
          `${data.expenses > 0 ? ((data.revenue - data.expenses) / data.expenses * 100).toFixed(2) : 0}%`,
          data.farmerCount
        ]);
  
      doc.setFontSize(14);
      doc.text('Crop-wise Profitability', 14, doc.lastAutoTable.finalY + 15);
      doc.autoTable({
        head: [['Crop', 'Revenue', 'Expenses', 'Profit', 'ROI', 'Farmers']],
        body: filteredCropRows,
        startY: doc.lastAutoTable.finalY + 20,
        styles: { cellPadding: 5, fontSize: 10 },
        headStyles: { fillColor: [52, 152, 219] }
      });
  
      // Farmer performance
      const farmerPerformance = calculateFarmerPerformance()
        .sort((a, b) => b.profit - a.profit)
        .slice(0, 10)
        .map((farmer, index) => [
          index + 1,
          farmer.name,
          farmer.region,
          `Rs ${Math.round(farmer.revenue).toLocaleString()}`,
          `Rs ${Math.round(farmer.expenses).toLocaleString()}`,
          `Rs ${Math.round(farmer.profit).toLocaleString()}`,
          `${farmer.roi.toFixed(2)}%`
        ]);
  
      doc.setFontSize(14);
      doc.text('Top Performing Farmers', 14, doc.lastAutoTable.finalY + 15);
      doc.autoTable({
        head: [['Rank', 'Farmer', 'Region', 'Revenue', 'Expenses', 'Profit', 'ROI']],
        body: farmerPerformance,
        startY: doc.lastAutoTable.finalY + 20,
        styles: { cellPadding: 5, fontSize: 10 },
        headStyles: { fillColor: [155, 89, 182] }
      });
    
      doc.save(`HarvestEase-Admin-Report-${dayjs().format('YYYY-MM-DD-HHmm')}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      message.error('Failed to generate PDF report');
    }
  };

  const handleAddSale = async (values) => {
    setLoading(true);
    try {
      const selectedDate = values.date ? values.date.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD');
      const today = dayjs().format('YYYY-MM-DD');
    
      if (selectedDate > today) {
        message.error('Sale date cannot be in the future.');
        return;
      }
    
      const url = editSale ? `http://localhost:5000/api/admin/sales/${editSale._id}` : 'http://localhost:5000/api/admin/sales';
      const method = editSale ? 'PUT' : 'POST';
    
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          date: selectedDate
        })
      });
    
      if (!response.ok) {
        throw new Error('Failed to save sale');
      }
    
      setIsSaleModalVisible(false);
      form.resetFields();
      setEditSale(null);
      fetchData();
      message.success(editSale ? 'Sale updated successfully' : 'Sale added successfully');
    } catch (error) {
      console.error('Error saving sale:', error);
      message.error(error.message || 'Failed to save sale');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSale = (sale) => {
    form.setFieldsValue({
      ...sale,
      date: dayjs(sale.date),
      buyerDetails: sale.buyerDetails || { name: '', contact: '' }
    });
    setEditSale(sale);
    setIsSaleModalVisible(true);
  };

  const handleDeleteSale = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/admin/sales/${id}`, { 
        method: 'DELETE' 
      });

      if (!response.ok) {
        throw new Error('Failed to delete sale');
      }

      fetchData();
      message.success('Sale deleted successfully');
    } catch (error) {
      console.error('Error deleting sale:', error);
      message.error(error.message || 'Failed to delete sale');
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (values) => {
    setLoading(true);
    try {
      const selectedDate = values.date ? values.date.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD');
      const today = dayjs().format('YYYY-MM-DD');
  
      if (selectedDate > today) {
        message.error('Expense date cannot be in the future.');
        return;
      }
  
      const url = editExpense ? `http://localhost:5000/api/admin/expenses/${editExpense._id}` : 'http://localhost:5000/api/admin/expenses';
      const method = editExpense ? 'PUT' : 'POST';
  
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          date: selectedDate
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to save expense');
      }
  
      setIsExpenseModalVisible(false);
      expenseForm.resetFields();
      setEditExpense(null);
      fetchData();
      message.success(editExpense ? 'Expense updated successfully' : 'Expense added successfully');
    } catch (error) {
      console.error('Error saving expense:', error);
      message.error(error.message || 'Failed to save expense');
    } finally {
      setLoading(false);
    }
  };

  const handleEditExpense = (expense) => {
    expenseForm.setFieldsValue({
      ...expense,
      date: dayjs(expense.date)
    });
    setEditExpense(expense);
    setIsExpenseModalVisible(true);
  };

  const handleDeleteExpense = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/admin/expenses/${id}`, { 
        method: 'DELETE' 
      });

      if (!response.ok) {
        throw new Error('Failed to delete expense');
      }

      fetchData();
      message.success('Expense deleted successfully');
    } catch (error) {
      console.error('Error deleting expense:', error);
      message.error(error.message || 'Failed to delete expense');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFarmer = async (values) => {
    setLoading(true);
    try {
      const url = editFarmer ? `http://localhost:5000/api/admin/farmers/${editFarmer._id}` : 'http://localhost:5000/api/admin/farmers';
      const method = editFarmer ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
  
      if (!response.ok) {
        throw new Error('Failed to save farmer');
      }
  
      setIsFarmerModalVisible(false);
      farmerForm.resetFields();
      setEditFarmer(null);
      fetchData();
      message.success(editFarmer ? 'Farmer updated successfully' : 'Farmer added successfully');
    } catch (error) {
      console.error('Error saving farmer:', error);
      message.error(error.message || 'Failed to save farmer');
    } finally {
      setLoading(false);
    }
  };

  const handleEditFarmer = (farmer) => {
    farmerForm.setFieldsValue({
      ...farmer,
      status: farmer.status || 'active'
    });
    setEditFarmer(farmer);
    setIsFarmerModalVisible(true);
  };

  const handleDeleteFarmer = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/admin/farmers/${id}`, { 
        method: 'DELETE' 
      });

      if (!response.ok) {
        throw new Error('Failed to delete farmer');
      }

      fetchData();
      message.success('Farmer deleted successfully');
    } catch (error) {
      console.error('Error deleting farmer:', error);
      message.error(error.message || 'Failed to delete farmer');
    } finally {
      setLoading(false);
    }
  };

  const handleAlertSettingChange = (key, value) => {
    setAlertSettings(prev => ({
      ...prev,
      [key]: value
    }));
    // In a real app, you would save these settings to the backend
    message.success('Alert settings updated');
  };

  const handleReportConfigChange = (key, value) => {
    setReportConfig(prev => ({
      ...prev,
      [key]: value
    }));
    // In a real app, you would save these settings to the backend
    message.success('Report configuration updated');
  };

  const salesColumns = [
    { 
      title: 'Farmer', 
      dataIndex: 'user', 
      key: 'farmer',
      render: (id) => {
        const farmer = farmers.find(f => f._id === id);
        return farmer ? farmer.name : 'Unknown';
      }
    },
    { title: 'Crop', dataIndex: 'cropType', key: 'cropType', render: (text) => <Tag color="green">{text}</Tag> },
    { title: 'Qty (kg)', dataIndex: 'quantity', key: 'quantity', align: 'right' },
    { title: 'Price (Rs)', dataIndex: 'price', key: 'price', align: 'right', render: (text) => text.toLocaleString() },
    { title: 'Total (Rs)', key: 'total', align: 'right', render: (_, record) => (record.quantity * record.price).toLocaleString() },
    { title: 'Buyer', dataIndex: ['buyerDetails', 'name'], key: 'buyer' },
    { title: 'Date', dataIndex: 'date', key: 'date', render: (date) => dayjs(date).format('YYYY-MM-DD') },
    {
      title: 'Actions', key: 'actions', render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => handleEditSale(record)} />
          <Popconfirm
            title="Delete this sale?"
            onConfirm={() => handleDeleteSale(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button size="small" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      )
    }
  ];

  const expensesColumns = [
    { 
      title: 'Farmer', 
      dataIndex: 'user', 
      key: 'user',
      render: (id) => {
        const farmer = farmers.find(f => f._id === id);
        return farmer ? farmer?.name : 'Unknown';
      }
    },
    { title: 'Category', dataIndex: 'category', key: 'category', render: (text) => <Tag color="blue">{text}</Tag> },
    { title: 'Crop', dataIndex: 'crop', key: 'crop', render: (text) => text || 'General' },
    { title: 'Amount (Rs)', dataIndex: 'amount', key: 'amount', align: 'right', render: (text) => text.toLocaleString() },
    { title: 'Description', dataIndex: 'description', key: 'description', ellipsis: true },
    { title: 'Date', dataIndex: 'date', key: 'date', render: (date) => dayjs(date).format('YYYY-MM-DD') },
    {
      title: 'Actions', key: 'actions', render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => handleEditExpense(record)} />
          <Popconfirm
            title="Delete this expense?"
            onConfirm={() => handleDeleteExpense(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button size="small" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      )
    }
  ];

  const farmersColumns = [
    { 
      title: 'Name', 
      dataIndex: 'name', 
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center">
          <Avatar className="mr-2" style={{ backgroundColor: record.status === 'active' ? '#87d068' : '#f50' }}>
            {text.charAt(0).toUpperCase()}
          </Avatar>
          <span>{text}</span>
        </div>
      )
    },
    { title: 'Email', dataIndex: 'email', key: 'email' }, // Added email column
    { title: 'Joined', dataIndex: 'createdAt', key: 'createdAt', render: (date) => dayjs(date).format('YYYY-MM-DD') },
    {
      title: 'Actions', key: 'actions', render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => handleEditFarmer(record)} />
          <Popconfirm
            title="Delete this farmer?"
            onConfirm={() => handleDeleteFarmer(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button size="small" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      )
    }
  ];

  const systemSalesChartData = {
    labels: [...new Set(sales.map(s => s.cropType || 'Other'))],
    datasets: [{
      label: 'Revenue (Rs)',
      data: [...new Set(sales.map(s => s.cropType || 'Other'))].map(crop => 
        sales.filter(s => s.cropType === crop)
          .reduce((sum, sale) => sum + (sale.quantity * sale.price), 0)
      ),
      backgroundColor: 'rgba(46, 204, 113, 0.7)',
      borderColor: 'rgba(46, 204, 113, 1)',
      borderWidth: 1
    }]
  };

  const regionalProfitData = {
    labels: regions,
    datasets: [{
      label: 'Average Profit (Rs)',
      data: regions.map(region => {
        const farmersInRegion = farmers.filter(f => f.region === region);
        if (farmersInRegion.length === 0) return 0;
        
        const farmerIds = farmersInRegion.map(f => f._id);
        const farmerSales = sales.filter(s => farmerIds.includes(s.farmerId));
        const farmerExpenses = expenses.filter(e => farmerIds.includes(e.farmerId));
        
        const revenue = farmerSales.reduce((sum, sale) => sum + (sale.quantity * sale.price), 0);
        const expensesTotal = farmerExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        const profit = revenue - expensesTotal;
        
        return farmersInRegion.length > 0 ? profit / farmersInRegion.length : 0;
      }),
      backgroundColor: 'rgba(52, 152, 219, 0.7)',
      borderColor: 'rgba(52, 152, 219, 1)',
      borderWidth: 1
    }]
  };

  const farmerPerformanceScatterData = {
    datasets: calculateFarmerPerformance().map(farmer => ({
      label: farmer.name,
      data: [{
        x: farmer.expenses,
        y: farmer.revenue,
        r: Math.min(20, Math.max(5, Math.sqrt(farmer.profit) / 10))
      }],
      backgroundColor: farmer.profit >= 0 ? 'rgba(46, 204, 113, 0.7)' : 'rgba(231, 76, 60, 0.7)'
    }))
  };

  const profitTrendData = {
    labels: Array.from({ length: 12 }, (_, i) => dayjs().subtract(11 - i, 'month').format('MMM YY')),
    datasets: [
      {
        label: 'Revenue',
        data: Array.from({ length: 12 }, (_, i) => 
          sales.filter(s => dayjs(s.date).isSame(dayjs().subtract(11 - i, 'month'), 'month'))
            .reduce((sum, sale) => sum + (sale.quantity * sale.price), 0)
        ),
        borderColor: '#2ecc71',
        backgroundColor: 'rgba(46, 204, 113, 0.1)',
        tension: 0.1,
        fill: true
      },
      {
        label: 'Expenses',
        data: Array.from({ length: 12 }, (_, i) => 
          expenses.filter(e => dayjs(e.date).isSame(dayjs().subtract(11 - i, 'month'), 'month'))
            .reduce((sum, exp) => sum + exp.amount, 0)
        ),
        borderColor: '#e74c3c',
        backgroundColor: 'rgba(231, 76, 60, 0.1)',
        tension: 0.1,
        fill: true
      }
    ]
  };

  const farmerPerformanceBarData = {
    labels: calculateFarmerPerformance().map(farmer => farmer.name),
    datasets: [
      {
        label: 'Revenue (Rs)',
        data: calculateFarmerPerformance().map(farmer => farmer.revenue),
        backgroundColor: 'rgba(46, 204, 113, 0.7)',
        borderColor: 'rgba(46, 204, 113, 1)',
        borderWidth: 1
      },
      {
        label: 'Expenses (Rs)',
        data: calculateFarmerPerformance().map(farmer => farmer.expenses),
        backgroundColor: 'rgba(231, 76, 60, 0.7)',
        borderColor: 'rgba(231, 76, 60, 1)',
        borderWidth: 1
      },
      {
        label: 'Profit (Rs)',
        data: calculateFarmerPerformance().map(farmer => farmer.profit),
        backgroundColor: 'rgba(52, 152, 219, 0.7)',
        borderColor: 'rgba(52, 152, 219, 1)',
        borderWidth: 1
      }
    ]
  };

  const [searchText, setSearchText] = useState(''); // Initialize searchText state
  const [salesSearchText, setSalesSearchText] = useState(''); // State for sales search
  const [expensesSearchText, setExpensesSearchText] = useState(''); // State for expenses search

  const filteredFarmers = farmers.filter(farmer =>
    farmer.name.toLowerCase().includes(searchText.toLowerCase()) ||
    farmer.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const filteredSales = sales.filter(sale => {
    const farmer = farmers.find(f => f._id === sale.user);
    return farmer && farmer.name.toLowerCase().includes(salesSearchText.toLowerCase());
  });

  const filteredExpenses = expenses.filter(expense => {
    const farmer = farmers.find(f => f._id === expense.user);
    return farmer && farmer.name.toLowerCase().includes(expensesSearchText.toLowerCase());
  });

  const renderContent = () => {
    const cropProfitData = calculateSystemProfitData();
    const farmerPerformance = calculateFarmerPerformance();
    const cropProfitTableData = Object.entries(cropProfitData).map(([crop, data]) => ({
      key: crop,
      crop,
      revenue: data.revenue,
      expenses: data.expenses,
      profit: data.revenue - data.expenses,
      roi: data.expenses > 0 ? ((data.revenue - data.expenses) / data.expenses * 100) : 0,
      farmerCount: data.farmerCount
    }));

    const cropProfitColumns = [
      { title: 'Crop', dataIndex: 'crop', key: 'crop' },
      { 
        title: 'Revenue (Rs)', 
        dataIndex: 'revenue', 
        key: 'revenue',
        render: (text) => text.toLocaleString(),
        sorter: (a, b) => a.revenue - b.revenue
      },
      { 
        title: 'Expenses (Rs)', 
        dataIndex: 'expenses', 
        key: 'expenses',
        render: (text) => text.toLocaleString(),
        sorter: (a, b) => a.expenses - b.expenses
      },
      { 
        title: 'Profit (Rs)', 
        dataIndex: 'profit', 
        key: 'profit',
        render: (text, record) => (
          <span style={{ color: text >= 0 ? '#2ecc71' : '#e74c3c' }}>
            {text.toLocaleString()}
          </span>
        ),
        sorter: (a, b) => a.profit - b.profit
      },
      { 
        title: 'ROI (%)', 
        dataIndex: 'roi', 
        key: 'roi',
        render: (text) => (
          <span style={{ color: text >= 0 ? '#2ecc71' : '#e74c3c' }}>
            {text.toFixed(2)}%
          </span>
        ),
        sorter: (a, b) => a.roi - b.roi
      },
      { 
        title: 'Farmers', 
        dataIndex: 'farmerCount', 
        key: 'farmerCount',
        sorter: (a, b) => a.farmerCount - b.farmerCount
      }
    ];

    const farmerPerformanceColumns = [
      { 
        title: 'Rank', 
        key: 'rank',
        render: (_, __, index) => index + 1
      },
      { 
        title: 'Farmer', 
        dataIndex: 'id', 
        key: 'farmer',
        render: (id) => {
          const farmer = farmers.find(f => f._id === id);
          return farmer ? farmer.name : 'Unknown';
        }
      },
      { 
        title: 'Revenue (Rs)', 
        dataIndex: 'revenue', 
        key: 'revenue',
        render: (text) => text.toLocaleString(),
        sorter: (a, b) => a.revenue - b.revenue
      },
      { 
        title: 'Expenses (Rs)', 
        dataIndex: 'expenses', 
        key: 'expenses',
        render: (text) => text.toLocaleString(),
        sorter: (a, b) => a.expenses - b.expenses
      },
      { 
        title: 'Profit (Rs)', 
        dataIndex: 'profit', 
        key: 'profit',
        render: (text) => (
          <span style={{ color: text >= 0 ? '#2ecc71' : '#e74c3c' }}>
            {text.toLocaleString()}
          </span>
        ),
        sorter: (a, b) => a.profit - b.profit
      },
      { 
        title: 'ROI (%)', 
        dataIndex: 'roi', 
        key: 'roi',
        render: (text) => (
          <span style={{ color: text >= 0 ? '#2ecc71' : '#e74c3c' }}>
            {text.toFixed(2)}%
          </span>
        ),
        sorter: (a, b) => a.roi - b.roi
      }
    ];

    switch(view) {
      case 'overview':
        return (
          <div className="space-y-6">
            <Row gutter={16}>
              <Col span={6}>
                <Card className="shadow-sm">
                  <Statistic
                    title="Total Farmers"
                    value={profitData.farmerCount}
                    prefix={<TeamOutlined />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card className="shadow-sm">
                  <Statistic
                    title="System Revenue"
                    value={profitData.revenue}
                    prefix={<DollarCircleOutlined />}
                    precision={2}
                    formatter={value => `Rs ${value.toLocaleString()}`}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card className="shadow-sm">
                  <Statistic
                    title="System Expenses"
                    value={profitData.expenses}
                    prefix={<DollarCircleOutlined />}
                    precision={2}
                    formatter={value => `Rs ${value.toLocaleString()}`}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card className="shadow-sm">
                  <Statistic
                    title="System Profit"
                    value={profitData.profit}
                    prefix={<DollarCircleOutlined />}
                    precision={2}
                    valueStyle={{ color: profitData.profit >= 0 ? '#3f8600' : '#cf1322' }}
                    formatter={value => `Rs ${Math.abs(value).toLocaleString()}`}
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Card title="Revenue by Crop" className="shadow-sm h-full">
                  <Bar
                    data={systemSalesChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'bottom' }
                      }
                    }}
                    height={300} // Reduced height
                    width={300}  // Adjusted width
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card title="Expense Distribution by Category" className="shadow-sm h-full">
                  <Pie
                    data={{
                      labels: expenseCategories,
                      datasets: [
                        {
                          label: 'Expenses (Rs)',
                          data: expenseCategories.map(category =>
                            expenses
                              .filter(expense => expense.category === category)
                              .reduce((sum, expense) => sum + expense.amount, 0)
                          ),
                          backgroundColor: [
                            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                            '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'
                          ]
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'bottom' }
                      }
                    }}
                    height={300} // Reduced height
                    width={300}  // Adjusted width
                  />
                </Card>
              </Col>
            </Row>

            <Card title="Top Performing Farmers" className="shadow-sm">
              <Table
                columns={farmerPerformanceColumns}
                dataSource={calculateFarmerPerformance().sort((a, b) => b.profit - a.profit).slice(0, 5)}
                rowKey="id"
                loading={loading}
                pagination={false}
              />
            </Card>

            <Card 
              title="System Alerts & Insights" 
              extra={
                <Button 
                  icon={<FilePdfOutlined />} 
                  onClick={() => {
                    generateSystemReport().catch(console.error);
                  }}
                >
                  Export Report
                </Button>
              }
              className="shadow-sm"
            >
              <Tabs 
                activeKey={activeTab} 
                onChange={setActiveTab}
                items={getTabItems(cropProfitData)}
              />
            </Card>
          </div>
        );
      case 'farmers':
        return (
          <Card
            title="Farmers Management"
            extra={
              <Input
                placeholder="Search farmers..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 200 }}
              />
            }
            className="shadow-sm"
          >
            <Table
              columns={farmersColumns}
              dataSource={filteredFarmers} // Use filtered farmers
              rowKey="_id"
              loading={loading}
              pagination={{ pageSize: 10 }}
              scroll={{ x: true }}
            />
          </Card>
        );
      case 'sales':
        return (
          <Card
            title="Sales Administration"
            extra={
              <Input
                placeholder="Search sales by farmer name..."
                value={salesSearchText}
                onChange={(e) => setSalesSearchText(e.target.value)}
                style={{ width: 200 }}
              />
            }
            className="shadow-sm"
          >
            <Table
              columns={salesColumns}
              dataSource={filteredSales} // Use filtered sales
              rowKey="_id"
              loading={loading}
              pagination={{ pageSize: 10 }}
              scroll={{ x: true }}
            />
          </Card>
        );
      case 'expenses':
        return (
          <Card
            title="Expense Tracking"
            extra={
              <Input
                placeholder="Search expenses by farmer name..."
                value={expensesSearchText}
                onChange={(e) => setExpensesSearchText(e.target.value)}
                style={{ width: 200 }}
              />
            }
            className="shadow-sm"
          >
            <Table
              columns={expensesColumns}
              dataSource={filteredExpenses} // Use filtered expenses
              rowKey="_id"
              loading={loading}
              pagination={{ pageSize: 10 }}
              scroll={{ x: true }}
            />
          </Card>
        );
      case 'analysis':
        return (
          <div className="space-y-6">
            <Card title="System Profitability Analysis" className="shadow-sm">
              <Table
                columns={cropProfitColumns}
                dataSource={cropProfitTableData}
                rowKey="crop"
                loading={loading}
                pagination={{ pageSize: 5 }}
              />
            </Card>

            <Row gutter={16}>
              <Col span={12}>
                <Card title="Farmer Performance" className="shadow-sm h-full">
                  <Bar
                    data={farmerPerformanceBarData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'bottom' },
                        tooltip: {
                          callbacks: {
                            label: (context) => {
                              const value = context.raw.toLocaleString();
                              return `${context.dataset.label}: Rs ${value}`;
                            }
                          }
                        }
                      },
                      scales: {
                        x: {
                          title: {
                            display: true,
                            text: 'Farmers'
                          }
                        },
                        y: {
                          title: {
                            display: true,
                            text: 'Amount (Rs)'
                          },
                          beginAtZero: true
                        }
                      }
                    }}
                    height={400}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card title="Financial Trends" className="shadow-sm h-full">
                  <Line
                    data={profitTrendData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'bottom' }
                      },
                      interaction: {
                        mode: 'index',
                        intersect: false
                      },
                      scales: {
                        y: {
                          beginAtZero: true
                        }
                      }
                    }}
                    height={400}
                  />
                </Card>
              </Col>
            </Row>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <Card title="Financial Alert Settings" className="shadow-sm">
              <Form layout="vertical">
                <Form.Item label="Unusual Spending Patterns">
                  <Switch 
                    checked={alertSettings.unusualSpending}
                    onChange={(checked) => handleAlertSettingChange('unusualSpending', checked)}
                  />
                  <span className="ml-2 text-gray-600">
                    Alert when a farmer's expenses exceed 150% of their 3-month average
                  </span>
                </Form.Item>
                <Form.Item label="Low Profit Margins">
                  <Switch 
                    checked={alertSettings.lowProfitMargin}
                    onChange={(checked) => handleAlertSettingChange('lowProfitMargin', checked)}
                  />
                  <span className="ml-2 text-gray-600">
                    Alert when a farmer's profit margin falls below 10%
                  </span>
                </Form.Item>
                <Form.Item label="High Expense Ratios">
                  <Switch 
                    checked={alertSettings.highExpenseRatio}
                    onChange={(checked) => handleAlertSettingChange('highExpenseRatio', checked)}
                  />
                  <span className="ml-2 text-gray-600">
                    Alert when a crop's expense ratio exceeds 70% of revenue
                  </span>
                </Form.Item>
                <Form.Item label="Revenue Drops">
                  <Switch 
                    checked={alertSettings.revenueDrop}
                    onChange={(checked) => handleAlertSettingChange('revenueDrop', checked)}
                  />
                  <span className="ml-2 text-gray-600">
                    Alert when a farmer's revenue drops more than 30% month-over-month
                  </span>
                </Form.Item>
                <Button type="primary">Save Alert Settings</Button>
              </Form>
            </Card>

            <Card title="Financial Parameters" className="shadow-sm">
              <Form layout="vertical">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Default Tax Rate (%)">
                      <InputNumber min={0} max={100} defaultValue={15} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Currency">
                      <Select defaultValue="LKR">
                        <Option value="LKR">Sri Lankan Rupee (LKR)</Option>
                        <Option value="USD">US Dollar (USD)</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item label="Expense Categories">
                  <Select
                    mode="tags"
                    defaultValue={expenseCategories}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
                <Form.Item label="Crop Types">
                  <Select
                    mode="tags"
                    defaultValue={cropTypes}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
                <Button type="primary">Save Parameters</Button>
              </Form>
            </Card>
          </div>
        );
      default:
        return <div>Select a view</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Admin Financials</h1>
          <p className="text-sm text-gray-500">System-wide Financial Management</p>
        </div>
        
        {/* Filters */}
        <div className="p-4 border-b border-gray-200">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <DatePicker.RangePicker 
              value={dateRange}
              onChange={setDateRange}
              className="w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Crop Filter</label>
            <Select
              value={cropFilter}
              onChange={setCropFilter}
              className="w-full"
            >
              <Option value="all">All Crops</Option>
              {cropTypes.map(crop => (
                <Option key={crop} value={crop}>{crop}</Option>
              ))}
            </Select>
          </div>
        </div>
        
        <Menu
          mode="inline"
          selectedKeys={[view]}
          className="flex-1 border-r-0"
          items={menuItems}
        />

        {/* Summary Stats */}
        <div className="p-4 border-t border-gray-200">
          <div className="mb-3">
            <div className="flex items-center text-gray-600 mb-1">
              <TeamOutlined className="mr-2" />
              <span>Active Farmers</span>
            </div>
            <div className="flex items-center">
              <span className="font-bold">{profitData.farmerCount}</span>
            </div>
          </div>
          
          <div className="mb-3">
            <div className="flex items-center text-gray-600 mb-1">
              <DollarCircleOutlined className="mr-2" />
              <span>System Profit</span>
            </div>
            <div className="flex items-center">
              <span className={`mr-1 ${profitData.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {profitData.profit >= 0 ? '+' : ''}
                Rs {Math.abs(profitData.profit).toLocaleString()}
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center text-gray-600 mb-1">
              <FundOutlined className="mr-2" />
              <span>Top Performer</span>
            </div>
            <div className="flex items-center">
              <span className="font-bold">
                {profitData.topPerformer 
                  ? `${profitData.topPerformer.name} (Rs ${Math.round(profitData.topPerformer.profit).toLocaleString()})` 
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        {renderContent()}
      </div>

      {/* Add/Edit Sale Modal */}
      <Modal
        title={editSale ? 'Edit Sale Record' : 'Add New Sale'}
        open={isSaleModalVisible}
        onCancel={() => {
          setIsSaleModalVisible(false);
          setEditSale(null);
          form.resetFields();
        }}
        footer={null}
        destroyOnClose
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleAddSale}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="farmerId"
                label="Farmer"
                rules={[{ required: true, message: 'Please select farmer' }]}
              >
                <Select placeholder="Select farmer" showSearch optionFilterProp="children">
                  {farmers.map(farmer => (
                    <Option key={farmer._id} value={farmer._id}>{farmer.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="cropType"
                label="Crop Type"
                rules={[{ required: true, message: 'Please select crop type' }]}
              >
                <Select placeholder="Select crop">
                  {cropTypes.map(crop => (
                    <Option key={crop} value={crop}>{crop}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="quantity"
                label="Quantity (kg)"
                rules={[{ required: true, message: 'Please enter quantity' }]}
              >
                <Input type="number" min={1} placeholder="Quantity" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="price"
                label="Price per kg (Rs)"
                rules={[{ required: true, message: 'Please enter price' }]}
              >
                <Input type="number" min={1} placeholder="Price" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="date"
                label="Sale Date"
                initialValue={dayjs()}
              >
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={['buyerDetails', 'name']}
                label="Buyer Name"
                rules={[{ required: true, message: 'Please enter buyer name' }]}
              >
                <Input placeholder="Buyer's full name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={['buyerDetails', 'contact']}
                label="Buyer Contact"
                rules={[{ required: true, message: 'Please enter contact info' }]}
              >
                <Input placeholder="Phone or email" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              {editSale ? 'Update Sale' : 'Add Sale'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Add/Edit Expense Modal */}
      <Modal
        title={editExpense ? 'Edit Expense Record' : 'Add New Expense'}
        open={isExpenseModalVisible}
        onCancel={() => {
          setIsExpenseModalVisible(false);
          setEditExpense(null);
          expenseForm.resetFields();
        }}
        footer={null}
        destroyOnClose
        width={800}
      >
        <Form form={expenseForm} layout="vertical" onFinish={handleAddExpense}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="farmerId"
                label="Farmer"
                rules={[{ required: true, message: 'Please select farmer' }]}
              >
                <Select placeholder="Select farmer" showSearch optionFilterProp="children">
                  {farmers.map(farmer => (
                    <Option key={farmer._id} value={farmer._id}>{farmer.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Expense Category"
                rules={[{ required: true, message: 'Please select category' }]}
              >
                <Select placeholder="Select category">
                  {expenseCategories.map(cat => (
                    <Option key={cat} value={cat}>{cat}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="crop"
                label="Associated Crop (if applicable)"
              >
                <Select placeholder="Select crop (optional)">
                  <Option value="">General Expense</Option>
                  {cropTypes.map(crop => (
                    <Option key={crop} value={crop}>{crop}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="amount"
                label="Amount (Rs)"
                rules={[{ required: true, message: 'Please enter amount' }]}
              >
                <Input type="number" min={0.01} step={0.01} placeholder="Amount" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea placeholder="Details about this expense" rows={4} />
          </Form.Item>
          
          <Form.Item
            name="date"
            label="Expense Date"
            initialValue={dayjs()}
          >
            <DatePicker className="w-full" />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              {editExpense ? 'Update Expense' : 'Add Expense'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Add/Edit Farmer Modal */}
      <Modal
        title={editFarmer ? 'Edit Farmer' : 'Add New Farmer'}
        open={isFarmerModalVisible}
        onCancel={() => {
          setIsFarmerModalVisible(false);
          setEditFarmer(null);
          farmerForm.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form form={farmerForm} layout="vertical" onFinish={handleAddFarmer}>
          <Form.Item
            name="name"
            label="Farmer Name"
            rules={[{ required: true, message: 'Please enter farmer name' }]}
          >
            <Input placeholder="Full name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email Address"
            rules={[{ required: true, message: 'Please enter valid email address' }]}
          >
            <Input placeholder="Email Address" />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select role' }]}
          >
            <Select disabled placeholder="Select role">
              {["farmer"].map(role => (
                <Option key={role} value={role}>{role}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="status"
            label="Status"
            initialValue="active"
          >
            <Radio.Group>
              <Radio value="active">Active</Radio>
              <Radio value="inactive">Inactive</Radio>
            </Radio.Group>
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              {editFarmer ? 'Update Farmer' : 'Add Farmer'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}