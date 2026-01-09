import { useState } from "react";
import Star from "../../assets/icons/star.png";
import Review from "./Review";
import AnhTanh from "../../assets/avatars/anhtanh.jpg";

export default function RoomReviews() {
  const reviews = [
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
        "Dịch vụ thân thiện, nhân viên nhiệt tình. ádasdasdasdasdasdaaaaaaaaaaaaaaaaaaaádasdasádasdádasdasd adádasd",
      date: "2023-10-10",
    },
    {
      url: "https://example.com/avatar3.jpg",
      username: "Lê Văn C",
      description: "Vị trí đẹp, gần trung tâm.",
      date: "2023-09-20",
    },
    {
      url: "https://example.com/avatar3.jpg",
      username: "Lê Văn C",
      description: "Vị trí đẹp, gần trung tâm.",
      date: "2023-09-20",
    }
  ];

  const MAX = 2;
  const [showAll, setShowAll] = useState(false);

  const visibleReviews = showAll ? reviews : reviews.slice(0, MAX);

  return (
    <div className="h-fit rounded-xl border-2 border-dashed border-orange-300 flex p-4 flex-col">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <img src={Star} alt="" className="w-[25px] h-[25px]" />
        <span className="font-bold text-2xl">4.9</span>
        <span>({reviews.length} đánh giá)</span>
      </div>

      {/* Reviews grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleReviews.map((review, index) => (
          <Review key={index} {...review} />
        ))}
      </div>

      {/* Show all button */}
      {reviews.length > MAX && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 text-sm font-medium text-blue-600 hover:underline self-start"
        >
          {showAll
            ? "Thu gọn đánh giá"
            : `Xem tất cả ${reviews.length} đánh giá`}
        </button>
      )}
    </div>
  );
}
