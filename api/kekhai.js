const express = require("express");
const router = express.Router();
const { pool } = require("../database/dbinfo");
const {
  Table,
  NVarChar,
  Int,
  Float,
  Transaction,
  Bit,
  Date,
  DateTime,
} = require("mssql");

// add ke khai chạy lẻ từng dòng
router.post("/add-kekhai", async (req, res) => {
  try {
    await pool.connect();
    // Tạo số hồ sơ duy nhất
    const maxSoHoSoResult = await pool
      .request()
      .query("SELECT MAX(_id) as max_so_ho_so FROM kekhai");
    const newSoHoSo = (maxSoHoSoResult.recordset[0].max_so_ho_so || 0) + 1;
    const soHoso =
      newSoHoSo + "/" + req.body.nvt_masobhxh + "/" + req.body.nvt_cccd;

    const result = await pool
      .request()
      .input("sohoso", soHoso)
      .input("matochuc", req.body.matochuc)
      .input("tentochuc", req.body.tentochuc)
      .input("madaily", req.body.madaily)
      .input("tendaily", req.body.tendaily)
      .input("maloaihinh", req.body.maloaihinh)
      .input("tenloaihinh", req.body.tenloaihinh)
      .input("hoten", req.body.hoten)
      .input("masobhxh", req.body.masobhxh)
      .input("cccd", req.body.cccd)
      .input("dienthoai", req.body.dienthoai)
      .input("maphuongan", req.body.maphuongan)
      .input("tenphuongan", req.body.tenphuongan)
      .input("ngaysinh", req.body.ngaysinh)
      .input("gioitinh", req.body.gioitinh)
      .input("nguoithu", req.body.nguoithu)
      .input("tienluongcs", req.body.tienluongcs)
      .input("sotien", req.body.sotien)
      .input("tylengansachdiaphuong", req.body.tylengansachdiaphuong)
      .input("hotrokhac", req.body.hotrokhac)
      .input("tungay", req.body.tungay)
      .input("tyledong", req.body.tyledong)
      .input("muctiendong", req.body.muctiendong)
      .input("maphuongthucdong", req.body.maphuongthucdong)
      .input("tenphuongthucdong", req.body.tenphuongthucdong)
      .input("tuthang", req.body.tuthang)
      .input("tientunguyendong", req.body.tientunguyendong)
      .input("tienlai", req.body.tienlai)
      .input("madoituong", req.body.madoituong)
      .input("tendoituong", req.body.tendoituong)
      .input("tylensnnht", req.body.tylensnnht)
      .input("tiennsnnht", req.body.tiennsnnht)
      .input("tylensdp", req.body.tylensdp)
      .input("tiennsdp", req.body.tiennsdp)
      .input("matinh", req.body.matinh)
      .input("tentinh", req.body.tentinh)
      .input("maquanhuyen", req.body.maquanhuyen)
      .input("tenquanhuyen", req.body.tenquanhuyen)
      .input("maxaphuong", req.body.maxaphuong)
      .input("tenxaphuong", req.body.tenxaphuong)
      .input("benhvientinh", req.body.benhvientinh)
      .input("mabenhvien", req.body.mabenhvien)
      .input("tenbenhvien", req.body.tenbenhvien)
      .input("tothon", req.body.tothon)
      .input("ghichu", req.body.ghichu)
      .input("createdAt", req.body.createdAt)
      .input("createdBy", req.body.createdBy)
      .input("updatedAt", req.body.updatedAt)
      .input("updatedBy", req.body.updatedBy)
      .input("dotkekhai", newSoHoSo)
      .input("kykekhai", req.body.kykekhai)
      .input("ngaykekhai", req.body.ngaykekhai)
      .input("trangthai", req.body.trangthai).query(`
                  INSERT INTO kekhai (sohoso, matochuc, tentochuc, madaily, tendaily, maloaihinh, tenloaihinh, hoten, masobhxh, cccd, dienthoai,	
                    maphuongan, tenphuongan, ngaysinh, gioitinh, nguoithu, tienluongcs, sotien,	
                    tylengansachdiaphuong, hotrokhac, tungay, tyledong, muctiendong,	
                    maphuongthucdong, tenphuongthucdong, tuthang, tientunguyendong, tienlai, madoituong,	
                    tendoituong, tylensnnht, tiennsnnht, tylensdp, tiennsdp, matinh, tentinh, maquanhuyen, tenquanhuyen,	
                    maxaphuong, tenxaphuong, benhvientinh, mabenhvien, tenbenhvien, tothon, ghichu,	
                    createdAt, createdBy, updatedAt, updatedBy, dotkekhai, kykekhai, ngaykekhai, trangthai) 
                  VALUES (@sohoso, @matochuc, @tentochuc, @madaily, @tendaily, @maloaihinh, @tenloaihinh, @hoten, @masobhxh, @cccd, @dienthoai,	
                    @maphuongan, @tenphuongan, @ngaysinh, @gioitinh, @nguoithu, @tienluongcs, @sotien,	
                    @tylengansachdiaphuong, @hotrokhac, @tungay, @tyledong, @muctiendong,	
                    @maphuongthucdong, @tenphuongthucdong, @tuthang, @tientunguyendong, @tienlai, @madoituong,	
                    @tendoituong, @tylensnnht, @tiennsnnht, @tylensdp, @tiennsdp, @matinh, @tentinh, @maquanhuyen, @tenquanhuyen,	
                    @maxaphuong, @tenxaphuong, @benhvientinh, @mabenhvien, @tenbenhvien, @tothon, @ghichu,	
                    @createdAt, @createdBy, @updatedAt, @updatedBy, @dotkekhai, @kykekhai, @ngaykekhai, @trangthai);
              `);
    const kekhai = req.body;
    res.json(kekhai);
  } catch (error) {
    res.status(500).json(error);
  }
});

// // add ke khai chạy theo bộ
// router.post("/add-kekhai-series", async (req, res) => {
//   let dataKekhai = req.body;
//   let transaction = null;
//   const listSuccess = [];
//   const listFailed = [];

//   try {
//     // bắt đầu kết nối
//     await pool.connect();
//     // Bắt đầu giao dịch
//     transaction = new Transaction(pool);
//     await transaction.begin();

//     // Lấy số hồ sơ lớn nhất hiện tại để tạo số hồ sơ duy nhất
//     const maxSoHoSoResult = await pool
//       .request()
//       .query("SELECT MAX(_id) as max_so_ho_so FROM kekhai");
//     let maxSohoso = maxSoHoSoResult.recordset[0].max_so_ho_so || 0;

//     for (const item of dataKekhai) {
//       // Tạo số hồ sơ mới
//       const newSoHoSo = maxSohoso + 1;
//       const soHoso = `${newSoHoSo}/${item.nvt_masobhxh}/${item.nvt_cccd}`;

