import Container from "./Container"

export default function Footer() {
  return (
    <footer className="mt-20 border-t bg-gray-50">
      <Container>
        <div className="flex flex-col gap-4 py-6 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">
          <p>© 2024 TravelBook Inc. All rights reserved.</p>

          <div className="flex gap-6">
            <a href="#" className="hover:text-blue-600">Quyền riêng tư</a>
            <a href="#" className="hover:text-blue-600">Điều khoản</a>
            <a href="#" className="hover:text-blue-600">Sơ đồ trang</a>
          </div>
        </div>
      </Container>
    </footer>
  )
}
