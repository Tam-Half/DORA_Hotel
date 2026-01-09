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
            <a href="#" className="hover:text-blue-600">Trang chủ</a>
            <a href="#" className="hover:text-blue-600">Phòng</a>
            <a href="#" className="hover:text-blue-600">Tin tức</a>
            <a href="#" className="hover:text-blue-600">Liên hệ</a>
          </nav>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
         
            <div className="h-8 w-8 rounded-full bg-gray-200" >
              {/*Dang nhap*/}
              <div className="h-8 w-8 rounded-full bg-gray-200" />

            </div>
          </div>
        </div>
      </Container>
    </header>
  )
}
