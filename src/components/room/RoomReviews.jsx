import { useState } from "react";
import Star from "../../assets/icons/star.png";
import Review from "./Review";
import AnhTanh from "../../assets/avatars/anhtanh.jpg";

export default function RoomReviews({ reviews: propsReviews = [], averageRating = 4.9, totalReviews = 0 }) {
  const defaultReviews = [
    {
      url: AnhTanh,
      username: "Nguyễn Văn A",
      description: "Phòng sạch sẽ, tiện nghi đầy đủ.",
      date: "2023-10-15",
    },
    {
      url: "https://example.com/avatar2.jpg",
      username: "Trần Thị B",
      description:
        "Dịch vụ thân thiện, nhân viên nhiệt tình. Trải nghiệm tuyệt vời tại Dora Hotel.",
      date: "2023-10-10",
    }
  ];

  const reviews = propsReviews.length > 0 ? propsReviews : defaultReviews;
  const rating = totalReviews > 0 ? averageRating : 4.9;
  const count = totalReviews > 0 ? totalReviews : reviews.length;

  const MAX = 2;
  const [showAll, setShowAll] = useState(false);

  const visibleReviews = showAll ? reviews : reviews.slice(0, MAX);

  return (
    <div className="h-fit rounded-xl border border-gray-200 bg-white flex p-6 flex-col shadow-sm">

      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <img src={Star} alt="" className="w-[25px] h-[25px]" />
        <span className="font-bold text-2xl text-gray-900">{rating}</span>
        <span className="text-gray-600">({count} đánh giá)</span>
      </div>

      {/* Reviews grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visibleReviews.map((review, index) => (
          <Review key={index} {...review} />
        ))}
      </div>

      {/* Show all button */}
      {reviews.length > MAX && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-6 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline self-start"
        >
          {showAll
            ? "Thu gọn đánh giá"
            : `Xem tất cả ${reviews.length} đánh giá`}
        </button>
      )}
    </div>
  );
}
