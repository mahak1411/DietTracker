import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [foods, setFoods] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  // Function to fetch profile data
  const getProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      
      navigate('/login')
    }

    try {
      const response = await axios.get(
        "http://localhost:1001/api/profile/getProfile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.profile) {
        setProfile(response.data.profile); // If profile exists, set it
      } else {
        alert("No profile found. Please create one."); // No profile exists
      }
    } catch (error) {
      console.error("Error getting profile:", error.message);
    }
  };

  // Function to fetch foods
  const fetchFoods = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:1001/api/food/allFood",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const fetchedFoods = response.data.foods;
      setFoods(fetchedFoods);

      // Calculate the total calories
      const calories = fetchedFoods.reduce(
        (total, food) => total + food.nutritionInfo.calories,
        0
      );
      setTotalCalories(calories);
    } catch (error) {
      console.error("Error fetching foods:", error);
      navigate("/login");
    }
  };

  // Fetch foods and profile on component mount
  useEffect(() => {
    fetchFoods();
    getProfile();
  }, []);

  // Determine the color class for calories consumed
  const getCaloriesClass = () => {
    if (!profile || !profile.calorieRequirement) return "text-gray-500";
    if (totalCalories < profile.calorieRequirement) return "text-blue-500";
    if (totalCalories === profile.calorieRequirement) return "text-green-500";
    return "text-red-500";
  };

  // Prepare bar chart data for calories (Total)
  const barChartData = {
    labels: foods.map((food) => food.mealType),
    datasets: [
      {
        label: "Calories",
        data: foods.map((food) => food.nutritionInfo.calories),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // New Chart Data for Calorie Intake by Meal Type (Total Calories per Meal Type)
  const calorieByMealChartData = {
    labels: [...new Set(foods.map((food) => food.mealType))], // unique meal types
    datasets: [
      {
        label: "Calories by Meal Type",
        data: [...new Set(foods.map((food) => food.mealType))].map((meal) =>
          foods
            .filter((food) => food.mealType === meal)
            .reduce((sum, food) => sum + food.nutritionInfo.calories, 0)
        ),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Chart for comparing Calorie Intake vs. Calorie Requirement
  const comparisonChartData = {
    labels: ["Calories Consumed", "Calories Required"],
    datasets: [
      {
        label: "Comparison",
        data: [
          totalCalories,
          profile?.calorieRequirement || 0,
        ],
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  // Prepare pie chart data for macronutrients
  const pieChartData = {
    labels: ["Proteins", "Fats", "Carbohydrates"],
    datasets: [
      {
        label: "Macronutrients",
        data: [
          foods.reduce((total, food) => total + food.nutritionInfo.protein_g, 0),
          foods.reduce((total, food) => total + food.nutritionInfo.fat_total_g, 0),
          foods.reduce(
            (total, food) => total + food.nutritionInfo.carbohydrates_total_g,
            0
          ),
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverOffset: 4,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, {profile?.user?.name || "User"}!
        </h1>
        <p className="text-gray-600">
          Your personalized diet tracking dashboard
        </p>
      </div>

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card: Daily Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Daily Summary
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Daily Calorie Requirement:</span>
              <strong className="text-green-500">
                {profile?.calorieRequirement || "N/A"} kcal
              </strong>
            </div>
            <div className="flex justify-between">
              <span>Calories Consumed:</span>
              <strong className={getCaloriesClass()}>
                {totalCalories} kcal
              </strong>
            </div>
            <div className="flex justify-between">
              <span>Water Intake:</span>
              <strong>2.5 L</strong>
            </div>
          </div>
        </div>

        {/* Card: Meal Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Meal Breakdown
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            {foods.map((food) => (
              <li key={food._id}>
                <strong>{food.mealType}</strong>: {food.foodName} -{" "}
                {food.nutritionInfo.calories} kcal
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Bar Chart for Total Calories */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Calorie Breakdown
          </h3>
          <Bar data={barChartData} options={barChartOptions} />
        </div>

        {/* Pie Chart for Macronutrient Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Macronutrient Distribution
          </h3>
          <Pie data={pieChartData} />
        </div>

        {/* Bar Chart for Calories Comparison */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Calorie Intake vs Requirement
          </h3>
          <Bar data={comparisonChartData} options={barChartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
