import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MealPlanner = () => {
  const navigate = useNavigate();
  const [calories, setCalories] = useState(""); // Initially empty, updated later
  const [diet, setDiet] = useState("vegetarian");
  const [exclude, setExclude] = useState("");
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null); // Profile state

  // Fetch profile data and set total calorie requirement
  const getProfile = async () => {

    try {
      
      const token = localStorage.getItem('token');
      if(!token){ 
        return;
      }
      const response = await axios.get("https://diettracker-2lcg.onrender.com/api/profile/getProfile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.profile) {
        setProfile(response.data.profile);

        // Calculate the total calories and set as default input value
        const totalCalories = response.data.profile.calorieRequirement
        setCalories(totalCalories); // Set as default for calorie input
      } else {
        alert("No profile found. Please create one.");
      }
    } catch (error) {
      console.error("Error getting profile:", error.response?.data?.message || error.message);
    }
  };

  // Fetch profile on component mount
  useEffect(() => {
    getProfile();
  }, []);

  const fetchMeals = async () => {
    if (!calories) {
      alert("Please enter your calorie requirement.");
      return;
    }

    setLoading(true);
    setError(""); // Reset any previous errors

    try {
      const apiKey = "4cf222953f524b2abe298a6ab73b281b"; // Replace with your Spoonacular API key
      const url = `https://api.spoonacular.com/mealplanner/generate?apiKey=${apiKey}&timeFrame=day&targetCalories=${calories}&diet=${diet}&exclude=${exclude}`;

      const response = await axios.get(url);
      setMeals(response.data.meals);
    } catch (error) {
      console.error("Error fetching meals:", error);
      setError("Failed to fetch meal suggestions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Meal Planner</h1>
      <div className="w-full max-w-md bg-white p-6 rounded-md shadow-md">
        <input
          type="number"
          placeholder="Enter your calorie requirement"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
        />
        <input
          type="text"
          placeholder="Enter excluded ingredients (comma-separated)"
          value={exclude}
          onChange={(e) => setExclude(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
        />
        <select
          value={diet}
          onChange={(e) => setDiet(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
        >
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
          <option value="paleo">Paleo</option>
          <option value="glutenFree">Gluten-Free</option>
          <option value="dairyFree">Dairy-Free</option>
        </select>
        <button
          onClick={fetchMeals}
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 focus:outline-none"
        >
          Get Meal Suggestions
        </button>
      </div>

      {loading && <p className="mt-4 text-gray-700">Loading meals...</p>}

      {error && <p className="mt-4 text-red-500">{error}</p>} {/* Display error message */}

      {meals.length > 0 && (
        <div className="mt-6 w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {meals.map((meal, index) => (
            <div key={index} className="bg-white p-4 rounded-md shadow-md">
              <h2 className="text-lg font-semibold mt-2">{meal.title}</h2>
              <a
                href={meal.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-500 text-sm mt-2 inline-block"
              >
                View Recipe
              </a>
            </div>
          ))}
        </div>
      )}

      {!loading && meals.length === 0 && (
        <p className="mt-4 text-gray-500">No meals to display yet. Search above!</p>
      )}
    </div>
  );
};

export default MealPlanner;