//       const result = await transaction
//         .request()
//         .input("sohoso", soHoso)
//         .input("matochuc", item.matochuc)
//         .input("tentochuc", item.tentochuc)
//         .input("madaily", item.madaily)
//         .input("tendaily", item.tendaily)
//         .input("maloaihinh", item.maloaihinh)
//         .input("tenloaihinh", item.tenloaihinh)
//         .input("hoten", item.hoten)
//         .input("masobhxh", item.masobhxh)
//         .input("cccd", item.cccd)
//         .input("dienthoai", item.dienthoai)
//         .input("maphuongan", item.maphuongan)
//         .input("tenphuongan", item.tenphuongan)
//         .input("ngaysinh", item.ngaysinh)
//         .input("gioitinh", item.gioitinh)
//         .input("nguoithu", item.nguoithu)
//         .input("tienluongcs", item.tienluongcs)
//         .input("sotien", item.sotien)
//         .input("tylengansachdiaphuong", item.tylengansachdiaphuong)
//         .input("hotrokhac", item.hotrokhac)
//         .input("tungay", item.tungay)
//         .input("tyledong", item.tyledong)
//         .input("muctiendong", item.muctiendong)
//         .input("maphuongthucdong", item.maphuongthucdong)
//         .input("tenphuongthucdong", item.tenphuongthucdong)
//         .input("tuthang", item.tuthang)
//         .input("tientunguyendong", item.tientunguyendong)
//         .input("tienlai", item.tienlai)
//         .input("madoituong", item.madoituong)
//         .input("tendoituong", item.tendoituong)
//         .input("tylensnnht", item.tylensnnht)
//         .input("tiennsnnht", item.tiennsnnht)
//         .input("tylensdp", item.tylensdp)
//         .input("tiennsdp", item.tiennsdp)
//         .input("matinh", item.matinh)
//         .input("tentinh", item.tentinh)
//         .input("maquanhuyen", item.maquanhuyen)
//         .input("tenquanhuyen", item.tenquanhuyen)
//         .input("maxaphuong", item.maxaphuong)
//         .input("tenxaphuong", item.tenxaphuong)
//         .input("benhvientinh", item.benhvientinh)
//         .input("mabenhvien", item.mabenhvien)
//         .input("tenbenhvien", item.tenbenhvien)
//         .input("tothon", item.tothon)
//         .input("ghichu", item.ghichu)
//         .input("createdAt", item.createdAt)
//         .input("createdBy", item.createdBy)
//         .input("updatedAt", item.updatedAt)
//         .input("updatedBy", item.updatedBy)
//         .input("dotkekhai", newSoHoSo)
//         .input("kykekhai", item.kykekhai)
//         .input("ngaykekhai", item.ngaykekhai)
//         .input("ngaybienlai", item.ngaybienlai)
//         .input("sobienlai", item.sobienlai)
//         .input("trangthai", item.trangthai).query(`
//                   INSERT INTO kekhai (sohoso, matochuc, tentochuc, madaily, tendaily, maloaihinh, tenloaihinh, hoten, masobhxh, cccd, dienthoai,
//                     maphuongan, tenphuongan, ngaysinh, gioitinh, nguoithu, tienluongcs, sotien,
//                     tylengansachdiaphuong, hotrokhac, tungay, tyledong, muctiendong,
//                     maphuongthucdong, tenphuongthucdong, tuthang, tientunguyendong, tienlai, madoituong,
//                     tendoituong, tylensnnht, tiennsnnht, tylensdp, tiennsdp, matinh, tentinh, maquanhuyen, tenquanhuyen,
//                     maxaphuong, tenxaphuong, benhvientinh, mabenhvien, tenbenhvien, tothon, ghichu,
//                     createdAt, createdBy, updatedAt, updatedBy, dotkekhai, kykekhai, ngaykekhai, ngaybienlai, sobienlai, trangthai)
//                   VALUES (@sohoso, @matochuc, @tentochuc, @madaily, @tendaily, @maloaihinh, @tenloaihinh, @hoten, @masobhxh, @cccd, @dienthoai,
//                     @maphuongan, @tenphuongan, @ngaysinh, @gioitinh, @nguoithu, @tienluongcs, @sotien,
//                     @tylengansachdiaphuong, @hotrokhac, @tungay, @tyledong, @muctiendong,
//                     @maphuongthucdong, @tenphuongthucdong, @tuthang, @tientunguyendong, @tienlai, @madoituong,
//                     @tendoituong, @tylensnnht, @tiennsnnht, @tylensdp, @tiennsdp, @matinh, @tentinh, @maquanhuyen, @tenquanhuyen,
//                     @maxaphuong, @tenxaphuong, @benhvientinh, @mabenhvien, @tenbenhvien, @tothon, @ghichu,
//                     @createdAt, @createdBy, @updatedAt, @updatedBy, @dotkekhai, @kykekhai, @ngaykekhai, @ngaybienlai, @sobienlai, @trangthai);
//               `);

//       // Lưu thông tin cần thiết vào danh sách
//       listSuccess.push({
//         sohoso: soHoso,
//         dotkekhai: newSoHoSo,
//         kykekhai: item.kykekhai,
//         ngaykekhai: item.ngaykekhai,
//         trangthai: item.trangthai,
//         hoten: item.hoten,
//         masobhxh: item.masobhxh,
//         cccd: item.cccd,
//         dienthoai: item.dienthoai,
//       });
//     }

//     // Nếu thành công, hoàn thành giao dịch
//     await transaction.commit();
//     res.json({
//       success: true,
//       message: "Data inserted successfully",
//       data: listSuccess,
//     });
//   } catch (error) {
//     // Nếu có lỗi, hoàn tác giao dịch
//     if (transaction) {
//       await transaction.rollback();
//     }

//     res.status(500).json({
//       status: "error",
//       error: error.message,
//     });
//   } finally {
//     if (pool.connected) {
//       await pool.close(); // Đóng kết nối
//     }
//   }
// });

