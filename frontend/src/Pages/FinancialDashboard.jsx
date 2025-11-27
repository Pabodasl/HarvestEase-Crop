import React, { useState, useEffect } from 'react';
import { 
  Card, Form, Input, Button, Table, Modal, Menu, Divider, Tag, Select, DatePicker, 
  Tabs, Statistic, Row, Col, Alert, Space, Popconfirm, message 
} from 'antd';
import { Bar, Pie, Line } from 'react-chartjs-2';
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
  HistoryOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);
ChartJS.register(...registerables);
const { Option } = Select;

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

export default function FinancialDashboard() {
  const [sales, setSales] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [profitData, setProfitData] = useState({ 
    revenue: 0, 
    expenses: 0, 
    profit: 0, 
    roi: 0 
  });
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [expenseForm] = Form.useForm();
  const [isSaleModalVisible, setIsSaleModalVisible] = useState(false);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [editSale, setEditSale] = useState(null);
  const [editExpense, setEditExpense] = useState(null);
  const [view, setView] = useState('sales');
  const [activeTab, setActiveTab] = useState('1');
  const [dateRange, setDateRange] = useState([dayjs().subtract(1, 'month'), dayjs()]);
  const [cropFilter, setCropFilter] = useState('all');

  const expenseCategories = [
    'Seeds', 'Fertilizers', 'Pesticides', 'Labor', 
    'Machinery', 'Irrigation', 'Transport', 'Land Preparation', 
    'Packaging', 'Other'
  ];
  
  const cropTypes = [
    'Samba Rice', 'Nadu Rice', 'Red Rice', 'BG 352', 
    'Suwandel'
  ];

  const menuItems = [
    {
      key: 'sales',
      icon: <ShoppingOutlined />,
      label: 'Sales Records',
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
      icon: <BarChartOutlined />,
      label: 'Profit Analysis',
      onClick: () => setView('analysis')
    },
    {
      key: 'history',
      icon: <HistoryOutlined />,
      label: 'Trends',
      onClick: () => setView('history')
    }
  ];

  const calculateCropProfitData = () => {
    const data = {};
    
    cropTypes.forEach(crop => {
      data[crop] = { revenue: 0, expenses: 0 };
    });

    sales.forEach(sale => {
      if (sale.cropType) {
        data[sale.cropType] = data[sale.cropType] || { revenue: 0, expenses: 0 };
        data[sale.cropType].revenue += sale.quantity * sale.price;
      }
    });

    expenses.forEach(expense => {
      if (expense.crop && data[expense.crop]) {
        data[expense.crop].expenses += expense.amount;
      } else if (!expense.crop) {
        const cropsWithRevenue = Object.keys(data).filter(crop => data[crop].revenue > 0);
        if (cropsWithRevenue.length > 0) {
          const amountPerCrop = expense.amount / cropsWithRevenue.length;
          cropsWithRevenue.forEach(crop => {
            data[crop].expenses += amountPerCrop;
          });
        }
      }
    });

    return data;
  };

  const getTabItems = (cropProfitData) => {
    return [
      {
        key: '1',
        label: 'Cost Saving Tips',
        children: (
          <div className="space-y-4">
            <Alert
              message="High Fertilizer Costs"
              description={`Your fertilizer expenses are ${(expenses.filter(e => e.category === 'Fertilizers').reduce((sum, e) => sum + e.amount, 0) / (profitData.expenses || 1) * 100).toFixed(2)}% of total costs. Consider organic alternatives or bulk purchasing.`}
              type="warning"
              showIcon
            />
            <Alert
              message="Labor Optimization"
              description="Labor costs seem high compared to similar farms. Consider mechanization for repetitive tasks."
              type="info"
              showIcon
            />
            <Alert
              message="Profitable Crops"
              description={
                (() => {
                  const topCrops = Object.entries(cropProfitData)
                    .sort((a, b) => (b[1].revenue - b[1].expenses) - (a[1].revenue - a[1].expenses))
                    .slice(0, 2)
                    .map(([crop]) => crop);
                  
                  return topCrops.length > 1 
                    ? `${topCrops.join(' and ')} are your most profitable crops. Consider expanding cultivation.`
                    : `${topCrops[0] || 'None'} is your most profitable crop. Consider expanding cultivation.`;
                })()
              }
              type="success"
              showIcon
            />
          </div>
        )
      },
      {
        key: '2',
        label: 'Subsidy Alerts',
        children: (
          <div className="space-y-4">
            <Alert
              message="Seed Subsidy Available"
              description="Government is offering 50% subsidy on certified paddy seeds until end of month."
              type="info"
              showIcon
            />
            <Alert
              message="Equipment Loan Scheme"
              description="Low-interest loans available for farm machinery purchases through Agricultural Bank."
              type="info"
              showIcon
            />
          </div>
        )
      }
    ];
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const userId = JSON.parse(localStorage.getItem('user'))._id;
      console.log('userId:', userId);
      

      const [salesResponse, expensesResponse] = await Promise.all([
        // fetch('http://localhost:5000/api/sales').then(res => {
        //   if (!res.ok) throw new Error('Failed to fetch sales');
        //   return res.json();
        // }),
        fetch(`http://localhost:5000/api/sales/${userId}`).then(res => {
          if (!res.ok) throw new Error('Failed to fetch sales');
          return res.json();
        }),
        fetch(`http://localhost:5000/api/expenses/${userId}`).then(res => { // Fetch expenses by user ID
          if (!res.ok) throw new Error('Failed to fetch expenses');
          return res.json();
        })
      ]);

      let filteredSales = Array.isArray(salesResponse) ? salesResponse : [];
      let filteredExpenses = Array.isArray(expensesResponse) ? expensesResponse : [];

      if (Array.isArray(dateRange)) {  // Added missing parenthesis
        const [startDate, endDate] = dateRange;
        if (startDate && endDate) {
          filteredSales = filteredSales.filter(sale => {
            const saleDate = dayjs(sale.date);
            return saleDate.isAfter(startDate.startOf('day')) && 
                   saleDate.isBefore(endDate.endOf('day'));
          });
          
          filteredExpenses = filteredExpenses.filter(expense => {
            const expenseDate = dayjs(expense.date);
            return expenseDate.isAfter(startDate.startOf('day')) && 
                   expenseDate.isBefore(endDate.endOf('day'));
          });
        }
      }

      if (cropFilter !== 'all') {
        filteredSales = filteredSales.filter(sale => sale.cropType === cropFilter);
        filteredExpenses = filteredExpenses.filter(expense => expense.crop === cropFilter);
      }

      setSales(filteredSales);
      setExpenses(filteredExpenses);
      
      const revenue = filteredSales.reduce((sum, sale) => sum + (sale.quantity * sale.price), 0);
      const expensesTotal = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      const profit = revenue - expensesTotal;
      const roi = expensesTotal > 0 ? (profit / expensesTotal * 100) : 0;
      
      setProfitData({
        revenue,
        expenses: expensesTotal,
        profit,
        roi: parseFloat(roi.toFixed(2))
      });

    } catch (error) {
      console.error('Error fetching data:', error);
      message.error(error.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchData(); 
  }, [dateRange, cropFilter]);

  


  const generatePDF = async () => {
    try {
      const cropProfitData = calculateCropProfitData();
      const doc = new jsPDF();
      
      
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
          doc.text('HarvestEase', 14 + logoWidth + 5, 25); 
        }
      } catch (error) {
        console.error('Error loading logo:', error);
        
        doc.setFontSize(20);
        doc.setTextColor(245, 158, 11);
        doc.setFont('helvetica', 'bold');
        doc.text('HarvestEase', 14, 25);
      }
  
     
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      
      
      const reportDate = dayjs().format('YYYY-MM-DD hh:mm A');
      doc.text(`Report Generated: ${reportDate}`, 14, 40); 
      
      
      const formattedStartDate = dateRange?.[0]?.isValid() ? dateRange[0].format('YYYY-MM-DD') : '';
      const formattedEndDate = dateRange?.[1]?.isValid() ? dateRange[1].format('YYYY-MM-DD') : '';
      doc.text(`Date Range: ${formattedStartDate} to ${formattedEndDate}`, 14, 50); // Adjusted position
      
      
      doc.setFontSize(12);
      doc.autoTable({
        head: [['Metric', 'Value']],
        body: [
          ['Total Revenue', `Rs ${profitData.revenue.toLocaleString()}`],
          ['Total Expenses', `Rs ${profitData.expenses.toLocaleString()}`],
          ['Net Profit', `Rs ${profitData.profit.toLocaleString()}`],
          ['ROI', `${profitData.roi}%`],
          ['Total Sales', sales.reduce((sum, sale) => sum + sale.quantity, 0)],
          ['Total Expenses', expenses.length]
        ],
        startY: 60, 
        styles: { cellPadding: 5, fontSize: 12 },
        headStyles: { fillColor: [22, 160, 133] }
      });
  
      
      const filteredCropRows = Object.entries(cropProfitData)
        .filter(([crop]) => ![].includes(crop))
        .map(([crop, data]) => [
          crop,
          `Rs ${data.revenue.toLocaleString()}`,
          `Rs ${data.expenses.toLocaleString()}`,
          `Rs ${(data.revenue - data.expenses).toLocaleString()}`,
          `${data.expenses > 0 ? ((data.revenue - data.expenses) / data.expenses * 100).toFixed(2) : 0}%`
        ]);
  
      
      doc.setFontSize(14);
      doc.text('Crop-wise Profitability', 14, doc.lastAutoTable.finalY + 15);
      doc.autoTable({
        head: [['Crop', 'Revenue', 'Expenses', 'Profit', 'ROI']],
        body: filteredCropRows,
        startY: doc.lastAutoTable.finalY + 20,
        styles: { cellPadding: 5, fontSize: 10 },
        headStyles: { fillColor: [52, 152, 219] }
      });
  
    
      doc.save(`HarvestEase-Report-${dayjs().format('YYYY-MM-DD-HHmm')}.pdf`);
      
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
    
      // Ensure the selected date is not in the future
      if (selectedDate > today) {
        message.error('Sale date cannot be in the future.');
        return; // Prevent the request from being sent
      }
    
      const url = editSale ? `http://localhost:5000/api/sales/${editSale._id}` : 'http://localhost:5000/api/sales';
      const method = editSale ? 'PUT' : 'POST';
    
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          user: JSON.parse(localStorage.getItem('user'))._id,
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
      const response = await fetch(`http://localhost:5000/api/sales/${id}`, { 
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

      // Ensure the selected date is not in the future
      if (selectedDate > today) {
        message.error('Expense date cannot be in the future.');
        return;
      }

      const url = editExpense ? `http://localhost:5000/api/expenses/${editExpense._id}` : 'http://localhost:5000/api/expenses';
      const method = editExpense ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          user: JSON.parse(localStorage.getItem('user'))._id,
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
      const response = await fetch(`http://localhost:5000/api/expenses/${id}`, {
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

  const salesColumns = [
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

  const salesChartData = {
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

  const expensesChartData = {
    labels: expenseCategories,
    datasets: [{
      label: 'Expenses (Rs)',
      data: expenseCategories.map(cat => 
        expenses.filter(e => e.category === cat)
          .reduce((sum, exp) => sum + exp.amount, 0)
      ),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
        '#9966FF', '#FF9F40', '#8AC24A', '#607D8B',
        '#F06292', '#7986CB'
      ]
    }]
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

  const renderContent = () => {
    const cropProfitData = calculateCropProfitData();
    const cropProfitTableData = Object.entries(cropProfitData).map(([crop, data]) => ({
      key: crop,
      crop,
      revenue: data.revenue,
      expenses: data.expenses,
      profit: data.revenue - data.expenses,
      roi: data.expenses > 0 ? ((data.revenue - data.expenses) / data.expenses * 100) : 0
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
      }
    ];

    switch(view) {
      case 'sales':
        return (
          <Card
            title="Sales Transactions"
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsSaleModalVisible(true)}
              >
                Add Sale
              </Button>
            }
            className="shadow-sm"
          >
            <Table
              columns={salesColumns}
              dataSource={sales}
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
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsExpenseModalVisible(true)}
              >
                Add Expense
              </Button>
            }
            className="shadow-sm"
          >
            <Table
              columns={expensesColumns}
              dataSource={expenses}
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
            <Card title="Crop Profitability Analysis" className="shadow-sm">
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
                <Card title="Revenue by Crop" className="shadow-sm h-full">
                  <Bar
                    data={salesChartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: 'bottom' }
                      }
                    }}
                    height={300}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card title="Expense Breakdown" className="shadow-sm h-full">
                  <Pie
                    data={expensesChartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: 'bottom' }
                      }
                    }}
                    height={300}
                  />
                </Card>
              </Col>
            </Row>
          </div>
        );
      case 'history':
      default:
        return (
          <div className="space-y-6">
            <Card title="Financial Trends" className="shadow-sm">
              <div style={{ width: '100%', height: '300px' }}>
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
                />
              </div>
            </Card>

            <Card 
              title="Actions & Reports" 
              extra={
                <Space>
                  <Button 
                    icon={<FilePdfOutlined />} 
                    onClick={() => {
                      generatePDF().catch(console.error);
                    }}
                  >
                    PDF Report
                  </Button>
                </Space>
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
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Farm Financials</h1>
          <p className="text-sm text-gray-500">Cost Tracking & Profit Analysis</p>
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
          <div>
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
              <DollarCircleOutlined className="mr-2" />
              <span>Revenue</span>
            </div>
            <div className="flex items-center">
              <ArrowUpOutlined className="text-green-500 mr-1" />
              <span className="font-bold">Rs {profitData.revenue.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="mb-3">
            <div className="flex items-center text-gray-600 mb-1">
              <DollarCircleOutlined className="mr-2" />
              <span>Expenses</span>
            </div>
            <div className="flex items-center">
              <ArrowDownOutlined className="text-red-500 mr-1" />
              <span className="font-bold">Rs {profitData.expenses.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="mb-3">
            <div className="flex items-center text-gray-600 mb-1">
              <DollarCircleOutlined className="mr-2" />
              <span>Profit</span>
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
              <DollarCircleOutlined className="mr-2" />
              <span>ROI</span>
            </div>
            <div className="flex items-center">
              <span className={`${profitData.roi >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {profitData.roi}%
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
      >
        <Form form={form} layout="vertical" onFinish={handleAddSale}>
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
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="quantity"
                label="Quantity (kg)"
                rules={[{ required: true, message: 'Please enter quantity' }]}
              >
                <Input type="number" min={1} placeholder="Quantity" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="price"
                label="Price per kg (Rs)"
                rules={[{ required: true, message: 'Please enter price' }]}
              >
                <Input type="number" min={1} placeholder="Price" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name={['buyerDetails', 'name']}
            label="Buyer Name"
            rules={[{ required: true, message: 'Please enter buyer name' }]}
          >
            <Input placeholder="Buyer's full name" />
          </Form.Item>
          
          <Form.Item
            name={['buyerDetails', 'contact']}
            label="Buyer Contact"
            rules={[{ required: true, message: 'Please enter contact info' }]}
          >
            <Input placeholder="Phone or email" />
          </Form.Item>
          
          <Form.Item
            name="date"
            label="Sale Date"
            initialValue={dayjs()}
          >
            <DatePicker className="w-full" />
          </Form.Item>
          
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
      >
        <Form form={expenseForm} layout="vertical" onFinish={handleAddExpense}>
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
          
          <Form.Item
            name="amount"
            label="Amount (Rs)"
            rules={[{ required: true, message: 'Please enter amount' }]}
          >
            <Input type="number" min={0.01} step={0.01} placeholder="Amount" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea placeholder="Details about this expense" />
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
    </div>
  );
}