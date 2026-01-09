export default function RoomGallery() {
  return (
    <div className="h-[450px] grid grid-cols-2 rounded-xl border-2 p-2 overflow-hidden gap-2">
      
      {/* Cột trái */}
      <div className="min-h-0 pr-2 overflow-hidden rounded-xl border-2 w-full">
        <img
          src="https://picsum.photos/800/600?1"
          className="w-full h-full object-cover"
          alt=""
        />
      </div>

      {/* Cột phải */}
      <div className="min-h-0 grid grid-cols-2 grid-rows-2 gap-2">
        {[2, 3, 4, 5].map((i) => (
          <div key={i} className="min-h-0 overflow-hidden rounded-lg">
            <img
              src={`https://picsum.photos/400/300?${i}`}
              className="w-full h-full object-cover"
              alt=""
            />
          </div>
        ))}
      </div>

    </div>
  );
}