// add ke khai chạy theo bộ
router.post("/add-kekhai-series", async (req, res) => {
  let dataKekhai = req.body;
  let transaction = null;
  const listSuccess = [];
  const listFailed = [];

  try {
    // bắt đầu kết nối
    await pool.connect();

    // Lấy số hồ sơ lớn nhất hiện tại để tạo số hồ sơ duy nhất
    const maxSoHoSoResult = await pool
      .request()
      .query("SELECT MAX(_id) as max_so_ho_so FROM kekhai");
    let maxSohoso = maxSoHoSoResult.recordset[0].max_so_ho_so || 0;

    for (const item of dataKekhai) {
      // Tạo số hồ sơ mới
      const newSoHoSo = maxSohoso + 1;
      const soHoso = `${newSoHoSo}/${item.nvt_masobhxh}/${item.nvt_cccd}`;

      try {
        // Bắt đầu giao dịch
        transaction = new Transaction(pool);
        await transaction.begin();
        await transaction
          .request()
          .input("sohoso", soHoso)
          .input("matochuc", item.matochuc)
          .input("tentochuc", item.tentochuc)
          .input("madaily", item.madaily)
          .input("tendaily", item.tendaily)
          .input("maloaihinh", item.maloaihinh)
          .input("tenloaihinh", item.tenloaihinh)
          .input("hoten", item.hoten)
          .input("masobhxh", item.masobhxh)
          .input("cccd", item.cccd)
          .input("dienthoai", item.dienthoai)
          .input("maphuongan", item.maphuongan)
          .input("tenphuongan", item.tenphuongan)
          .input("ngaysinh", item.ngaysinh)
          .input("gioitinh", item.gioitinh)
          .input("nguoithu", item.nguoithu)
          .input("tienluongcs", item.tienluongcs)
          .input("sotien", item.sotien)
          .input("tylengansachdiaphuong", item.tylengansachdiaphuong)
          .input("hotrokhac", item.hotrokhac)
          .input("tungay", item.tungay)
          .input("denngay", item.denngay)
          .input("tyledong", item.tyledong)
          .input("muctiendong", item.muctiendong)
          .input("maphuongthucdong", item.maphuongthucdong)
          .input("tenphuongthucdong", item.tenphuongthucdong)
          .input("tuthang", item.tuthang)
          .input("denthang", item.denthang)
          .input("tientunguyendong", item.tientunguyendong)
          .input("tienlai", item.tienlai)
          .input("madoituong", item.madoituong)
          .input("tendoituong", item.tendoituong)
          .input("tylensnnht", item.tylensnnht)
          .input("tiennsnnht", item.tiennsnnht)
          .input("tylensdp", item.tylensdp)
          .input("tiennsdp", item.tiennsdp)
          .input("matinh", item.matinh)
          .input("tentinh", item.tentinh)
          .input("maquanhuyen", item.maquanhuyen)
          .input("tenquanhuyen", item.tenquanhuyen)
          .input("maxaphuong", item.maxaphuong)
          .input("tenxaphuong", item.tenxaphuong)
          .input("benhvientinh", item.benhvientinh)
          .input("mabenhvien", item.mabenhvien)
          .input("tenbenhvien", item.tenbenhvien)
          .input("tothon", item.tothon)
          .input("ghichu", item.ghichu)
          .input("createdAt", item.createdAt)
          .input("createdBy", item.createdBy)
          .input("updatedAt", item.updatedAt)
          .input("updatedBy", item.updatedBy)
          .input("dotkekhai", newSoHoSo)
          .input("kykekhai", item.kykekhai)
          .input("ngaykekhai", item.ngaykekhai)
          .input("ngaybienlai", item.ngaybienlai)
          .input("sobienlai", item.sobienlai)
          .input("trangthai", item.trangthai)
          .input("hosoIdentity", item.hosoIdentity)
          .input("tennguoitao", item.tennguoitao)
          .input("hinhthucnap", item.hinhthucnap).query(`
                  INSERT INTO kekhai (sohoso, matochuc, tentochuc, madaily, tendaily, maloaihinh, tenloaihinh, hoten, masobhxh, cccd, dienthoai,	
                    maphuongan, tenphuongan, ngaysinh, gioitinh, nguoithu, tienluongcs, sotien,	
                    tylengansachdiaphuong, hotrokhac, tungay, denngay, tyledong, muctiendong,	
                    maphuongthucdong, tenphuongthucdong, tuthang, denthang, tientunguyendong, tienlai, madoituong,	
                    tendoituong, tylensnnht, tiennsnnht, tylensdp, tiennsdp, matinh, tentinh, maquanhuyen, tenquanhuyen,	
                    maxaphuong, tenxaphuong, benhvientinh, mabenhvien, tenbenhvien, tothon, ghichu,	
                    createdAt, createdBy, updatedAt, updatedBy, dotkekhai, kykekhai, ngaykekhai, ngaybienlai, sobienlai, trangthai, hosoIdentity, tennguoitao, hinhthucnap) 
                  VALUES (@sohoso, @matochuc, @tentochuc, @madaily, @tendaily, @maloaihinh, @tenloaihinh, @hoten, @masobhxh, @cccd, @dienthoai,	
                    @maphuongan, @tenphuongan, @ngaysinh, @gioitinh, @nguoithu, @tienluongcs, @sotien,	
                    @tylengansachdiaphuong, @hotrokhac, @tungay, @denngay, @tyledong, @muctiendong,	
                    @maphuongthucdong, @tenphuongthucdong, @tuthang, @denthang, @tientunguyendong, @tienlai, @madoituong,	
                    @tendoituong, @tylensnnht, @tiennsnnht, @tylensdp, @tiennsdp, @matinh, @tentinh, @maquanhuyen, @tenquanhuyen,	
                    @maxaphuong, @tenxaphuong, @benhvientinh, @mabenhvien, @tenbenhvien, @tothon, @ghichu,	
                    @createdAt, @createdBy, @updatedAt, @updatedBy, @dotkekhai, @kykekhai, @ngaykekhai, @ngaybienlai, @sobienlai, @trangthai, @hosoIdentity, @tennguoitao, @hinhthucnap);
              `);

        // Commit transaction nếu không có lỗi
        await transaction.commit();

        // Lưu thông tin cần thiết vào danh sách
        // Lưu thông tin cần thiết vào danh sách
        listSuccess.push({
          ...item, // Gộp toàn bộ dữ liệu từ item
          sohoso: soHoso, // Thêm trường bổ sung
          dotkekhai: newSoHoSo,
        });
      } catch (err) {
        // Rollback transaction nếu có lỗi
        if (transaction) {
          await transaction.rollback();
        }

        // Thêm dòng vào danh sách lỗi
        listFailed.push({
          item,
          error: err.message,
        });
      }
    }

    // Trả về kết quả
    res.json({
      success: true,
      message: "Quá trình xử lý hoàn tất",
      listSuccess,
      listFailed,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi trong quá trình xử lý",
      error: error.message,
    });
  } finally {
    if (pool.connected) {
      await pool.close(); // Đóng kết nối
    }
  }
});

