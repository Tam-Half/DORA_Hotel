import Container from "./Container"

export default function Header() {
  return (
    <header className="border-b bg-white">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* LOGO */}
          <div className="flex items-center gap-2 font-bold text-blue-600">
            <div className="h-8 w-8 rounded bg-blue-600" />
            TravelBook
          </div>

          {/* MENU */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <a href="#" className="hover:text-blue-600">Khách sạn</a>
            <a href="#" className="hover:text-blue-600">Chuyến bay</a>
            <a href="#" className="hover:text-blue-600">Thuê xe</a>
            <a href="#" className="hover:text-blue-600">Ưu đãi</a>
          </nav>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Tìm kiếm khách sạn, thành phố..."
              className="hidden lg:block rounded-lg border px-3 py-2 text-sm"
            />
            <div className="h-8 w-8 rounded-full bg-gray-200" />
          </div>
        </div>
      </Container>
    </header>
  )
}
