// File: src/utils/exportTaxReport.js
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export const exportTaxReportToExcel = async (data, period) => {
  // 1. Khởi tạo Workbook và Worksheet
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Bao_Cao_Doanh_Thu', {
    pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true } // Chuẩn in A4 ngang
  });

  // 2. Thiết lập Header Công ty & Tiêu đề báo cáo
  sheet.mergeCells('A1:C1');
  sheet.getCell('A1').value = 'KHACH SAN DORA';
  sheet.getCell('A1').font = { bold: true, size: 12 };

  sheet.mergeCells('A2:C2');
  sheet.getCell('A2').value = 'Mã số thuế: 0123456789';
  sheet.getCell('A2').font = { italic: true, size: 11 };

  sheet.mergeCells('A4:H4');
  const titleCell = sheet.getCell('A4');
  titleCell.value = 'BÁO CÁO DOANH THU BÁN HÀNG VÀ CUNG CẤP DỊCH VỤ';
  titleCell.font = { bold: true, size: 16 };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

  sheet.mergeCells('A5:H5');
  const periodCell = sheet.getCell('A5');
  periodCell.value = `Kỳ báo cáo: ${period}`;
  periodCell.font = { italic: true, size: 11 };
  periodCell.alignment = { horizontal: 'center', vertical: 'middle' };

  // 3. Tạo dòng Tiêu đề bảng (Row 7)
  const headerRow = sheet.getRow(7);
  headerRow.values = [
    'STT', 
    'Mã Giao Dịch', 
    'Ngày Ghi Nhận', 
    'Tên Khách Hàng / Dịch Vụ', 
    'Doanh Thu (Chưa Thuế)', 
    'Thuế VAT (8%)', 
    'Tổng Thanh Toán', 
    'Ghi Chú'
  ];
  
  // Style cho Header của bảng
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F4C81' } }; // Màu xanh đậm
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = {
      top: { style: 'thin' }, left: { style: 'thin' },
      bottom: { style: 'thin' }, right: { style: 'thin' }
    };
  });
  headerRow.height = 25;

  // 4. Định dạng chiều rộng cột
  sheet.columns = [
    { key: 'stt', width: 6 },
    { key: 'code', width: 15 },
    { key: 'date', width: 15 },
    { key: 'name', width: 35 },
    { key: 'revenue', width: 22 },
    { key: 'vat', width: 20 },
    { key: 'total', width: 22 },
    { key: 'note', width: 20 },
  ];

  // 5. Đổ dữ liệu vào bảng
  let currentRow = 8;
  let sumRevenue = 0;
  let sumVat = 0;
  let sumTotal = 0;

  data.forEach((item, index) => {
    const row = sheet.getRow(currentRow);
    // Tính toán giả lập cho VAT (Nếu DB có sẵn thì dùng giá trị thật)
    const vat = item.revenue * 0.08; 
    const total = item.revenue + vat;

    row.values = [
      index + 1,
      item.code || `GD${1000 + index}`,
      item.date || new Date().toLocaleDateString('vi-VN'),
      item.name || 'Khách vãng lai',
      item.revenue,
      vat,
      total,
      item.note || ''
    ];

    // Định dạng số tiền (Có dấu phẩy, đuôi đ)
    row.getCell(5).numFmt = '#,##0"đ"';
    row.getCell(6).numFmt = '#,##0"đ"';
    row.getCell(7).numFmt = '#,##0"đ"';

    // Căn giữa STT và Mã
    row.getCell(1).alignment = { horizontal: 'center' };
    row.getCell(2).alignment = { horizontal: 'center' };
    row.getCell(3).alignment = { horizontal: 'center' };

    // Thêm viền
    row.eachCell((cell) => {
      cell.border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
    });

    sumRevenue += item.revenue;
    sumVat += vat;
    sumTotal += total;
    currentRow++;
  });

  // 6. Dòng Tổng cộng
  const totalRow = sheet.getRow(currentRow);
  sheet.mergeCells(`A${currentRow}:D${currentRow}`);
  totalRow.getCell(1).value = 'TỔNG CỘNG';
  totalRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
  totalRow.getCell(1).font = { bold: true };
  
  totalRow.getCell(5).value = sumRevenue;
  totalRow.getCell(6).value = sumVat;
  totalRow.getCell(7).value = sumTotal;
  
  [5, 6, 7].forEach(colIndex => {
    totalRow.getCell(colIndex).font = { bold: true };
    totalRow.getCell(colIndex).numFmt = '#,##0"đ"';
  });

  totalRow.eachCell((cell, colNumber) => {
    if(colNumber <= 7) {
      cell.border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } };
    }
  });

  // 7. Khu vực Ký tên (Chữ ký kế toán, giám đốc)
  currentRow += 3;
  const dateRow = sheet.getRow(currentRow);
  sheet.mergeCells(`F${currentRow}:H${currentRow}`);
  dateRow.getCell(6).value = `Ngày ${new Date().getDate()} tháng ${new Date().getMonth() + 1} năm ${new Date().getFullYear()}`;
  dateRow.getCell(6).alignment = { horizontal: 'center' };
  dateRow.getCell(6).font = { italic: true };

  currentRow += 1;
  const signRowTitle = sheet.getRow(currentRow);
  signRowTitle.getCell(2).value = 'Người lập biểu';
  signRowTitle.getCell(4).value = 'Kế toán trưởng';
  
  sheet.mergeCells(`F${currentRow}:H${currentRow}`);
  signRowTitle.getCell(6).value = 'Giám đốc';

  signRowTitle.getCell(2).font = { bold: true };
  signRowTitle.getCell(4).font = { bold: true };
  signRowTitle.getCell(6).font = { bold: true };
  
  signRowTitle.getCell(2).alignment = { horizontal: 'center' };
  signRowTitle.getCell(4).alignment = { horizontal: 'center' };
  signRowTitle.getCell(6).alignment = { horizontal: 'center' };

  currentRow += 1;
  const signRowNote = sheet.getRow(currentRow);
  signRowNote.getCell(2).value = '(Ký, họ tên)';
  signRowNote.getCell(4).value = '(Ký, họ tên)';
  
  sheet.mergeCells(`F${currentRow}:H${currentRow}`);
  signRowNote.getCell(6).value = '(Ký, đóng dấu, họ tên)';

  signRowNote.getCell(2).font = { italic: true, size: 10 };
  signRowNote.getCell(4).font = { italic: true, size: 10 };
  signRowNote.getCell(6).font = { italic: true, size: 10 };
  
  signRowNote.getCell(2).alignment = { horizontal: 'center' };
  signRowNote.getCell(4).alignment = { horizontal: 'center' };
  signRowNote.getCell(6).alignment = { horizontal: 'center' };

  // 8. Lưu file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `Bao_Cao_Doanh_Thu_Thue_${new Date().getTime()}.xlsx`);
};