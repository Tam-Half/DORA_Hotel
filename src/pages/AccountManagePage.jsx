import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/admin/layout/DashboardLayout';
import userAPI from '../services/user';
import { 
  Users, 
  UserPlus, 
  Edit2, 
  Key, 
  Search, 
  X, 
  Save, 
  Mail, 
  Phone, 
  Shield, 
  CheckCircle, 
  XCircle,
  Lock,
  UserCheck
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function AccountManagePage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal control states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Selected item for Edit / Reset Password
  const [selectedUser, setSelectedUser] = useState(null);

  // Form states
  const [createFormData, setCreateFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone_number: '',
    role: 'staff'
  });

  const [editFormData, setEditFormData] = useState({
    name: '',
    phone_number: '',
    email: '',
    role: 'staff',
    is_active: true
  });

  const [passwordFormData, setPasswordFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  // Fetch accounts from API
  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      const data = await userAPI.getAdminAccounts();
      setUsers(data || []);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách tài khoản: ' + (error.message || error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // Handlers for Create Form
  const handleCreateInputChange = (e) => {
    const { name, value } = e.target;
    setCreateFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (createFormData.password !== createFormData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không trùng khớp!');
      return;
    }

    try {
      await userAPI.create({
        username: createFormData.username,
        email: createFormData.email,
        password: createFormData.password,
        name: createFormData.name,
        phone_number: createFormData.phone_number,
        role: createFormData.role
      });
      toast.success('Tạo tài khoản nhân viên thành công!');
      setIsCreateModalOpen(false);
      setCreateFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        phone_number: '',
        role: 'staff'
      });
      fetchAccounts();
    } catch (error) {
      toast.error('Lỗi khi tạo tài khoản: ' + (error.message || error));
    }
  };

  // Handlers for Edit Form
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name || '',
      phone_number: user.phone_number || '',
      email: user.account?.email || '',
      role: user.account?.role || 'staff',
      is_active: user.account?.is_active ?? true
    });
    setIsEditModalOpen(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ 
      ...prev, 
      [name]: name === 'is_active' ? value === 'true' : value 
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      await userAPI.updateAdminAccount(selectedUser.id, editFormData);
      toast.success('Cập nhật thông tin tài khoản thành công!');
      setIsEditModalOpen(false);
      fetchAccounts();
    } catch (error) {
      toast.error('Lỗi khi cập nhật tài khoản: ' + (error.message || error));
    }
  };

  // Handlers for Password Reset Form
  const handlePasswordClick = (user) => {
    setSelectedUser(user);
    setPasswordFormData({
      newPassword: '',
      confirmPassword: ''
    });
    setIsPasswordModalOpen(true);
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không trùng khớp!');
      return;
    }
    if (passwordFormData.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải tối thiểu 6 ký tự!');
      return;
    }

    try {
      await userAPI.resetAdminAccountPassword(selectedUser.id, {
        newPassword: passwordFormData.newPassword
      });
      toast.success('Đặt lại mật khẩu thành công!');
      setIsPasswordModalOpen(false);
    } catch (error) {
      toast.error('Lỗi khi đổi mật khẩu: ' + (error.message || error));
    }
  };

  // Filter and Search logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.account?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.account?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone_number?.includes(searchTerm);

    const matchesRole = roleFilter === '' || user.account?.role === roleFilter;
    
    const matchesStatus = statusFilter === '' || 
      (statusFilter === 'active' ? user.account?.is_active === true : user.account?.is_active === false);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Metric stats
  const totalAccounts = users.length;
  const staffAccounts = users.filter(u => u.account?.role === 'staff').length;
  const activeAccounts = users.filter(u => u.account?.is_active).length;

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 font-sans">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
              <Users className="text-blue-600" size={28} />
              Quản lý Tài khoản Nhân viên
            </h2>
            <p className="text-gray-500 text-sm mt-1">Xem, chỉnh sửa, tạo mới và quản lý mật khẩu của các tài khoản trong hệ thống</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-sm shadow-blue-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <UserPlus size={18} />
            Thêm nhân viên
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Users size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tổng số tài khoản</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{totalAccounts}</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
              <UserCheck size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tài khoản Nhân viên (Staff)</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{staffAccounts}</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Đang hoạt động</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{activeAccounts}</h3>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm theo họ tên, email, sđt..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder-gray-400"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all text-gray-600 bg-white"
            >
              <option value="">Tất cả Vai trò</option>
              <option value="admin">Quản trị viên (Admin)</option>
              <option value="staff">Nhân viên (Staff)</option>
              <option value="user">Khách hàng (User)</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all text-gray-600 bg-white"
            >
              <option value="">Tất cả Trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Tạm khóa</option>
            </select>
          </div>
        </div>

        {/* Main Accounts Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 font-medium text-sm">Đang tải danh sách tài khoản...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-16">
              <Users className="mx-auto text-gray-300 mb-3" size={48} />
              <p className="text-gray-500 font-semibold text-base">Không tìm thấy tài khoản nào</p>
              <p className="text-gray-400 text-xs mt-1">Hãy thử đổi từ khóa tìm kiếm hoặc bộ lọc.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Họ và tên / Username</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Liên hệ</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Vai trò</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Trạng thái</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredUsers.map((user) => {
                    const firstChar = user.name?.charAt(0)?.toUpperCase() || 'U';
                    const role = user.account?.role || 'user';
                    const isActive = user.account?.is_active;

                    return (
                      <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                        
                        {/* Name and Username */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                              {firstChar}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
                              <p className="text-gray-400 text-xs mt-0.5">@{user.account?.username || 'no-username'}</p>
                            </div>
                          </div>
                        </td>

                        {/* Contact details */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <Mail size={14} className="text-gray-400" />
                              <span>{user.account?.email || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <Phone size={14} className="text-gray-400" />
                              <span>{user.phone_number || 'N/A'}</span>
                            </div>
                          </div>
                        </td>

                        {/* Role Badge */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {role === 'admin' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100">
                              <Shield size={12} />
                              Admin
                            </span>
                          )}
                          {role === 'staff' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-600 border border-teal-100">
                              Nhân viên
                            </span>
                          )}
                          {role === 'user' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
                              Khách hàng
                            </span>
                          )}
                        </td>

                        {/* Status Badge */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isActive ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold bg-green-50 text-green-700">
                              <CheckCircle size={12} />
                              Hoạt động
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold bg-red-50 text-red-600">
                              <XCircle size={12} />
                              Tạm khóa
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEditClick(user)}
                              className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all"
                              title="Sửa thông tin"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handlePasswordClick(user)}
                              className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-lg transition-all"
                              title="Đổi mật khẩu"
                            >
                              <Key size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal: CREATE ACCOUNT */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCreateModalOpen(false)}></div>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 z-10 border border-gray-100 overflow-hidden transform transition-all animate-scaleIn">
              
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-2 text-blue-600">
                  <UserPlus size={20} />
                  <h3 className="font-bold text-gray-800 text-base">Thêm tài khoản nhân viên mới</h3>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit}>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                  
                  {/* Họ tên */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Họ và tên</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={createFormData.name}
                      onChange={handleCreateInputChange}
                      placeholder="Nhập họ và tên"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>

                  {/* SĐT & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Số điện thoại</label>
                      <input
                        type="tel"
                        name="phone_number"
                        required
                        value={createFormData.phone_number}
                        onChange={handleCreateInputChange}
                        placeholder="Nhập số điện thoại"
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Email</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={createFormData.email}
                        onChange={handleCreateInputChange}
                        placeholder="Nhập địa chỉ email"
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                  </div>

                  {/* Username & Vai trò */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Tên đăng nhập (Username)</label>
                      <input
                        type="text"
                        name="username"
                        required
                        value={createFormData.username}
                        onChange={handleCreateInputChange}
                        placeholder="Tên đăng nhập"
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Vai trò</label>
                      <select
                        name="role"
                        value={createFormData.role}
                        onChange={handleCreateInputChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all text-gray-600 bg-white"
                      >
                        <option value="staff">Nhân viên (Staff)</option>
                        <option value="admin">Quản trị viên (Admin)</option>
                      </select>
                    </div>
                  </div>

                  {/* Password & Confirm */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Mật khẩu</label>
                      <input
                        type="password"
                        name="password"
                        required
                        minLength="6"
                        value={createFormData.password}
                        onChange={handleCreateInputChange}
                        placeholder="Nhập mật khẩu"
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Xác nhận mật khẩu</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        required
                        value={createFormData.confirmPassword}
                        onChange={handleCreateInputChange}
                        placeholder="Nhập lại mật khẩu"
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                  </div>

                </div>

                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-all"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all"
                  >
                    <Save size={16} />
                    Tạo tài khoản
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* Modal: EDIT ACCOUNT */}
        {isEditModalOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)}></div>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 z-10 border border-gray-100 overflow-hidden transform transition-all animate-scaleIn">
              
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-2 text-blue-600">
                  <Edit2 size={20} />
                  <h3 className="font-bold text-gray-800 text-base">Chỉnh sửa tài khoản</h3>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleEditSubmit}>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                  
                  {/* Họ tên */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Họ và tên</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={editFormData.name}
                      onChange={handleEditInputChange}
                      placeholder="Nhập họ và tên"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>

                  {/* SĐT & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Số điện thoại</label>
                      <input
                        type="tel"
                        name="phone_number"
                        required
                        value={editFormData.phone_number}
                        onChange={handleEditInputChange}
                        placeholder="Nhập số điện thoại"
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Email</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={editFormData.email}
                        onChange={handleEditInputChange}
                        placeholder="Nhập địa chỉ email"
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                  </div>

                  {/* Vai trò & Trạng thái */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Vai trò</label>
                      <select
                        name="role"
                        value={editFormData.role}
                        onChange={handleEditInputChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all text-gray-600 bg-white"
                      >
                        <option value="staff">Nhân viên (Staff)</option>
                        <option value="admin">Quản trị viên (Admin)</option>
                        <option value="user">Khách hàng (User)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Trạng thái hoạt động</label>
                      <select
                        name="is_active"
                        value={editFormData.is_active ? "true" : "false"}
                        onChange={handleEditInputChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all text-gray-600 bg-white"
                      >
                        <option value="true">Đang hoạt động</option>
                        <option value="false">Tạm khóa</option>
                      </select>
                    </div>
                  </div>

                </div>

                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-all"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all"
                  >
                    <Save size={16} />
                    Lưu thay đổi
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* Modal: RESET PASSWORD */}
        {isPasswordModalOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsPasswordModalOpen(false)}></div>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 z-10 border border-gray-100 overflow-hidden transform transition-all animate-scaleIn">
              
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-2 text-amber-600">
                  <Lock size={20} />
                  <h3 className="font-bold text-gray-800 text-base">Đặt lại mật khẩu</h3>
                </div>
                <button
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handlePasswordSubmit}>
                <div className="p-6 space-y-4">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Bạn đang đặt lại mật khẩu cho tài khoản <strong className="text-gray-800">@{selectedUser.account?.username}</strong> ({selectedUser.name}).
                  </p>
                  
                  {/* Mật khẩu mới */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Mật khẩu mới</label>
                    <input
                      type="password"
                      name="newPassword"
                      required
                      minLength="6"
                      value={passwordFormData.newPassword}
                      onChange={handlePasswordInputChange}
                      placeholder="Tối thiểu 6 ký tự"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>

                  {/* Nhập lại mật khẩu */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Nhập lại mật khẩu mới</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      value={passwordFormData.confirmPassword}
                      onChange={handlePasswordInputChange}
                      placeholder="Nhập lại mật khẩu"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>

                </div>

                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
                  <button
                    type="button"
                    onClick={() => setIsPasswordModalOpen(false)}
                    className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-all"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all"
                  >
                    <Save size={16} />
                    Đặt lại
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
