import React, { useState } from 'react';
import { useGetAllRoomTypesQuery, useUpdateRoomTypeMutation } from '../services/roomType';
import DashboardLayout from '../components/admin/layout/DashboardLayout';
import { BedDouble, Edit3, DollarSign, Users, Expand, Save, X, Info, Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-toastify';

export default function RoomTypeManagePage() {
  const { data: roomTypesResponse, isLoading, isError, refetch } = useGetAllRoomTypesQuery();
  const [updateRoomType, { isLoading: isUpdating }] = useUpdateRoomTypeMutation();

  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    base_price: '',
    capacity_people: '',
    size_m2: ''
  });

  // Images state for Editing
  const [existingImages, setExistingImages] = useState([]);
  const [deletedImageIds, setDeletedImageIds] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);

  const roomTypes = roomTypesResponse?.data || [];

  const handleEditClick = (roomType) => {
    setSelectedRoomType(roomType);
    setFormData({
      name: roomType.name || '',
      description: roomType.description || '',
      base_price: roomType.base_price || '',
      capacity_people: roomType.capacity_people || '',
      size_m2: roomType.size_m2 || ''
    });
    setExistingImages(roomType.images || []);
    setDeletedImageIds([]);
    setNewImageFiles([]);
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDeleteExistingImage = (imageId) => {
    setDeletedImageIds(prev => [...prev, imageId]);
    setExistingImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleNewImagesSelect = (e) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const filesWithPreviews = files.map(file => ({
      file,
      previewUrl: URL.createObjectURL(file)
    }));
    setNewImageFiles(prev => [...prev, ...filesWithPreviews]);
  };

  const handleDeleteNewImage = (indexToRemove) => {
    setNewImageFiles(prev => {
      const target = prev[indexToRemove];
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((_, idx) => idx !== indexToRemove);
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRoomType) return;

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('base_price', formData.base_price);
      data.append('capacity_people', formData.capacity_people);
      data.append('size_m2', formData.size_m2);

      // Append deleted image IDs
      data.append('deleted_image_ids', JSON.stringify(deletedImageIds));

      // Append each new image file
      newImageFiles.forEach(item => {
        data.append('images', item.file);
      });

      await updateRoomType({
        id: selectedRoomType.id,
        data
      }).unwrap();

      toast.success('Cập nhật loại phòng thành công!');
      setIsEditModalOpen(false);

      // Clean up object URLs
      newImageFiles.forEach(item => URL.revokeObjectURL(item.previewUrl));

      refetch();
    } catch (error) {
      toast.error('Lỗi khi cập nhật loại phòng: ' + (error.data?.message || error.message));
    }
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Metrics
  const totalRoomTypes = roomTypes.length;
  const maxPrice = Math.max(...roomTypes.map(rt => Number(rt.base_price) || 0), 0);
  const avgCapacity = roomTypes.length
    ? Math.round(roomTypes.reduce((sum, rt) => sum + (Number(rt.capacity_people) || 0), 0) / roomTypes.length * 10) / 10
    : 0;

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Quản lý Loại Phòng</h2>
            <p className="text-gray-500 text-sm mt-1">Xem danh sách và chỉnh sửa thông tin các loại phòng của khách sạn</p>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <BedDouble size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase">Tổng số loại phòng</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{totalRoomTypes}</h3>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase">Giá cao nhất</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{formatMoney(maxPrice)}</h3>
            </div>
          </div>

        </div>

        {/* Loading / Error States */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium text-sm">Đang tải danh sách loại phòng...</p>
          </div>
        )}

        {isError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-lg mx-auto mt-10">
            <p className="text-red-700 font-semibold mb-2">Đã xảy ra lỗi khi tải dữ liệu!</p>
            <p className="text-xs text-red-500 mb-4">Vui lòng kiểm tra lại kết nối mạng hoặc liên hệ kỹ thuật.</p>
            <button onClick={refetch} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold shadow-sm transition-all">Thử lại</button>
          </div>
        )}

        {/* Main List */}
        {!isLoading && !isError && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {roomTypes.map((roomType) => {
              const image = roomType.images?.[0]?.url;
              return (
                <div key={roomType.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all flex flex-col md:flex-row h-full">
                  {/* Thumbnail */}
                  <div className="w-full md:w-64 h-20 md:h-auto bg-gray-100 relative flex-shrink-0">
                    {image ? (
                      <img src={image} alt={roomType.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold uppercase">
                        {roomType.name?.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <h4 className="font-bold text-lg text-gray-900">{roomType.name}</h4>
                        {/* <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2 py-1 rounded">
                          {roomType.roomClass?.name || 'Class'}
                        </span> */}
                      </div>
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed h-10">
                        {roomType.description || 'Chưa có mô tả cho loại phòng này.'}
                      </p>

                      <div className="grid grid-cols-2 gap-4 mt-4 bg-gray-50/50 border border-gray-100 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-xs text-gray-600 font-semibold">
                          <Users size={16} className="text-gray-400" />
                          <span>Sức chứa: {roomType.capacity_people} khách</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600 font-semibold">
                          <Expand size={16} className="text-gray-400" />
                          <span>Diện tích: {roomType.size_m2} m²</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center gap-4 mt-6 pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold">Giá mỗi đêm</p>
                        <p className="font-bold text-sky-600 text-lg mt-0.5">{formatMoney(roomType.base_price)}</p>
                      </div>
                      <button
                        onClick={() => handleEditClick(roomType)}
                        className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-sm px-4 py-2 rounded-lg transition-all"
                      >
                        <Edit3 size={16} />
                        Chỉnh sửa
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modern Slide-over / Modal for Editing */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)}></div>

            {/* Dialog Panel */}
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 z-10 border border-gray-100 overflow-hidden transform transition-all animate-scaleIn">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-2">
                  <Info className="text-blue-600" size={20} />
                  <h3 className="font-bold text-gray-800 text-base">Chỉnh sửa loại phòng</h3>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleFormSubmit}>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                  {/* Tên loại phòng */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Tên loại phòng</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      placeholder="Nhập tên loại phòng"
                    />
                  </div>

                  {/* Giá và Sức chứa */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Giá cơ bản (VND)</label>
                      <input
                        type="number"
                        name="base_price"
                        required
                        min="0"
                        value={formData.base_price}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                        placeholder="Nhập giá cơ bản"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Sức chứa (Khách)</label>
                      <input
                        type="number"
                        name="capacity_people"
                        required
                        min="1"
                        value={formData.capacity_people}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                        placeholder="Nhập số khách"
                      />
                    </div>
                  </div>

                  {/* Diện tích */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Diện tích (m²)</label>
                    <input
                      type="number"
                      name="size_m2"
                      required
                      min="1"
                      value={formData.size_m2}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      placeholder="Nhập diện tích"
                    />
                  </div>

                  {/* Quản lý Hình ảnh (Upload & Delete) */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Hình ảnh loại phòng</label>

                    {/* Grid ảnh hiện có & ảnh mới chuẩn bị upload */}
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      {/* Ảnh hiện có */}
                      {existingImages.map((img) => (
                        <div key={img.id} className="relative w-full h-24 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm group">
                          <img src={img.url} alt="Room" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleDeleteExistingImage(img.id)}
                            className="absolute top-1 right-1 bg-red-600/90 text-white rounded-full p-1 hover:bg-red-700 hover:scale-110 shadow transition-all"
                            title="Xóa ảnh này"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}

                      {/* Ảnh mới chuẩn bị upload */}
                      {newImageFiles.map((item, index) => (
                        <div key={index} className="relative w-full h-24 bg-gray-100 rounded-lg overflow-hidden border border-indigo-200 shadow-sm">
                          <img src={item.previewUrl} alt="New Preview" className="w-full h-full object-cover" />
                          <div className="absolute bottom-1 left-1 bg-indigo-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow">
                            MỚI
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteNewImage(index)}
                            className="absolute top-1 right-1 bg-red-600/90 text-white rounded-full p-1 hover:bg-red-700 hover:scale-110 shadow transition-all"
                            title="Hủy chọn"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}

                      {/* Khu vực upload ảnh mới */}
                      <label className="w-full h-24 bg-gray-50 hover:bg-gray-100 border-2 border-dashed border-gray-200 hover:border-blue-400 rounded-lg cursor-pointer flex flex-col items-center justify-center gap-1 transition-all group">
                        <Upload size={20} className="text-gray-400 group-hover:text-blue-500 transition-all" />
                        <span className="text-[10px] font-bold text-gray-500 group-hover:text-blue-500">Tải ảnh lên</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleNewImagesSelect}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Mô tả chi tiết */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Mô tả chi tiết</label>
                    <textarea
                      name="description"
                      rows="3"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                      placeholder="Nhập mô tả chi tiết loại phòng..."
                    ></textarea>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition-all"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm shadow-blue-200 transition-all disabled:bg-blue-400"
                  >
                    {isUpdating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Lưu thay đổi
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
