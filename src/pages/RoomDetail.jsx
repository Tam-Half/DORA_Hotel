import Container from "../components/layout/Container"
import RoomGallery from "../components/room/RoomGallery"
import RoomInfo from "../components/room/RoomInfo"
import RoomAmenities from "../components/room/RoomAmenities"
import RoomReviews from "../components/room/RoomReviews"
import BookingCard from "../components/room/BookingCard"
import GeneralInfoRoom from "../components/room/GeneralInfoRoom"
export default function RoomDetail() {
  return (
    <Container>
      <div className="mt-5">
        <GeneralInfoRoom />
      </div>
      {/* GALLERY FULL WIDTH */}
      <div>
        <RoomGallery />
      </div>
      {/* CONTENT + BOOKING */}
      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-8">
          <RoomInfo />
          <RoomAmenities />
          <RoomReviews />
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-1">
          <BookingCard />
        </div>

      </div>
    </Container>
  )
}
