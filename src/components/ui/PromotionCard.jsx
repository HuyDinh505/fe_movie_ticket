import React from "react";

function PromotionCard({ image, title }) {
  return (
    <div className="w-full">
      <div className="w-full overflow-hidden rounded shadow-sm">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <p className="text-sm mt-2 text-center px-2">{title}</p>
    </div>
  );
}

export default PromotionCard;
