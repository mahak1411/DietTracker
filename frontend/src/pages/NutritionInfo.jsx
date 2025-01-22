import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NutritionInfo = () => {
  const [foods, setFoods] = useState([]);
  const navigate = useNavigate();

  // Function to fetch foods
  const fetchFoods = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        "https://diettracker-2lcg.onrender.com/api/food/allFood",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFoods(response.data.foods);
    } catch (error) {
      console.error("Error fetching foods:", error);
      navigate("/login"); // Redirect to login if unauthorized
    }
  };

  useEffect(() => {
    fetchFoods();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 px-6 py-10">
      <h1 className="text-green-600 text-4xl text-center font-extrabold mb-10">
        Nutritional Information of Your Meals
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {foods.map((food, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg overflow-hidden p-6 transform hover:scale-105 hover:shadow-md hover:shadow-green-800 transition duration-300 ease-in-out"
          >
            <h2 className="text-red-600 text-2xl font-bold mb-4">
              {food.foodName}
            </h2>
            <div className="space-y-2">
              <p className="text-gray-700">
                <span className="font-bold">Calories:</span>{" "}
                {food.nutritionInfo.calories} kcal
              </p>
              <p className="text-gray-700">
                <span className="font-bold">Protein:</span>{" "}
                {food.nutritionInfo.protein_g} g
              </p>
              <p className="text-gray-700">
                <span className="font-bold">Serving Size:</span>{" "}
                {food.nutritionInfo.serving_size_g} g
              </p>
              <p className="text-gray-700">
                <span className="font-bold">Total Fat:</span>{" "}
                {food.nutritionInfo.fat_total_g} g
              </p>
              <p className="text-gray-700">
                <span className="font-bold">Saturated Fat:</span>{" "}
                {food.nutritionInfo.fat_saturated_g} g
              </p>
              <p className="text-gray-700">
                <span className="font-bold">Cholesterol:</span>{" "}
                {food.nutritionInfo.cholesterol_mg} mg
              </p>
              <p className="text-gray-700">
                <span className="font-bold">Fiber:</span>{" "}
                {food.nutritionInfo.fiber_g} g
              </p>
              <p className="text-gray-700">
                <span className="font-bold">Sugar:</span>{" "}
                {food.nutritionInfo.sugar_g} g
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NutritionInfo;
