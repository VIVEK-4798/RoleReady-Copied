import { useEffect, useState } from "react";
import Sidebar from "../common/Sidebar";
import Header from "../../../header/dashboard-header";
import Footer from "../common/Footer";
import CategorySelector from "./components/CategorySelector";
import DashboardContent from "./components/DashboardContent";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000/api";

const Index = () => {
  const [user, setUser] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [latest, setLatest] = useState(null);
  const [history, setHistory] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [categories, setCategories] = useState([]);
  
  const navigate = useNavigate();

  // Initialize user and fetch data
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser?.user_id) {
      navigate('/login');
      return;
    }

    setUser(storedUser);
    fetchInitialData(storedUser);
  }, [navigate]);

  // Fetch profile info and categories
  const fetchInitialData = async (storedUser) => {
    try {
      const [profileRes, categoriesRes] = await Promise.all([
        fetch(`${API_BASE}/profile/get-profile-info/${storedUser.user_id}`),
        fetch(`${API_BASE}/categories/get-categories`)
      ]);

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        if (profileData?.target_category_id) {
          setCategoryId(profileData.target_category_id);
        }
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData.results);
      }
    } catch (err) {
      console.error("Failed to fetch initial data", err);
    }
  };

  // Fetch readiness data when category changes
  useEffect(() => {
    if (!user?.user_id || !categoryId) return;

    const fetchReadinessData = async () => {
      setLoading(true);
      try {
        const [latestRes, historyRes, progressRes] = await Promise.all([
          fetch(`${API_BASE}/readiness/latest/${user.user_id}/${categoryId}`),
          fetch(`${API_BASE}/readiness/history/${user.user_id}/${categoryId}`),
          fetch(`${API_BASE}/readiness/progress/${user.user_id}/${categoryId}`)
        ]);

        if (latestRes.ok) setLatest(await latestRes.json());
        if (historyRes.ok) setHistory(await historyRes.json());
        if (progressRes.ok) setProgress(await progressRes.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReadinessData();
  }, [user, categoryId]);

  // Handle category selection
  const handleCategorySelect = async (selectedCategoryId) => {
    setCategoryId(selectedCategoryId);
    
    // Update profile with selected category
    if (user?.user_id) {
      try {
        await fetch(`${API_BASE}/profile/update-target-category`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.user_id,
            target_category_id: selectedCategoryId,
          }),
        });
      } catch (err) {
        console.error("Failed to update category", err);
      }
    }
  };

  // Handle retake assessment
  const handleRetakeAssessment = async () => {
    if (!user?.user_id || !categoryId) return;
    
    try {
      const res = await fetch(`${API_BASE}/readiness/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.user_id,
          category_id: categoryId,
        }),
      });

      if (res.ok) {
        // Refresh data
        const [latestRes, historyRes, progressRes] = await Promise.all([
          fetch(`${API_BASE}/readiness/latest/${user.user_id}/${categoryId}`),
          fetch(`${API_BASE}/readiness/history/${user.user_id}/${categoryId}`),
          fetch(`${API_BASE}/readiness/progress/${user.user_id}/${categoryId}`)
        ]);

        if (latestRes.ok) setLatest(await latestRes.json());
        if (historyRes.ok) setHistory(await historyRes.json());
        if (progressRes.ok) setProgress(await progressRes.json());
        
        alert("Assessment completed successfully!");
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to calculate readiness");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while calculating readiness");
    }
  };

  // Format date utility
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get category name
  const getCategoryName = () => {
    if (!categoryId || categories.length === 0) return "Target Role";
    const category = categories.find(c => c.category_id == categoryId);
    return category ? category.category_name : "Selected Role";
  };

  // If no category selected, show category selector
  if (!categoryId) {
    return <CategorySelector 
      categories={categories}
      onCategorySelect={handleCategorySelect}
    />;
  }

  return (
    <>
      <div className="header-margin"></div>
      <Header />

      <div className="dashboard">
        <div className="dashboard__sidebar bg-white scroll-bar-1">
          <Sidebar />
        </div>

        <div className="dashboard__main">
          <DashboardContent 
            categoryId={categoryId}
            categoryName={getCategoryName()}
            categories={categories}
            latest={latest}
            history={history}
            progress={progress}
            loading={loading}
            activeTab={activeTab}
            formatDate={formatDate}
            onCategorySelect={handleCategorySelect}
            onRetakeAssessment={handleRetakeAssessment}
            onTabChange={setActiveTab}
          />
          
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Index;