// đẩy thông tin lên cổng
router.post("/pushinfotoportbhxhvn", async (req, res) => {
  let dataKekhai = req.body;
  // console.log(dataKekhai);

  let transaction = null;
  const listSuccess = [];

  try {
    // bắt đầu kết nối
    await pool.connect();
    // Bắt đầu giao dịch
    transaction = new Transaction(pool);
    await transaction.begin();

    const result = await transaction
      .request()
      .input("maSoBhxh", dataKekhai.maSoBhxh)
      .input("hoTen", dataKekhai.hoTen)
      .input("soCccd", dataKekhai.soCccd)
      .input("ngaySinh", dataKekhai.ngaySinh)
      .input("gioiTinh", dataKekhai.gioiTinh)
      .input("loaiDt", dataKekhai.loaiDt)
      .input("soTien", dataKekhai.soTien)
      .input("soThang", dataKekhai.soThang)
      .input("maToChucDvt", dataKekhai.maToChucDvt)
      .input("tenToChucDvt", dataKekhai.tenToChucDvt)
      .input("maNhanVienThu", dataKekhai.maNhanVienThu)
      .input("tenNhanVienThu", dataKekhai.tenNhanVienThu)
      .input("maCqBhxh", dataKekhai.maCqBhxh)
      .input("tenCqBhxh", dataKekhai.tenCqBhxh)
      .input("keyfrombhvn", dataKekhai.keyfrombhvn)
      .input("tuNgay", dataKekhai.tuNgay)
      .input("denNgay", dataKekhai.denNgay).query(`
                  INSERT INTO thongtin (maSoBhxh, hoTen, soCccd, ngaySinh, gioiTinh, loaiDt, soTien, soThang, maToChucDvt, tenToChucDvt, maNhanVienThu,
                    tenNhanVienThu, maCqBhxh, tenCqBhxh, keyfrombhvn, tuNgay, denNgay)
                  VALUES (@maSoBhxh, @hoTen, @soCccd, @ngaySinh, @gioiTinh, @loaiDt, @soTien, @soThang, @maToChucDvt, @tenToChucDvt, @maNhanVienThu,
                    @tenNhanVienThu, @maCqBhxh, @tenCqBhxh, @keyfrombhvn, @tuNgay, @denNgay);
              `);

    // Nếu thành công, hoàn thành giao dịch
    await transaction.commit();
    res.json({
      success: true,
      data: {
        maLoi: "0",
        moTaLoi: "",
        maXacNhan: "POS0000000002",
        noiDung:
          "BHXH Việt Nam xác nhận: Ông Trần Văn A, Số CCCD xx xx. Ngày 31/07/2023 đã đóng 804600 đồng, tương ứng quá trình tham gia BHXH từ ngày 31/07/2023 đến ngày 30/07/2024. Sử dụng MÃ XÁC NHẬN POS0000000002 để tra cứu thông tin chi tiết tại địa chỉ https://baohiemxahoi.gov.vn",
      },
    });
  } catch (error) {
    // Nếu có lỗi, hoàn tác giao dịch
    if (transaction) {
      await transaction.rollback();
    }

    res.status(500).json({
      status: "error",
      error: error.message,
    });
  } finally {
    if (pool.connected) {
      await pool.close(); // Đóng kết nối
    }
  }
});

router.post("/saveresponsefrombhvntodb", async (req, res) => {
  let dataKekhai = req.body;
  // console.log(dataKekhai);

  let transaction = null;

  try {
    // bắt đầu kết nối
    await pool.connect();
    // Bắt đầu giao dịch
    transaction = new Transaction(pool);
    await transaction.begin();

    const result = await transaction
      .request()
      .input("maSoBhxh", dataKekhai.maSoBhxh)
      .input("hoTen", dataKekhai.hoTen)
      .input("soCccd", dataKekhai.soCccd)
      .input("ngaySinh", dataKekhai.ngaySinh)
      .input("gioiTinh", dataKekhai.gioiTinh)
      .input("loaiDt", dataKekhai.loaiDt)
      .input("soTien", dataKekhai.soTien)
      .input("soThang", dataKekhai.soThang)
      .input("maToChucDvt", dataKekhai.maToChucDvt)
      .input("tenToChucDvt", dataKekhai.tenToChucDvt)
      .input("maNhanVienThu", dataKekhai.maNhanVienThu)
      .input("tenNhanVienThu", dataKekhai.tenNhanVienThu)
      .input("maCqBhxh", dataKekhai.maCqBhxh)
      .input("tenCqBhxh", dataKekhai.tenCqBhxh)
      .input("keyfrombhvn", dataKekhai.keyfrombhvn)
      .input("tuNgay", dataKekhai.tuNgay)
      .input("denNgay", dataKekhai.denNgay)
      .input("maLoi", dataKekhai.maLoi)
      .input("moTaLoi", dataKekhai.moTaLoi)
      .input("maXacNhan", dataKekhai.maXacNhan)
      .input("noiDung", dataKekhai.noiDung)
      .input("soHoSo", dataKekhai.soHoSo)
      .input("dotKeKhai", dataKekhai.dotKeKhai)
      .input("kyKeKhai", dataKekhai.kyKeKhai)
      .input("ngayKeKhai", dataKekhai.ngayKeKhai)
      .input("createdBy", dataKekhai.createdBy)
      .input("hosoIdentity", dataKekhai.hosoIdentity).query(`
                  INSERT INTO res_bhvn_info (maSoBhxh, hoTen, soCccd, ngaySinh, gioiTinh, loaiDt, soTien, soThang, maToChucDvt, tenToChucDvt, maNhanVienThu,
                    tenNhanVienThu, maCqBhxh, tenCqBhxh, keyfrombhvn, tuNgay, denNgay, maLoi, moTaLoi, maXacNhan, noiDung,
                    soHoSo, dotKeKhai, kyKeKhai, ngayKeKhai, createdBy, hosoIdentity)
                  VALUES (@maSoBhxh, @hoTen, @soCccd, @ngaySinh, @gioiTinh, @loaiDt, @soTien, @soThang, @maToChucDvt, @tenToChucDvt, @maNhanVienThu,
                    @tenNhanVienThu, @maCqBhxh, @tenCqBhxh, @keyfrombhvn, @tuNgay, @denNgay, @maLoi, @moTaLoi, @maXacNhan, @noiDung,
                    @soHoSo, @dotKeKhai, @kyKeKhai, @ngayKeKhai, @createdBy, @hosoIdentity);
              `);

    // Nếu thành công, hoàn thành giao dịch
    await transaction.commit();
    res.json({
      success: true,
      datares: {
        maLoi: dataKekhai.maLoi,
        moTaLoi: dataKekhai.moTaLoi,
        maXacNhan: dataKekhai.maXacNhan,
      },
    });
  } catch (error) {
    // Nếu có lỗi, hoàn tác giao dịch
    if (transaction) {
      await transaction.rollback();
    }

    res.status(500).json({
      status: "error",
      error: error.message,
    });
  } finally {
    if (pool.connected) {
      await pool.close(); // Đóng kết nối
    }
  }
});

