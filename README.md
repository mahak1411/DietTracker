

# DietTracker

DietTracker is a web application designed to help users monitor and manage their dietary habits effectively. It includes features like daily meal logging, progress tracking, and a chatbot powered by OpenAI for personalized dietary advice.

## Features

- **User Authentication:** Secure sign-up and login functionality to personalize user experience.
- **Daily Diet Logging:** Users can record their daily food intake with details such as meal type, quantity, and nutritional information.
- **Progress Tracking:** Visual representations of dietary habits using **Chart.js** to help users stay on track with their health goals.
- **Chatbot Support:** An intelligent chatbot powered by **OpenAI API** to provide dietary advice and answer user queries.

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Charts:** Chart.js for data visualization
- **AI Chatbot:** OpenAI API for conversational support

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/mahak1411/DietTracker.git
   ```

2. **Navigate to the Project Directory:**

   ```bash
   cd DietTracker
   ```

3. **Install Dependencies:**

   ```bash
   npm install
   ```

4. **Set Up Environment Variables:**

   Create a `.env` file in the root directory and add the following:

   ```env
   PORT=1001
   MONGODB_URI=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret
   OPENAI_API_KEY=your_openai_api_key
   ```

5. **Start the Application:**

   ```bash
   npm start
   ```

   The application will be accessible at `http://localhost:1001`.

## Usage

- **Sign Up:** Create a new account to start tracking your diet.
- **Log In:** Access your account to view or add daily meal entries.
- **Add Meal:** Record details of your meals, including food items, quantities, and meal times.
- **View Progress:** Analyze your dietary patterns through graphical representations created with **Chart.js**.
- **Chatbot:** Use the chatbot for dietary suggestions and health tips.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a Pull Request.

