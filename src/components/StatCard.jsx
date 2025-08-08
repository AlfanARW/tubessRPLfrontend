import React from 'react';

const StatCard = ({ title, value }) => {
    return (
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    );
};

export default StatCard;