router.post("/ghidulieubienlai", async (req, res) => {
  let dulieubienlai = req.body;
  // console.log(dulieubienlai);

  let transaction = null;
  let sobienlai = dulieubienlai.sobienlai + 1;
  // console.log(dulieubienlai.sobienlai);

  try {
    // bắt đầu kết nối
    await pool.connect();
    // Bắt đầu giao dịch
    transaction = new Transaction(pool);
    await transaction.begin();

    const result = await transaction
      .request()
      .input("_id_hskk", dulieubienlai._id_hskk)
      .input("sobienlai", sobienlai)
      .input("ngaybienlai", dulieubienlai.ngaybienlai)
      .input("hoten", dulieubienlai.hoTen)
      .input("masobhxh", dulieubienlai.maSoBhxh)
      .input("ngaysinh", dulieubienlai.ngaySinh)
      .input("gioitinh", dulieubienlai.gioiTinh)
      .input("cccd", dulieubienlai.soCccd)
      .input("sodienthoai", dulieubienlai.soDienThoai)
      .input("nguoithutien", dulieubienlai.tenNhanVienThu)
      .input("loaihinh", dulieubienlai.maloaihinh)
      .input("sothang", dulieubienlai.soThang)
      .input("tungay", dulieubienlai.tuNgay)
      .input("denngay", dulieubienlai.denNgay)
      .input("tuthang", dulieubienlai.tuThang)
      .input("denthang", dulieubienlai.denNgay)
      .input("sotien", dulieubienlai.soTien)
      .input("madaily", dulieubienlai.maDaiLy)
      .input("tendaily", dulieubienlai.tenDaiLy)
      .input("hosoIdentity", dulieubienlai.hosoIdentity)
      .input("maxacnhan", dulieubienlai.maXacNhan)
      .input("tothon", dulieubienlai.tothon)
      .input("tenquanhuyen", dulieubienlai.tenquanhuyen)
      .input("tentinh", dulieubienlai.tentinh).query(`
                  INSERT INTO bienlaidientu (_id_hskk, sobienlai, ngaybienlai, hoten, masobhxh, ngaysinh, gioitinh, cccd, sodienthoai, nguoithutien, loaihinh, sothang,
                    tungay, denngay, tuthang, denthang, sotien, madaily, tendaily, hosoIdentity, maxacnhan, tothon, tenquanhuyen, tentinh)
                  VALUES (@_id_hskk, @sobienlai, @ngaybienlai, @hoten, @masobhxh, @ngaysinh, @gioitinh, @cccd, @sodienthoai, @nguoithutien, @loaihinh, @sothang,
                    @tungay, @denngay, @tuthang, @denthang, @sotien, @madaily, @tendaily, @hosoIdentity, @maxacnhan, @tothon, @tenquanhuyen, @tentinh);
              `);

    // cập nhật số biên lai
    await transaction
      .request()
      .input("sobienlai", sobienlai)
      .input("ngaykhoitao", dulieubienlai.ngaybienlai)
      .input("ghichu", dulieubienlai.hosoIdentity).query(`
          INSERT INTO bienlai (sobienlai, ngaykhoitao, ghichu) VALUES (@sobienlai, @ngaykhoitao, @ghichu)
        `);

    // Nếu thành công, hoàn thành giao dịch
    await transaction.commit();
    res.json({
      success: true,
    });
  } catch (error) {
    // Nếu có lỗi, hoàn tác giao dịch
    if (transaction) {
      await transaction.rollback();
    }

    res.status(500).json({
      status: "error",
      error: error.message,
    });
  } finally {
    if (pool.connected) {
      await pool.close(); // Đóng kết nối
    }
  }
});

// danh sách kê khai all
router.get("/all-ds-kekhai", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`SELECT * FROM kekhai_2902141757`);
    const kekhai = result.recordset;
    res.json(kekhai);
  } catch (error) {
    res.status(500).json(error);
  }
});

// đổi trạng thái hồ sơ
router.post("/updatestatushoso", async (req, res) => {
  // console.log(req.body);

  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.body._id)
      .input("maxacnhan", req.body.maXacNhan)
      .input("motaloi", req.body.moTaLoi)
      .query(
        `UPDATE kekhai SET trangthai=0, maxacnhan=@maxacnhan, motaloi=@motaloi where _id=@_id`
      );
    const kekhai = result.recordset;
    res.json(kekhai);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.patch("/capnhatkekhai", async (req, res) => {
  // console.log(req.body);

  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.body._id)
      .query(`select * from kekhai where _id=@_id`);
    let hoso = result.recordset[0];
    console.log(hoso);

    if (hoso) {
      await pool
        .request()
        .input("_id", _id)
        .input("trangthai", "0")
        .input("maxacnhan", req.body.maXacNhan)
        .input("motaloi", req.body.moTaLoi)
        .query(
          `UPDATE kekhai SET 
                  trangthai = @trangthai, 
                  maxacnhan = @maxacnhan, 
                  motaloi = @motaloi
              WHERE _id = ${_id};`
        );
      res.json({
        success: true,
        message: "Update success !",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// all danh sách kê khai with loại hình
router.get("/getalldskkwithmalh", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("maloaihinh", req.query.maloaihinh)
      .query(`SELECT * FROM kekhai where maloaihinh=@maloaihinh`);
    const kekhai = result.recordset;
    res.json(kekhai);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/bienlaidientuf", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id_hskk", req.query._id_hskk)
      .input("hosoIdentity", req.query.hosoIdentity)
      .query(
        `SELECT * FROM bienlaidientu where _id_hskk=@_id_hskk and hosoIdentity=@hosoIdentity`
      );
    const bieblai = result.recordset;
    res.json(bieblai);
  } catch (error) {
    res.status(500).json(error);
  }
});

// all danh sách kê khai with loại hình with madaily
router.get("/getalldskkwithmalh", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("maloaihinh", req.query.maloaihinh)
      .input("madaily", req.query.madaily)
      .query(
        `SELECT * FROM kekhai where maloaihinh=@maloaihinh and madaily=@madaily`
      );
    const kekhai = result.recordset;
    res.json(kekhai);
  } catch (error) {
    res.status(500).json(error);
  }
});

// all danh sách kê khai with loại hình with madaily
router.get("/danhmucdaily", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool.request().query(`SELECT * FROM dm_diemthu`);
    const daily = result.recordset;
    res.json(daily);
  } catch (error) {
    res.status(500).json(error);
  }
});

// all danh sách kê khai with loại hình with madaily
router.get("/getallkekhaiwithuser", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("maloaihinh", req.query.maloaihinh)
      .input("madaily", req.query.madaily)
      .query(
        `SELECT * FROM kekhai where madaily=@madaily and maloaihinh=@maloaihinh`
      );
    const kekhai = result.recordset;
    res.json(kekhai);
  } catch (error) {
    res.status(500).json(error);
  }
});

