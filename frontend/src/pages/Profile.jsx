import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null); // Profile state

  // Function to fetch profile data
  const getProfile = async () => {
    try {
      const response = await axios.get('http://localhost:1001/api/profile/getProfile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data.profile) {
        setProfile(response.data.profile); // If profile exists, set it
      } else {
        alert('No profile found. Please create one.'); // No profile exists
      }
    } catch (error) {
      console.error('Error getting profile:', error.response?.data?.message || error.message);
    }
  };

  // Redirect to login if no token is found
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirect to login page
    } else {
      getProfile();
    }
  }, [navigate]);

  // Correct BMI calculation
  const heightInMeters = profile?.height / 100; // Convert height to meters
  const BMI = profile?.weight / (heightInMeters * heightInMeters);

  // Determine BMI category and background color
  let bmiColor = '';
  let bmiCategory = '';

  if (BMI < 18.5) {
    bmiColor = 'bg-blue-500'; // Underweight
    bmiCategory = 'Underweight';
  } else if (BMI >= 18.5 && BMI < 24.9) {
    bmiColor = 'bg-green-500'; // Normal weight
    bmiCategory = 'Normal Weight';
  } else if (BMI >= 25 && BMI < 29.9) {
    bmiColor = 'bg-yellow-500'; // Overweight
    bmiCategory = 'Overweight';
  } else {
    bmiColor = 'bg-red-500'; // Obesity
    bmiCategory = 'Obesity';
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-6">
      {profile ? (
        <div className="bg-white w-full max-w-3xl p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-semibold text-center text-gray-700 mb-6">Profile</h1>
          <div className="space-y-4">
            {/* Calorie Requirement Section */}
            <div className="w-full p-4 bg-green-500 text-white rounded-lg shadow-md">
              <p className="text-xl font-semibold text-center">Calorie Requirement</p>
              <p className="text-3xl font-extrabold text-center">{profile.calorieRequirement} kcal</p>
            </div>

            {/* BMI Section with conditional background color */}
            <div className={`w-full p-4 text-white rounded-lg shadow-md mt-4 ${bmiColor}`}>
              <p className="text-xl font-semibold text-center">Body Mass Index</p>
              <p className="text-3xl font-extrabold text-center">{BMI.toFixed(2)}</p>
              <p className="text-xl text-center">{bmiCategory}</p>
            </div>

            {/* Normal Profile Details */}
            <div className="text-lg text-gray-700 mt-6">
              <p><strong>Name:</strong> {profile.user?.name}</p>
              <p><strong>Email:</strong> {profile.user?.email}</p>
              <p><strong>Age:</strong> {profile.age}</p>
              <p><strong>Height:</strong> {profile.height} cm</p>
              <p><strong>Weight:</strong> {profile.weight} kg</p>
              <p><strong>Gender:</strong> {profile.gender}</p>
              <p><strong>Goal:</strong> {profile.goal}</p>
              <p><strong>Activity Level:</strong> {profile.activityLevel}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-lg text-center">
          <p className="text-xl text-gray-700 mb-4">No profile found.</p>
          <Link to="/createProfile">
            <button className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400">
              Create Profile
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Profile;
