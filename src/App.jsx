import React, { useState, useEffect } from "react";
import { fetchCalories } from "./services/api";
import { motion } from "framer-motion";
import SearchBar from "./components/SearchBar";
import CalorieResult from "./components/CalorieResult";
import Loader from "./components/Loader";

export default function App() {
  const [mealInput, setMealInput] = useState("");
  const [calorieResults, setCalorieResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [expandedItems, setExpandedItems] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const savedData = localStorage.getItem("calorieResults");
    if (savedData) {
      const parsedResults = JSON.parse(savedData);
      setCalorieResults(parsedResults);
      const expanded = {};
      parsedResults.forEach((_, index) => {
        expanded[index] = true;
      });
      setExpandedItems(expanded);
    }
  }, []);

  useEffect(() => {
    if (calorieResults.length) {
      localStorage.setItem("calorieResults", JSON.stringify(calorieResults));
    } else {
      localStorage.removeItem("calorieResults");
    }
  }, [calorieResults]);

  const handleGetCalories = async () => {
    if (!mealInput.trim()) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetchCalories(mealInput);
      if (response.calories) {
        const newEntry = {
          name: mealInput.trim(),
          calories: response.calories,
        };
        setCalorieResults((prev) => [...prev, newEntry]);
        setExpandedItems((prev) => ({
          ...prev,
          [calorieResults.length]: true,
        }));
        setMealInput("");
      } else {
        setErrorMessage("No calorie data found.");
      }
    } catch (error) {
      setErrorMessage(
        error?.error || error?.message || "Something went wrong."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleItem = (index) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const removeItem = (index) => {
    setCalorieResults((prev) => prev.filter((_, i) => i !== index));
    setExpandedItems((prev) => {
      const copy = { ...prev };
      delete copy[index];
      const adjusted = {};
      Object.keys(copy).forEach((key) => {
        const keyNum = Number(key);
        adjusted[keyNum > index ? keyNum - 1 : keyNum] = copy[key];
      });
      return adjusted;
    });
  };

  const filteredResults = calorieResults.filter((result) =>
    result.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col items-center justify-start px-4 py-10">
      <motion.div
        className="bg-white/10 backdrop-blur-lg border border-white/10 p-6 md:p-8 rounded-2xl shadow-2xl max-w-2xl w-full space-y-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl font-bold text-center text-white mb-4">
          Calorie Count
        </h1>

        <textarea
          className="w-full p-4 text-white bg-white/10 placeholder-gray-400 border border-white/20 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
          rows={5}
          placeholder="e.g. eggs, spinach, olive oil"
          value={mealInput}
          onChange={(e) => setMealInput(e.target.value)}
        />

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleGetCalories}
          disabled={isLoading || !mealInput.trim()}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg disabled:opacity-50 transition"
        >
          {isLoading ? <Loader /> : "Get Calorie Breakdown"}
        </motion.button>

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 font-medium border border-red-400/20 p-3 rounded-md bg-red-500/10"
          >
            ⚠️ {errorMessage || "Something went wrong"}
          </motion.div>
        )}

        {calorieResults.length > 0 && (
          <SearchBar query={searchTerm} setQuery={setSearchTerm} />
        )}

        {calorieResults.length > 0 ? (
          // Filter calorieResults directly and keep track of their indexes
          calorieResults
            .map((item, index) => ({ item, index }))
            .filter(({ item }) =>
              item.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .reverse()
            .map(({ item, index }) => (
              <div key={index} className="mb-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl capitalize font-semibold text-white py-2">
                    {item.name}
                  </h2>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => toggleItem(index)}
                      className="text-purple-400 cursor-pointer hover:text-purple-600 font-semibold"
                    >
                      {expandedItems[index] ? "Hide" : "Expand"}
                    </button>
                    <button
                      onClick={() => removeItem(index)}
                      className="text-red-500 cursor-pointer hover:text-red-600 font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {expandedItems[index] && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <CalorieResult data={item.calories} />
                  </motion.div>
                )}
              </div>
            ))
        ) : (
          <p className="text-gray-400 text-center">No Stored Meal</p>
        )}
      </motion.div>
    </div>
  );
}