// tìm hồ sơ theo từ ngày đến ngày - đối với ar và bi
router.get("/hskekhaifromtotungay", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("maloaihinh", req.query.maloaihinh)
      .input("madaily", req.query.madaily)
      .input("tungay", req.query.tungay)
      .input("denngay", req.query.denngay)
      .query(
        `select * from kekhai where maloaihinh=@maloaihinh and madaily=@madaily and tungay between @tungay and @denngay`
      );
    const kekhai = result.recordset;
    res.json(kekhai);
  } catch (error) {
    res.status(500).json(error);
  }
});

// truy van tim lich su ke khai theo bo ho so
// tim theo ky ke khai
router.get("/kykekhai-search-series", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("kykekhai", req.query.kykekhai)
      .query(
        `SELECT sohoso, dotkekhai, kykekhai, ngaykekhai, madaily, trangthai, maloaihinh, tenloaihinh, COUNT(*) AS so_luong
        FROM kekhai where kykekhai=@kykekhai
        GROUP BY sohoso, dotkekhai, kykekhai, ngaykekhai, madaily, trangthai, maloaihinh, tenloaihinh`
      );
    const kekhai = result.recordset;
    res.json({
      success: true,
      kekhai,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/kykekhai-search-series-pagi", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Chuyển đổi page thành số nguyên
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const kykekhai = req.query.kykekhai;
    const madaily = req.query.madaily;
    const sohoso = req.query.sohoso;
    const dotkekhai = req.query.dotkekhai;
    const ngaykekhai = req.query.ngaykekhai;
    const ngaykekhaiden = req.query.ngaykekhaiden;

    // Chuyển đổi ngày người dùng nhập vào sang định dạng DD-MM-YYYY
    const [year, month, day] = ngaykekhai.split("-");
    let ngaykekhaiInput = day + "-" + month + "-" + year;
    const [yeard, monthd, dayd] = ngaykekhaiden.split("-");
    let ngaykekhaidenInput = dayd + "-" + monthd + "-" + yeard;

    let queryFirst = `SELECT tendaily, sohoso, dotkekhai, kykekhai, ngaykekhai, madaily, trangthai, maloaihinh, tenloaihinh, COUNT(*) AS so_luong
        FROM kekhai where madaily=@madaily
        `;
    let queryPlus = `GROUP BY tendaily, sohoso, dotkekhai, kykekhai, ngaykekhai, madaily, trangthai, maloaihinh, tenloaihinh
        ORDER BY cast(dotkekhai as int) desc OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`;

    let queryCountFirst = `with t as (
          SELECT sohoso, dotkekhai, kykekhai, ngaykekhai, madaily, trangthai, maloaihinh, tenloaihinh, COUNT(*) AS so_luong
          FROM kekhai where madaily=@madaily
          `;

    let queryCountPlus = `GROUP BY sohoso, dotkekhai, kykekhai, ngaykekhai, madaily, trangthai, maloaihinh, tenloaihinh
          )
          SELECT COUNT(*) AS totalCount FROM t`;

    if (req.query.kykekhai) {
      queryFirst += ` and kykekhai=@kykekhai`;
      queryCountFirst += ` and kykekhai=@kykekhai`;
    }

    if (req.query.sohoso) {
      queryFirst += ` and sohoso=@sohoso`;
      queryCountFirst += ` and sohoso=@sohoso`;
    }

    if (req.query.dotkekhai) {
      queryFirst += ` and dotkekhai=@dotkekhai`;
      queryCountFirst += ` and dotkekhai=@dotkekhai`;
    }

    if (req.query.ngaykekhai && !req.query.ngaykekhaiden) {
      queryFirst += " AND CONVERT(VARCHAR(10), ngaykekhai, 105) = @ngaykekhai";
      queryCountFirst +=
        " AND CONVERT(VARCHAR(10), ngaykekhai, 105) = @ngaykekhai";
    }
    if (req.query.ngaykekhai && req.query.ngaykekhaiden) {
      queryFirst +=
        " AND CONVERT(VARCHAR(10), ngaykekhai, 105) BETWEEN @ngaykekhai and @ngaykekhaiden";
      queryCountFirst +=
        " AND CONVERT(VARCHAR(10), ngaykekhai, 105) BETWEEN @ngaykekhai and @ngaykekhaiden";
    }

    const query = queryFirst + " " + queryPlus;
    const queryCount = queryCountFirst + " " + queryCountPlus;

    await pool.connect();

    const result = await pool
      .request()
      .input("kykekhai", kykekhai)
      .input("madaily", madaily)
      .input("sohoso", sohoso)
      .input("dotkekhai", dotkekhai)
      .input("ngaykekhai", ngaykekhaiInput)
      .input("ngaykekhaiden", ngaykekhaidenInput)
      .input("offset", offset)
      .input("limit", limit)
      .query(query);

    const data = result.recordset;

    // Đếm tổng số lượng bản ghi
    const countResult = await pool
      .request()
      .input("kykekhai", kykekhai)
      .input("madaily", madaily)
      .input("sohoso", sohoso)
      .input("dotkekhai", dotkekhai)
      .input("ngaykekhai", ngaykekhaiInput)
      .input("ngaykekhaiden", ngaykekhaidenInput)
      .query(queryCount);
    const totalCount = countResult.recordset[0].totalCount;

    const totalPages = Math.ceil(totalCount / limit);

    const info = {
      count: totalCount,
      pages: totalPages,
      next: page < totalPages ? `${req.path}?page=${page + 1}` : null,
      prev: page > 1 ? `${req.path}?page=${page - 1}` : null,
    };

    // Tạo đối tượng JSON phản hồi
    const response = {
      info: info,
      results: data,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// tim ho so ke khai cho nhan vien thu
router.get("/kykekhai-search-series-pagi-nvcty", async (req, res) => {
  // console.log(req.query);

  try {
    const page = parseInt(req.query.page) || 1; // Chuyển đổi page thành số nguyên
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const kykekhai = req.query.kykekhai;
    const sohoso = req.query.sohoso;
    const dotkekhai = req.query.dotkekhai;
    const ngaykekhai = req.query.ngaykekhai;
    const ngaykekhaiden = req.query.ngaykekhaiden;
    const tendaily = req.query.tendaily;

    // Chuyển đổi ngày người dùng nhập vào sang định dạng DD-MM-YYYY
    const [year, month, day] = ngaykekhai.split("-");
    let ngaykekhaiInput = day + "-" + month + "-" + year;
    const [yeard, monthd, dayd] = ngaykekhaiden.split("-");
    let ngaykekhaidenInput = dayd + "-" + monthd + "-" + yeard;

    let queryFirst = `SELECT tendaily, sohoso, dotkekhai, kykekhai, ngaykekhai, madaily, trangthai, maloaihinh, tenloaihinh, COUNT(*) AS so_luong
        FROM kekhai where 1=1
        `;
    let queryPlus = `GROUP BY tendaily, sohoso, dotkekhai, kykekhai, ngaykekhai, madaily, trangthai, maloaihinh, tenloaihinh
        ORDER BY cast(dotkekhai as int) desc OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`;

    let queryCountFirst = `with t as (
          SELECT sohoso, dotkekhai, kykekhai, ngaykekhai, madaily, trangthai, maloaihinh, tenloaihinh, COUNT(*) AS so_luong
          FROM kekhai where 1=1
          `;

    let queryCountPlus = `GROUP BY sohoso, dotkekhai, kykekhai, ngaykekhai, madaily, trangthai, maloaihinh, tenloaihinh
          )
          SELECT COUNT(*) AS totalCount FROM t`;

    if (req.query.kykekhai) {
      queryFirst += ` and kykekhai=@kykekhai`;
      queryCountFirst += ` and kykekhai=@kykekhai`;
    }

    if (req.query.sohoso) {
      queryFirst += ` and sohoso=@sohoso`;
      queryCountFirst += ` and sohoso=@sohoso`;
    }

    if (req.query.dotkekhai) {
      queryFirst += ` and dotkekhai=@dotkekhai`;
      queryCountFirst += ` and dotkekhai=@dotkekhai`;
    }

    if (req.query.ngaykekhai && !req.query.ngaykekhaiden) {
      queryFirst += " AND CONVERT(VARCHAR(10), ngaykekhai, 105) = @ngaykekhai";
      queryCountFirst +=
        " AND CONVERT(VARCHAR(10), ngaykekhai, 105) = @ngaykekhai";
    }
    if (req.query.ngaykekhai && req.query.ngaykekhaiden) {
      queryFirst +=
        " AND CONVERT(VARCHAR(10), ngaykekhai, 105) BETWEEN @ngaykekhai and @ngaykekhaiden";
      queryCountFirst +=
        " AND CONVERT(VARCHAR(10), ngaykekhai, 105) BETWEEN @ngaykekhai and @ngaykekhaiden";
    }
    if (req.query.tendaily) {
      queryFirst += " AND tendaily like @tendaily";
      queryCountFirst += " AND tendaily like @tendaily";
    }

    const query = queryFirst + " " + queryPlus;
    const queryCount = queryCountFirst + " " + queryCountPlus;

    await pool.connect();

    const result = await pool
      .request()
      .input("kykekhai", kykekhai)
      .input("sohoso", sohoso)
      .input("dotkekhai", dotkekhai)
      .input("ngaykekhai", ngaykekhaiInput)
      .input("ngaykekhaiden", ngaykekhaidenInput)
      .input("tendaily", `%${tendaily}%`)
      .input("offset", offset)
      .input("limit", limit)
      .query(query);

    const data = result.recordset;

    // Đếm tổng số lượng bản ghi
    const countResult = await pool
      .request()
      .input("kykekhai", kykekhai)
      .input("sohoso", sohoso)
      .input("dotkekhai", dotkekhai)
      .input("ngaykekhai", ngaykekhaiInput)
      .input("ngaykekhaiden", ngaykekhaidenInput)
      .input("tendaily", `%${tendaily}%`)
      .query(queryCount);
    const totalCount = countResult.recordset[0].totalCount;

    const totalPages = Math.ceil(totalCount / limit);

    const info = {
      count: totalCount,
      pages: totalPages,
      next: page < totalPages ? `${req.path}?page=${page + 1}` : null,
      prev: page > 1 ? `${req.path}?page=${page - 1}` : null,
    };

    // Tạo đối tượng JSON phản hồi
    const response = {
      info: info,
      results: data,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// tìm kiếm hồ sơ đối với nhân viên công ty
router.get("/kykekhai-search-hoso", async (req, res) => {
  // console.log(req.query);

  try {
    const {
      kykekhai,
      sohoso,
      dotkekhai,
      ngaykekhai,
      ngaykekhaiden,
      masobhxh,
      hoten,
      tendaily,
      maloaihinh,
      page = 1,
      limit = 10,
    } = req.query;

    // Chuyển đổi page và limit thành số nguyên
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    // Chuyển đổi ngày người dùng nhập vào sang định dạng DD-MM-YYYY
    const [year, month, day] = ngaykekhai.split("-");
    let ngaykekhaiInput = day + "-" + month + "-" + year;
    const [yeard, monthd, dayd] = ngaykekhaiden.split("-");
    let ngaykekhaidenInput = dayd + "-" + monthd + "-" + yeard;
    // console.log(ngaykekhaiInput);

    // Khởi tạo câu truy vấn cơ bản
    let query = "SELECT * FROM kekhai WHERE 1=1";
    let queryCount = "SELECT COUNT(*) AS totalCount FROM kekhai WHERE 1=1";

    // Thêm các điều kiện tìm kiếm nếu có
    if (kykekhai) {
      query += " AND kykekhai = @kykekhai";
      queryCount += " AND kykekhai = @kykekhai";
    }
    if (sohoso) {
      query += " AND sohoso = @sohoso";
      queryCount += " AND sohoso = @sohoso";
    }
    if (dotkekhai) {
      query += " AND dotkekhai = @dotkekhai";
      queryCount += " AND dotkekhai = @dotkekhai";
    }
    if (ngaykekhai && !ngaykekhaiden) {
      query += " AND CONVERT(VARCHAR(10), ngaykekhai, 105) = @ngaykekhai";
      queryCount += " AND CONVERT(VARCHAR(10), ngaykekhai, 105) = @ngaykekhai";
    }
    if (ngaykekhai && ngaykekhaiden) {
      query +=
        " AND CONVERT(VARCHAR(10), ngaykekhai, 105) BETWEEN @ngaykekhai and @ngaykekhaiden";
      queryCount +=
        " AND CONVERT(VARCHAR(10), ngaykekhai, 105) BETWEEN @ngaykekhai and @ngaykekhaiden";
    }
    if (masobhxh) {
      query += " AND masobhxh = @masobhxh";
      queryCount += " AND masobhxh = @masobhxh";
    }
    if (hoten) {
      query += " AND hoten like @hoten";
      queryCount += " AND hoten like @hoten";
    }
    if (tendaily) {
      query += " AND tendaily like @tendaily";
      queryCount += " AND tendaily like @tendaily";
    }
    if (maloaihinh) {
      query += " AND maloaihinh = @maloaihinh";
      queryCount += " AND maloaihinh = @maloaihinh";
    }

    // Thêm phần phân trang CONVERT(VARCHAR(10), ngaykekhai, 105) BETWEEN '13-12-2024' AND '14-12-2024';
    query +=
      " ORDER BY dotkekhai OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY";

    // console.log(query);

    // Kết nối và thực thi truy vấn
    await pool.connect();

    const result = await pool
      .request()
      .input("kykekhai", kykekhai)
      .input("sohoso", sohoso)
      .input("dotkekhai", dotkekhai)
      .input("ngaykekhai", ngaykekhaiInput)
      .input("ngaykekhaiden", ngaykekhaidenInput)
      .input("masobhxh", masobhxh)
      .input("maloaihinh", maloaihinh)
      .input("hoten", `%${hoten}%`)
      .input("tendaily", `%${tendaily}%`)
      .input("offset", offset)
      .input("limit", limitNumber)
      .query(query);

    const countResult = await pool
      .request()
      .input("kykekhai", kykekhai)
      .input("sohoso", sohoso)
      .input("dotkekhai", dotkekhai)
      .input("ngaykekhai", ngaykekhaiInput)
      .input("ngaykekhaiden", ngaykekhaidenInput)
      .input("masobhxh", masobhxh)
      .input("maloaihinh", maloaihinh)
      .input("hoten", `%${hoten}%`)
      .input("tendaily", `%${tendaily}%`)
      .query(queryCount);

    const totalCount = countResult.recordset[0].totalCount;
    const totalPages = Math.ceil(totalCount / limitNumber);

    const info = {
      count: totalCount,
      pages: totalPages,
      next:
        pageNumber < totalPages
          ? `${req.path}?page=${pageNumber + 1}&limit=${limit}`
          : null,
      prev:
        pageNumber > 1
          ? `${req.path}?page=${pageNumber - 1}&limit=${limit}`
          : null,
    };

    res.json({ info, results: result.recordset });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// tìm kiếm hồ sơ đối với điểm thu
router.get("/kykekhai-search-hoso-diemthu", async (req, res) => {
  // console.log(req.query);

  try {
    const {
      kykekhai,
      sohoso,
      dotkekhai,
      ngaykekhai,
      ngaykekhaiden,
      masobhxh,
      maloaihinh,
      hoten,
      madaily,
      page = 1,
      limit = 10,
    } = req.query;

    // Chuyển đổi page và limit thành số nguyên
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    // Chuyển đổi ngày người dùng nhập vào sang định dạng DD-MM-YYYY
    const [year, month, day] = ngaykekhai.split("-");
    let ngaykekhaiInput = day + "-" + month + "-" + year;
    const [yeard, monthd, dayd] = ngaykekhaiden.split("-");
    let ngaykekhaidenInput = dayd + "-" + monthd + "-" + yeard;
    // console.log(ngaykekhaiInput);

    // Khởi tạo câu truy vấn cơ bản
    let query = "SELECT * FROM kekhai WHERE madaily=@madaily and 1=1";
    let queryCount =
      "SELECT COUNT(*) AS totalCount FROM kekhai WHERE madaily=@madaily and 1=1";

    // Thêm các điều kiện tìm kiếm nếu có
    if (kykekhai) {
      query += " AND kykekhai = @kykekhai";
      queryCount += " AND kykekhai = @kykekhai";
    }
    if (sohoso) {
      query += " AND sohoso = @sohoso";
      queryCount += " AND sohoso = @sohoso";
    }
    if (dotkekhai) {
      query += " AND dotkekhai = @dotkekhai";
      queryCount += " AND dotkekhai = @dotkekhai";
    }
    if (ngaykekhai && !ngaykekhaiden) {
      query += " AND CONVERT(VARCHAR(10), ngaykekhai, 105) = @ngaykekhai";
      queryCount += " AND CONVERT(VARCHAR(10), ngaykekhai, 105) = @ngaykekhai";
    }
    if (ngaykekhai && ngaykekhaiden) {
      query +=
        " AND CONVERT(VARCHAR(10), ngaykekhai, 105) BETWEEN @ngaykekhai and @ngaykekhaiden";
      queryCount +=
        " AND CONVERT(VARCHAR(10), ngaykekhai, 105) BETWEEN @ngaykekhai and @ngaykekhaiden";
    }
    if (masobhxh) {
      query += " AND masobhxh = @masobhxh";
      queryCount += " AND masobhxh = @masobhxh";
    }
    if (hoten) {
      query += " AND hoten like @hoten";
      queryCount += " AND hoten like @hoten";
    }
    if (maloaihinh) {
      query += " AND maloaihinh = @maloaihinh";
      queryCount += " AND maloaihinh = @maloaihinh";
    }

    // Thêm phần phân trang CONVERT(VARCHAR(10), ngaykekhai, 105) BETWEEN '13-12-2024' AND '14-12-2024';
    query +=
      " ORDER BY dotkekhai OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY";

    // console.log(query);

    // Kết nối và thực thi truy vấn
    await pool.connect();

    const result = await pool
      .request()
      .input("kykekhai", kykekhai)
      .input("sohoso", sohoso)
      .input("dotkekhai", dotkekhai)
      .input("ngaykekhai", ngaykekhaiInput)
      .input("ngaykekhaiden", ngaykekhaidenInput)
      .input("masobhxh", masobhxh)
      .input("maloaihinh", maloaihinh)
      .input("hoten", `%${hoten}%`)
      .input("madaily", madaily)
      .input("offset", offset)
      .input("limit", limitNumber)
      .query(query);

    const countResult = await pool
      .request()
      .input("kykekhai", kykekhai)
      .input("sohoso", sohoso)
      .input("dotkekhai", dotkekhai)
      .input("ngaykekhai", ngaykekhaiInput)
      .input("ngaykekhaiden", ngaykekhaidenInput)
      .input("masobhxh", masobhxh)
      .input("maloaihinh", maloaihinh)
      .input("hoten", `%${hoten}%`)
      .input("madaily", madaily)
      .query(queryCount);

    const totalCount = countResult.recordset[0].totalCount;
    const totalPages = Math.ceil(totalCount / limitNumber);

    const info = {
      count: totalCount,
      pages: totalPages,
      next:
        pageNumber < totalPages
          ? `${req.path}?page=${pageNumber + 1}&limit=${limit}`
          : null,
      prev:
        pageNumber > 1
          ? `${req.path}?page=${pageNumber - 1}&limit=${limit}`
          : null,
    };

    res.json({ info, results: result.recordset });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// xuất mẫu hồ sơ liệt kê danh sách
router.get("/get-all-kekhai-xuatmau", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("sohoso", req.query.sohoso)
      .query(`SELECT * from kekhai where sohoso=@sohoso`);
    const kekhai = result.recordset;
    res.json({
      success: true,
      kekhai,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/sobienlai", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`SELECT top 1 sobienlai FROM bienlai ORDER BY _id DESC`);
    const bienlai = result.recordset;
    res.json({
      success: true,
      bienlai,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/bienlaidientu", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`SELECT * FROM bienlaidientu ORDER BY _id DESC`);
    const bienlai = result.recordset;
    res.json({
      success: true,
      bienlai,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
