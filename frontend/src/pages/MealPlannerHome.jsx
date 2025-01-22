import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MealPlannerHome = () => {
  const navigate = useNavigate();
  useEffect(()=>{
    const token = localStorage.getItem('token');
  if(!token){
    navigate('/login')
  }
  },[])
  const goToMealPlanner = () => {
    navigate('/mealPlanner');  // Replace '/mealplanner' with the actual route for your MealPlanner component
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-center text-gray-700 mb-6">Welcome to Meal Planner</h1>
      <p className="text-xl text-center text-gray-600 mb-4">
        Get personalized meal plans based on your calorie requirements and diet preferences.
      </p>
      <button
        onClick={goToMealPlanner}
        className="btn px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none"
      >
        <span>Get Meal Planner</span>
      </button>
    </div>
  );
};

export default MealPlannerHome;
