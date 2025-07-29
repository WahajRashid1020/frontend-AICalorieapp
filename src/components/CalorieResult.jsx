import React from "react";
import { motion } from "framer-motion";

const CalorieResult = ({ data }) => {
  if (
    !data ||
    typeof data !== "object" ||
    !Array.isArray(data.items) ||
    typeof data.totalCalories === "undefined"
  ) {
    return null;
  }

  return (
    <motion.div
      className="bg-white/10 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl p-6 md:p-8 w-full text-white"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-6">
        <p className="text-lg text-gray-400">Estimated Total</p>
        <p className="text-6xl md:text-7xl font-bold text-purple-400 tracking-tight">
          {data.totalCalories}
        </p>
        <p className="text-2xl font-light text-white">calories</p>
      </div>

      {data.feedback && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3 border-b border-white/10 pb-2">
            Nutritional Feedback
          </h3>
          <p className="italic text-gray-300">"{data.feedback}"</p>
        </div>
      )}

      <div>
        <h3 className="text-xl font-semibold mb-4 border-b border-white/10 pb-2">
          Item Breakdown
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="p-3 text-sm font-semibold text-gray-300">
                  Item
                </th>
                <th className="p-3 text-sm font-semibold text-gray-300">
                  Serving Size
                </th>
                <th className="p-3 text-sm font-semibold text-gray-300 text-right">
                  Calories
                </th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-white/5 last:border-0 hover:bg-white/5"
                >
                  <td className="p-3 capitalize text-white font-medium">
                    {item.name}
                  </td>
                  <td className="p-3 text-gray-400">{item.servingSize}</td>
                  <td className="p-3 text-white font-semibold text-right">
                    {item.calories}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default CalorieResult;
