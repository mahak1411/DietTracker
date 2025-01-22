import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FoodLog = () => {
  const [foods, setFoods] = useState([]);
  const navigate = useNavigate();

  // Function to fetch foods
  const fetchFoods = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        "http://localhost:1001/api/food/allFood",
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

  // Function to delete a food log
  const deleteFood = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:1001/api/food/deleteFood/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFoods((prevFoods) => prevFoods.filter((food) => food._id !== id));
    } catch (error) {
      console.error("Error deleting food:", error);
    }
  };

  const totalCalories = ()=>
  {
    let total=0;
    foods.map((food) => (
      total+=food.nutritionInfo.calories
    ))
    return total;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <button
        className="btn"
        onClick={() => navigate("/add-food")}
      >
       <span> Add Food Log</span>
      </button>
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Your Food Logs
        </h1>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Total Calories: <span className="text-red-500 underline">{totalCalories()}</span> </h2>
        <ul className="space-y-4">
          {foods.map((food) => (
            <li
              key={food._id}
              className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {food.foodName} - {food.quantity}
                  </h2>
                  <p className="text-sm text-gray-600">{food.mealType}</p>
                </div>
                <div className="text-sm text-gray-500">
                  <p>{food.nutritionInfo?.calories} calories</p>
                </div>
              </div>
              <button class="group relative flex h-10 w-10 flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-red-800 bg-red-400 hover:bg-red-600" onClick={() => deleteFood(food._id)}>
                  <svg
                    viewBox="0 0 1.625 1.625"
                    class="absolute -top-7 fill-white delay-100 group-hover:top-6 group-hover:animate-[spin_1.4s] group-hover:duration-1000"
                    height="15"
                    width="15"
                  >
                    <path d="M.471 1.024v-.52a.1.1 0 0 0-.098.098v.618c0 .054.044.098.098.098h.487a.1.1 0 0 0 .098-.099h-.39c-.107 0-.195 0-.195-.195"></path>
                    <path d="M1.219.601h-.163A.1.1 0 0 1 .959.504V.341A.033.033 0 0 0 .926.309h-.26a.1.1 0 0 0-.098.098v.618c0 .054.044.098.098.098h.487a.1.1 0 0 0 .098-.099v-.39a.033.033 0 0 0-.032-.033"></path>
                    <path d="m1.245.465-.15-.15a.02.02 0 0 0-.016-.006.023.023 0 0 0-.023.022v.108c0 .036.029.065.065.065h.107a.023.023 0 0 0 .023-.023.02.02 0 0 0-.007-.016"></path>
                  </svg>
                  <svg
                    width="16"
                    fill="none"
                    viewBox="0 0 39 7"
                    class="origin-right duration-500 group-hover:rotate-90"
                  >
                    <line
                      stroke-width="4"
                      stroke="white"
                      y2="5"
                      x2="39"
                      y1="5"
                    ></line>
                    <line
                      stroke-width="3"
                      stroke="white"
                      y2="1.5"
                      x2="26.0357"
                      y1="1.5"
                      x1="12"
                    ></line>
                  </svg>
                  <svg width="16" fill="none" viewBox="0 0 33 39" class="">
                    <mask fill="white" id="path-1-inside-1_8_19">
                      <path d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"></path>
                    </mask>
                    <path
                      mask="url(#path-1-inside-1_8_19)"
                      fill="white"
                      d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
                    ></path>
                    <path
                      stroke-width="4"
                      stroke="white"
                      d="M12 6L12 29"
                    ></path>
                    <path stroke-width="4" stroke="white" d="M21 6V29"></path>
                  </svg>
                </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FoodLog;
