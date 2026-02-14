import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import React, { useEffect } from 'react';
import Container from "../components/layout/Container";
import RoomGallery from "../components/room/RoomGallery";
import RoomInfo from "../components/room/RoomInfo";
import RoomAmenities from "../components/room/RoomAmenities";
import RoomReviews from "../components/room/RoomReviews";
import BookingCard from "../components/room/BookingCard";
import GeneralInfoRoom from "../components/room/GeneralInfoRoom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useGetRoomTypeByIdQuery } from '../services/roomType';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

export default function RoomDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');

  // Use ID from URL params, fallback to location state if necessary (legacy/edge cases)
  const roomId = id || location.state?.room?.roomTypeId || location.state?.room?.id;

  const { data: roomResponse, isLoading, error } = useGetRoomTypeByIdQuery(
    { id: roomId, params: { checkIn, checkOut } },
    { skip: !roomId }
  );

  const room = roomResponse?.data || location.state?.room;

  useEffect(() => {
    if (!roomId) {
      toast.error("Không tìm thấy thông tin phòng");
      navigate('/searchrooms');
    }
  }, [roomId, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-600 mb-4 mx-auto" size={48} />
          <p className="text-gray-500 font-medium">Đang tải thông tin phòng...</p>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-red-100">
          <p className="text-red-500 font-bold mb-4 text-xl">Lỗi tải dữ liệu</p>
          <p className="text-gray-600 mb-6">{error?.data?.message || "Không thể tải thông tin phòng này."}</p>
          <button
            onClick={() => navigate('/searchrooms')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Quay lại tìm kiếm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <Header />
      <Container>
        <div className="mt-5">
          <GeneralInfoRoom room={room} />
        </div>
        {/* GALLERY FULL WIDTH */}
        <div className="mt-6">
          <RoomGallery images={room.images} roomName={room.name} />
        </div>
        {/* CONTENT + BOOKING */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-8">
            <RoomInfo description={room.description} />
            <RoomAmenities amenities={room.amenities} />
            <RoomReviews reviews={room.reviews} averageRating={room.averageRating} totalReviews={room.totalReviews} />
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-1">
            <BookingCard
              room={room}
              initialCheckIn={checkIn}
              initialCheckOut={checkOut}
            />
          </div>

        </div>

      </Container>
      <Footer />
    </div>
  );
}
