// src/pages/PlaceholderPage.jsx
import React from 'react';

const PlaceholderPage = ({ pageName }) => {
  return (
    <div className="py-12 px-4 text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">{pageName}</h1>
      <p className="text-gray-600">Diese Seite wird noch entwickelt. Bitte schauen Sie später wieder vorbei.</p>
    </div>
  );
};

export default PlaceholderPage;