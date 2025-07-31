const express = require("express");
const router = express.Router();
const { pool } = require("../database/dbinfo");
const { Transaction } = require("mssql");
const xlsx = require("xlsx");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { log } = require("console");

// MÁY CHỦ
// var folderFileUpload = "D:\\code\\tcdvthu_server\\public\\fileimport";
// var folderFileUpload =
//   "E:\\CODE_APP\\TCDVTHU\\tcdvthu_server\\public\\fileimport";
// var urlServer = "192.168.1.5:81";

// LOCAL
var folderFileUpload =
  "E:\\CODE_APP\\QUANLYNHANSU\\HATINH\\qlns_client\\static\\anhHoSo";
// var folderFileUpload =
//   "/Users/apple/Documents/code/p_Quanlynhansu/qlns_client/static/anhHoSo/";
// var urlServer = "localhost:2612";
var urlServer = "14.224.129.177:2612";

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    /* Nhớ sửa đường dẫn khi deploy lên máy chủ */
    // đường dẫn cho máy dev MacOS
    // cb(
    //   null,
    //   "/Users/apple/Documents/code/p_Quanlynhansu/qlns_server/public/fileimport"
    // );
    // đường dẫn khi deploy máy chủ PHỦ DIỄN
    cb(null, folderFileUpload);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

var upload = multer({ storage: storage });

router.get("/all-emp", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`SELECT * FROM nhansu where isThoivu <> 1 and isNghiHuu=0  order by maPhongBan`);
    const ns = result.recordset;
    res.json(ns);
  } catch (error) {
    res.status(500).json(error);
  }
});

// nghỉ phép
router.get("/nghiphep-theo-nam", async (req, res) => {
  // console.log(req.query.nam);
  const nam = req.query.nam; 
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("nam", nam)
      .query(`SELECT * FROM quanlynghiphep where nam=@nam`);
    const ns = result.recordset;
    res.json(ns);
  } catch (error) {
    res.status(500).json(error);
  }
});

// tuổi nghỉ hưu
router.get("/all-emp-tinhtuoinghihuu", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool.request().query(`SELECT * FROM nhansu where isNghiHuu=0`);
    const ns = result.recordset;
    res.json(ns);
  } catch (error) {
    res.status(500).json(error);
  }
});

// tìm mã nhân viên có số hiệu lớn nhất
router.get("/max-empl", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`SELECT MAX(_id) AS max_id FROM nhansu;`);
    const ns = result.recordset;
    res.json(ns);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/all-emp-thoivu", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`SELECT * FROM nhansu where isthoivu=1 and isNghiHuu=0`);
    const nstv = result.recordset;
    res.json(nstv);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/all-emp-nghihuu", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool.request().query(`SELECT * FROM nhansu where isNghiHuu = 1`);
    const nghihuu = result.recordset;
    res.json(nghihuu);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/all-emp-codong", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool.request().query(`SELECT * FROM codong`);
    const nghihuu = result.recordset;
    res.json(nghihuu);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/all-emp-dangvien", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`SELECT * FROM nhansu where isDangVien=1 and isNghiHuu=0 order by _id`);
    const nghihuu = result.recordset;
    res.json(nghihuu);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/import-file", (req, res) => {
  try {
    // console.log("done");

    res.json({
      success: true,
      message: "Quá trình xử lý hoàn tất",
    });
  } catch (error) {}
});

router.post("/add-empl", upload.single("anhHoSo"), async (req, res) => {
  let dataNhansu = req.body;
  let transaction = null;
  let dataExist = [];

  let linkAnhHoSo;
  const file = req.file;
  if (file) {
    linkAnhHoSo = `http://${urlServer}/anhHoSo/${req.file.filename}`;
  } else {
    linkAnhHoSo = "";
  }

  try {
    await pool.connect();

    // Kiểm tra xem số CCCD đã tồn tại chưa
    const resExist = await pool.request().query("SELECT soCccd FROM nhansu");

    dataExist = resExist.recordset;

    const isExist = dataExist.some(
      (item) => String(item.soCccd).trim() === String(dataNhansu.soCccd).trim()
    );

    if (isExist) {
      return res.status(200).json({
        success: false,
        message: "Số CCCD đã tồn tại, không thể thêm mới.",
      });
    }

    try {
      transaction = new Transaction(pool);
      await transaction.begin();

      await transaction
        .request()
        .input("hoTen", dataNhansu.hoTen)
        .input("soDienThoai", dataNhansu.soDienThoai)
        .input("ngaySinh", dataNhansu.ngaySinh)
        .input("gioiTinh", dataNhansu.gioiTinh)
        .input("viTriCongTac", dataNhansu.viTriCongTac)
        .input("thoiGianBatdauTgBhxh", dataNhansu.thoiGianBatdauTgBhxh)
        .input("loaiHd", dataNhansu.loaiHd)
        .input("thoiHanHd_Batdau", dataNhansu.thoiHanHd_Batdau)
        .input("thoiHanHd_Ketthuc", dataNhansu.thoiHanHd_Ketthuc)
        .input("ngayBonhiemChucvu", dataNhansu.ngayBonhiemChucvu)
        .input("trinhDoHocVan", dataNhansu.trinhDoHocVan)
        .input("trinhDoChuyenMon", dataNhansu.trinhDoChuyenMon)
        .input("danToc", dataNhansu.danToc || "Kinh")
        .input("tonGiao", dataNhansu.tonGiao || "Không")
        .input("soCmnd", dataNhansu.soCmnd)
        .input("ngayCap_cmnd", dataNhansu.ngayCap_cmnd)
        .input("noiCap_cmnd", dataNhansu.noiCap_cmnd)
        .input("soCccd", dataNhansu.soCccd)
        .input("ngayCap_Cccd", dataNhansu.ngayCap_Cccd)
        .input("noiCap_Cccd", dataNhansu.noiCap_Cccd)
        .input("noiKhaiSinh", dataNhansu.noiKhaiSinh)
        .input("diaChiHoKhau", dataNhansu.diaChiHoKhau)
        .input("diaChiHienNay", dataNhansu.diaChiHienNay)
        .input("createdBy", dataNhansu.createdBy)
        .input("createdAt", dataNhansu.createdAt)
        .input("ghichu", dataNhansu.ghichu)
        .input("maNhanVien", dataNhansu.maNhanVien)
        .input("status", dataNhansu.status)
        .input("ischinhanh", dataNhansu.ischinhanh)
        .input("isphongban", dataNhansu.isphongban)
        .input("maPhongBan", dataNhansu.maPhongBan)
        .input("maChiNhanh", dataNhansu.maChiNhanh)
        .input("phongBan", dataNhansu.phongBan)
        .input("chiNhanh", dataNhansu.chiNhanh)
        .input("isThoiVu", dataNhansu.isThoiVu)
        .input("isNghiHuu", 1)
        .input("isNangNhocDocHai", dataNhansu.isNangNhocDocHai)
        .input("ngayHopDongTinhPhep", dataNhansu.ngayHopDongTinhPhep)
        .input("anhHoSo", linkAnhHoSo).query(`
          INSERT INTO nhansu (
            hoTen, soDienThoai, ngaySinh, gioiTinh, viTriCongTac, 
            thoiGianBatdauTgBhxh, loaiHd, thoiHanHd_Batdau, thoiHanHd_Ketthuc, ngayBonhiemChucvu, 
            trinhDoHocVan, trinhDoChuyenMon, danToc, tonGiao, soCmnd, 
            ngayCap_cmnd, noiCap_cmnd, soCccd, ngayCap_Cccd, noiCap_Cccd, 
            noiKhaiSinh, diaChiHoKhau, diaChiHienNay, createdBy, createdAt, 
            ghichu, maNhanVien, status, ischinhanh, isphongban, isThoiVu, isNghiHuu, isNangNhocDocHai, ngayHopDongTinhPhep,
            maPhongBan, maChiNhanh, phongBan, chiNhanh, anhHoSo
          ) VALUES (
            @hoTen, @soDienThoai, @ngaySinh, @gioiTinh, @viTriCongTac, 
            @thoiGianBatdauTgBhxh, @loaiHd, @thoiHanHd_Batdau, @thoiHanHd_Ketthuc, @ngayBonhiemChucvu, 
            @trinhDoHocVan, @trinhDoChuyenMon, @danToc, @tonGiao, @soCmnd, 
            @ngayCap_cmnd, @noiCap_cmnd, @soCccd, @ngayCap_Cccd, @noiCap_Cccd, 
            @noiKhaiSinh, @diaChiHoKhau, @diaChiHienNay, @createdBy, @createdAt, 
            @ghichu, @maNhanVien, @status, @ischinhanh, @isphongban, @isThoiVu, @isNghiHuu, @isNangNhocDocHai, @ngayHopDongTinhPhep,
            @maPhongBan, @maChiNhanh, @phongBan, @chiNhanh, @anhHoSo
          );
        `);

      await transaction.commit();
      res.json({ success: true, message: "Thêm mới thành công" });
    } catch (err) {
      if (transaction) await transaction.rollback();
      console.error("Lỗi khi thêm mới:", err);
      res.status(500).json({
        success: false,
        message: "Lỗi khi thêm mới",
        error: err.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi kết nối cơ sở dữ liệu",
      error: error.message,
    });
  } finally {
    if (pool.connected) await pool.close();
  }
});

router.post("/add-codong", upload.none(), async (req, res) => {
  let data = req.body;
  // console.log(data);
  
  let transaction = null;

  try {
    await pool.connect();

    transaction = new Transaction(pool);
    await transaction.begin();

    await transaction
      .request()
      .input("hoTen", data.hoTen)
      .input("donVi", data.donVi)
      .input("soCccd", data.soCccd)
      .input("ngayCap", data.ngayCap)
      .input("diaChi", data.diaChi)
      .input("cophantudo", data.cophantudo)
      .input("cophanhanche", data.cophanhanche)
      .input("tong", data.tong)
      .input("ghichu", data.ghichu)
      .input("tenloaicp", data.tenloaicp)
      .input("loaicp", data.loaicp)
      .input("createdBy", data.createdBy)
      .input("createdAt", data.createdAt)
      .query(`
        INSERT INTO codong (
          hoTen, donVi, soCccd, ngayCap, diaChi,
          cophantudo, cophanhanche, tong, ghichu,
          tenloaicp, loaicp, createdBy, createdAt
        ) VALUES (
          @hoTen, @donVi, @soCccd, @ngayCap, @diaChi,
          @cophantudo, @cophanhanche, @tong, @ghichu,
          @tenloaicp, @loaicp, @createdBy, @createdAt
        );
      `);

    await transaction.commit();

    return res.json({ success: true, message: "Thêm cổ đông thành công." });
  } catch (err) {
    if (transaction) await transaction.rollback();
    console.error("Lỗi thêm cổ đông:", err);
    return res.status(500).json({
      success: false,
      message: "Lỗi khi thêm cổ đông.",
      error: err.message,
    });
  } finally {
    if (pool.connected) await pool.close();
  }
});


router.post("/add-ngaynghiphep", async (req, res) => { 
  const dataNhansu = req.body;
  // console.log(dataNhansu);
  
  let transaction = null;

  try {
    await pool.connect();
    transaction = new Transaction(pool);
    await transaction.begin();

    await transaction
      .request()
      .input("maNhanVien", dataNhansu.maNhanVien)
      .input("hoTen", dataNhansu.hoTen)
      .input("isphongban", dataNhansu.isphongban)
      .input("ischinhanh", dataNhansu.ischinhanh)
      .input("maPhongBan", dataNhansu.maPhongBan)
      .input("phongBan", dataNhansu.phongBan)
      .input("maChiNhanh", dataNhansu.maChiNhanh)
      .input("chiNhanh", dataNhansu.chiNhanh)
      .input("ngayHopDongTinhPhep", dataNhansu.ngayHopDongTinhPhep)
      .input("isNangNhocDocHai", dataNhansu.isNangNhocDocHai)
      .input("ngayPhep", dataNhansu.ngayPhep)
      .input("tongDaNghi", dataNhansu.tongDaNghi)
      .input("conLai", dataNhansu.conLai)
      .input("thang1", dataNhansu.thang?.["1"] || 0)
      .input("thang2", dataNhansu.thang?.["2"] || 0)
      .input("thang3", dataNhansu.thang?.["3"] || 0)
      .input("thang4", dataNhansu.thang?.["4"] || 0)
      .input("thang5", dataNhansu.thang?.["5"] || 0)
      .input("thang6", dataNhansu.thang?.["6"] || 0)
      .input("thang7", dataNhansu.thang?.["7"] || 0)
      .input("thang8", dataNhansu.thang?.["8"] || 0)
      .input("thang9", dataNhansu.thang?.["9"] || 0)
      .input("thang10", dataNhansu.thang?.["10"] || 0)
      .input("thang11", dataNhansu.thang?.["11"] || 0)
      .input("thang12", dataNhansu.thang?.["12"] || 0)
      .input("createdBy", dataNhansu.createdBy)
      .input("createdAt", dataNhansu.createdAt)
      .input("ghichu", dataNhansu.ghichu)
      .input("nam", dataNhansu.namNghiPhep)
      .query(`
        MERGE quanlynghiphep AS target
        USING (SELECT 
          @maNhanVien AS maNhanVien,
          @nam AS nam
        ) AS source
        ON target.maNhanVien = source.maNhanVien AND target.nam = source.nam
        WHEN MATCHED THEN 
          UPDATE SET 
            hoTen = @hoTen,
            isphongban = @isphongban,
            ischinhanh = @ischinhanh,
            maPhongBan = @maPhongBan,
            phongBan = @phongBan,
            maChiNhanh = @maChiNhanh,
            chiNhanh = @chiNhanh,
            ngayHopDongTinhPhep = @ngayHopDongTinhPhep,
            isNangNhocDocHai = @isNangNhocDocHai,
            ngayPhep = @ngayPhep,
            tongDaNghi = @tongDaNghi,
            conLai = @conlai,
            thang1 = @thang1, thang2 = @thang2, thang3 = @thang3, thang4 = @thang4,
            thang5 = @thang5, thang6 = @thang6, thang7 = @thang7, thang8 = @thang8,
            thang9 = @thang9, thang10 = @thang10, thang11 = @thang11, thang12 = @thang12,
            createdBy = @createdBy,
            createdAt = @createdAt,
            ghiChu = @ghichu
        WHEN NOT MATCHED THEN 
          INSERT (
            maNhanVien, hoTen, isphongban, ischinhanh, maPhongBan, phongBan, maChiNhanh, chiNhanh,
            ngayHopDongTinhPhep, isNangNhocDocHai, ngayPhep, tongDaNghi, conLai,
            thang1, thang2, thang3, thang4, thang5, thang6, thang7, thang8, thang9, thang10, thang11, thang12,
            createdBy, createdAt, ghiChu, nam
          ) VALUES (
            @maNhanVien, @hoTen, @isphongban, @ischinhanh, @maPhongBan, @phongBan, @maChiNhanh, @chiNhanh,
            @ngayHopDongTinhPhep, @isNangNhocDocHai, @ngayPhep, @tongDaNghi, @conlai,
            @thang1, @thang2, @thang3, @thang4, @thang5, @thang6, @thang7, @thang8, @thang9, @thang10, @thang11, @thang12,
            @createdBy, @createdAt, @ghichu, @nam
          );
      `);

    await transaction.commit();
    res.json({ success: true, message: "Lưu dữ liệu thành công" });
  } catch (err) {
    if (transaction) await transaction.rollback();
    console.error("Lỗi khi lưu dữ liệu:", err);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lưu dữ liệu",
      error: err.message,
    });
  } finally {
    if (pool.connected) await pool.close();
  }
});

router.post("/update-empl", upload.single("anhHoSo"), async (req, res) => {
  // console.log(req.body);

  let dataNhansu = req.body;
  let transaction = null;

  let linkAnhHoSo;
  const file = req.file;
  if (file) {
    // xóa file trong thư mục
    const basePath = folderFileUpload;
    // "D:\\PROJECT\\TCDVTHU\\client\\static\\avatar"; // đổi đường dẫn khi up lên máy chủ
    const fileName = path.basename(req.body.anhHoSoOld);
    // Ghép đường dẫn và tên tệp bằng phương thức path.join()
    const filePath = path.join(basePath, fileName);
    //   console.log(filePath);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Đã xảy ra lỗi khi xóa tệp:", err);
        return;
      }
      console.log("Tệp đã được xóa thành công");
    });

    linkAnhHoSo = `http://${urlServer}/anhHoSo/${req.file.filename}`;
  } else {
    linkAnhHoSo = dataNhansu.anhHoSo || "";
  }

  try {
    await pool.connect();
    try {
      transaction = new Transaction(pool);
      await transaction.begin();

      await transaction
        .request()
        .input("_id", dataNhansu._id)
        .input("hoTen", dataNhansu.hoTen)
        .input("soDienThoai", dataNhansu.soDienThoai)
        .input("ngaySinh", dataNhansu.ngaySinh)
        .input("gioiTinh", dataNhansu.gioiTinh)
        .input("viTriCongTac", dataNhansu.viTriCongTac)
        .input("thoiGianBatdauTgBhxh", dataNhansu.thoiGianBatdauTgBhxh)
        .input("loaiHd", dataNhansu.loaiHd)
        .input("thoiHanHd_Batdau", dataNhansu.thoiHanHd_Batdau)
        .input("thoiHanHd_Ketthuc", dataNhansu.thoiHanHd_Ketthuc)
        .input("ngayBonhiemChucvu", dataNhansu.ngayBonhiemChucvu)
        .input("trinhDoHocVan", dataNhansu.trinhDoHocVan)
        .input("trinhDoChuyenMon", dataNhansu.trinhDoChuyenMon)
        .input("danToc", dataNhansu.danToc || "Kinh")
        .input("tonGiao", dataNhansu.tonGiao || "Không")
        .input("soCmnd", dataNhansu.soCmnd)
        .input("ngayCap_cmnd", dataNhansu.ngayCap_cmnd)
        .input("noiCap_cmnd", dataNhansu.noiCap_cmnd)
        .input("ngayCap_Cccd", dataNhansu.ngayCap_Cccd)
        .input("noiCap_Cccd", dataNhansu.noiCap_Cccd)
        .input("noiKhaiSinh", dataNhansu.noiKhaiSinh)
        .input("diaChiHoKhau", dataNhansu.diaChiHoKhau)
        .input("diaChiHienNay", dataNhansu.diaChiHienNay)
        .input("ghichu", dataNhansu.ghichu)
        .input("status", dataNhansu.status)
        .input("ischinhanh", dataNhansu.ischinhanh)
        .input("isphongban", dataNhansu.isphongban)
        .input("isDangVien", dataNhansu.isDangVien)
        .input("maPhongBan", dataNhansu.maPhongBan)
        .input("maChiNhanh", dataNhansu.maChiNhanh)
        .input("phongBan", dataNhansu.phongBan)
        .input("chiNhanh", dataNhansu.chiNhanh)
        .input("anhHoSo", linkAnhHoSo)
        .input("soCccd", dataNhansu.soCccd)
        .input("tenChiBo", dataNhansu.tenChiBo)
        .input("chucVuDangDoanThe", dataNhansu.chucVuDangDoanThe)
        .input("ngayVaoDang", dataNhansu.ngayVaoDang)
        .input("ngayVaoDangChinhThuc", dataNhansu.ngayVaoDangChinhThuc)
        .input("huyHieuDang", dataNhansu.huyHieuDang)
        .input("isDuBi", dataNhansu.isDuBi).query(`
          UPDATE nhansu SET
            hoTen = @hoTen, soDienThoai = @soDienThoai, ngaySinh = @ngaySinh, gioiTinh = @gioiTinh, viTriCongTac = @viTriCongTac,
            thoiGianBatdauTgBhxh = @thoiGianBatdauTgBhxh, loaiHd = @loaiHd, thoiHanHd_Batdau = @thoiHanHd_Batdau, thoiHanHd_Ketthuc = @thoiHanHd_Ketthuc, 
            ngayBonhiemChucvu = @ngayBonhiemChucvu, trinhDoHocVan = @trinhDoHocVan, trinhDoChuyenMon = @trinhDoChuyenMon, danToc = @danToc, 
            tonGiao = @tonGiao, soCmnd = @soCmnd,
            ngayCap_cmnd = @ngayCap_cmnd, noiCap_cmnd = @noiCap_cmnd, ngayCap_Cccd = @ngayCap_Cccd, noiCap_Cccd = @noiCap_Cccd,
            noiKhaiSinh = @noiKhaiSinh, diaChiHoKhau = @diaChiHoKhau, diaChiHienNay = @diaChiHienNay,
            ghichu = @ghichu, status = @status, ischinhanh = @ischinhanh, isphongban = @isphongban, isDangVien = @isDangVien,
            maPhongBan = @maPhongBan, maChiNhanh = @maChiNhanh, phongBan = @phongBan, chiNhanh = @chiNhanh, anhHoSo = @anhHoSo,
            tenChiBo = @tenChiBo, chucVuDangDoanThe=@chucVuDangDoanThe, ngayVaoDang=@ngayVaoDang, ngayVaoDangChinhThuc=@ngayVaoDangChinhThuc,
            huyHieuDang=@huyHieuDang
          WHERE _id = @_id;
        `);

      await transaction.commit();
      res.json({ success: true, message: "Cập nhật thành công" });
    } catch (err) {
      if (transaction) await transaction.rollback();
      console.error("Lỗi khi cập nhật:", err);
      res.status(500).json({
        success: false,
        message: "Lỗi khi cập nhật",
        error: err.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi kết nối cơ sở dữ liệu",
      error: error.message,
    });
  } finally {
    if (pool.connected) await pool.close();
  }
});

// chuyển đơn vị từ phòng sang phòng
router.post("/change-empl-phong-to-phong", async (req, res) => {
  // console.log(req.body);

  let dataNhansu = req.body;
  let transaction = null;

  try {
    await pool.connect();
    try {
      transaction = new Transaction(pool);
      await transaction.begin();

      await transaction
        .request()
        .input("_id", dataNhansu._id)
        .input("viTriCongTac", dataNhansu.viTriCongTac)
        .input("maPhongBan", dataNhansu.maPhongBan)
        .input("phongBan", dataNhansu.phongBan)
        .input("ghiChu", dataNhansu.ghiChu).query(`
          UPDATE nhansu SET
            viTriCongTac=@viTriCongTac, maPhongBan = @maPhongBan, phongBan = @phongBan, ghiChu = @ghiChu
          WHERE _id = @_id;
        `);

      await transaction.commit();
      res.json({ success: true, message: "Cập nhật thành công" });
    } catch (err) {
      if (transaction) await transaction.rollback();
      console.error("Lỗi khi cập nhật:", err);
      res.status(500).json({
        success: false,
        message: "Lỗi khi cập nhật",
        error: err.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi kết nối cơ sở dữ liệu",
      error: error.message,
    });
  } finally {
    if (pool.connected) await pool.close();
  }
});

// chuyển đơn vị từ phòng sang chi nhánh
router.post("/change-empl-phong-to-chinhanh", async (req, res) => {
  // console.log(req.body);

  let dataNhansu = req.body;
  let transaction = null;

  try {
    await pool.connect();
    try {
      transaction = new Transaction(pool);
      await transaction.begin();

      await transaction
        .request()
        .input("_id", dataNhansu._id)
        .input("viTriCongTac", dataNhansu.viTriCongTac)
        .input("maChiNhanh", dataNhansu.maChiNhanh)
        .input("chiNhanh", dataNhansu.chiNhanh)
        .input("ghiChu", dataNhansu.ghiChu).query(`
          UPDATE nhansu SET
            viTriCongTac=@viTriCongTac, maChiNhanh = @maChiNhanh, chiNhanh = @chiNhanh, 
            ischinhanh=1, isphongban=0, maPhongban = '', phongBan = '' , ghiChu = @ghiChu
          WHERE _id = @_id;
        `);

      await transaction.commit();
      res.json({ success: true, message: "Cập nhật thành công" });
    } catch (err) {
      if (transaction) await transaction.rollback();
      console.error("Lỗi khi cập nhật:", err);
      res.status(500).json({
        success: false,
        message: "Lỗi khi cập nhật",
        error: err.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi kết nối cơ sở dữ liệu",
      error: error.message,
    });
  } finally {
    if (pool.connected) await pool.close();
  }
});

// chuyển đơn vị từ chinhanh sang chi nhánh
router.post("/change-empl-chinhanh-to-chinhanh", async (req, res) => {
  // console.log(req.body);

  let dataNhansu = req.body;
  let transaction = null;

  try {
    await pool.connect();
    try {
      transaction = new Transaction(pool);
      await transaction.begin();

      await transaction
        .request()
        .input("_id", dataNhansu._id)
        .input("viTriCongTac", dataNhansu.viTriCongTac)
        .input("maChiNhanh", dataNhansu.maChiNhanh)
        .input("chiNhanh", dataNhansu.chiNhanh)
        .input("ghiChu", dataNhansu.ghiChu).query(`
          UPDATE nhansu SET
            maChiNhanh = @maChiNhanh, chiNhanh = @chiNhanh, ghiChu = @ghiChu
          WHERE _id = @_id;
        `);

      await transaction.commit();
      res.json({ success: true, message: "Cập nhật thành công" });
    } catch (err) {
      if (transaction) await transaction.rollback();
      console.error("Lỗi khi cập nhật:", err);
      res.status(500).json({
        success: false,
        message: "Lỗi khi cập nhật",
        error: err.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi kết nối cơ sở dữ liệu",
      error: error.message,
    });
  } finally {
    if (pool.connected) await pool.close();
  }
});

// chuyển đơn vị từ chinhanh sang phòng ban
router.post("/change-empl-chinhanh-to-phongban", async (req, res) => {
  // console.log(req.body);

  let dataNhansu = req.body;
  let transaction = null;

  try {
    await pool.connect();
    try {
      transaction = new Transaction(pool);
      await transaction.begin();

      await transaction
        .request()
        .input("_id", dataNhansu._id)
        .input("viTriCongTac", dataNhansu.viTriCongTac)
        .input("maPhongBan", dataNhansu.maPhongBan)
        .input("phongBan", dataNhansu.phongBan)
        .input("ghiChu", dataNhansu.ghiChu).query(`
          UPDATE nhansu SET
            viTriCongTac=@viTriCongTac, maPhongBan = @maPhongBan, phongBan = @phongBan, ischinhanh=0, isphongban=1, chiNhanh='', 
            maChiNhanh='', ghiChu = @ghiChu
          WHERE _id = @_id;
        `);

      await transaction.commit();
      res.json({ success: true, message: "Cập nhật thành công" });
    } catch (err) {
      if (transaction) await transaction.rollback();
      console.error("Lỗi khi cập nhật:", err);
      res.status(500).json({
        success: false,
        message: "Lỗi khi cập nhật",
        error: err.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi kết nối cơ sở dữ liệu",
      error: error.message,
    });
  } finally {
    if (pool.connected) await pool.close();
  }
});

// ghi log
router.post("/read-log-his-system", async (req, res) => {
  // console.log(req.body);
  let transaction = null;

  try {
    await pool.connect();
    try {
      transaction = new Transaction(pool);
      await transaction.begin();

      await transaction
        .request()
        .input("meNu", req.body.meNu)
        .input("chucNang", req.body.chucNang)
        .input("noiDung", req.body.noiDung)
        .input("createdAt", req.body.createdAt)
        .input("createdBy", req.body.createdBy).query(`
          insert into loghis (meNu, chucNang, noiDung, createdAt, createdBy)
          values (@meNu, @chucNang, @noiDung, @createdAt, @createdBy);
        `);

      await transaction.commit();
      res.json({ success: true, message: "thành công" });
    } catch (err) {
      if (transaction) await transaction.rollback();
      console.error("Lỗi khi cập nhật:", err);
      res.status(500).json({
        success: false,
        message: "Lỗi khi cập nhật",
        error: err.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi kết nối cơ sở dữ liệu",
      error: error.message,
    });
  } finally {
    if (pool.connected) await pool.close();
  }
});

// report
router.get("/report-index", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`SELECT 
            COUNT(*) AS tongNhanSu,
            COUNT(CASE WHEN isDangVien = 1 THEN 1 END) AS tongDangVien,
            COUNT(CASE WHEN gioiTinh = 1 THEN 1 END) AS tongNam,
            COUNT(CASE WHEN gioiTinh = 0 THEN 1 END) AS tongNu,
            COUNT(CASE WHEN isTrenDaiHoc = 1 THEN 1 END) AS tongTrenDaiHoc,
            COUNT(CASE WHEN isDaiHoc = 1 THEN 1 END) AS tongDaiHoc,
            COUNT(CASE WHEN isCaoDang = 1 THEN 1 END) AS tongCaoDang,
            COUNT(CASE WHEN isTrungCap = 1 THEN 1 END) AS tongTrungCap,
            COUNT(CASE WHEN isSocap = 1 THEN 1 END) AS tongSoCap,
            COUNT(CASE WHEN isLaoDongPhoThong = 1 THEN 1 END) AS tongLDPT
        FROM nhansu
        WHERE isNghiHuu = 0`);
    const ns = result.recordset[0];
    // console.log(ns);
    
    res.json(ns);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/report-chart-age", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`SELECT
            CASE
              WHEN (YEAR(GETDATE()) - CAST(RIGHT(ngaySinh, 4) AS INT)) < 25 THEN '<25'
              WHEN (YEAR(GETDATE()) - CAST(RIGHT(ngaySinh, 4) AS INT)) BETWEEN 25 AND 30 THEN '25-30'
              WHEN (YEAR(GETDATE()) - CAST(RIGHT(ngaySinh, 4) AS INT)) BETWEEN 31 AND 35 THEN '31-35'
              WHEN (YEAR(GETDATE()) - CAST(RIGHT(ngaySinh, 4) AS INT)) BETWEEN 36 AND 40 THEN '36-40'
              WHEN (YEAR(GETDATE()) - CAST(RIGHT(ngaySinh, 4) AS INT)) BETWEEN 41 AND 45 THEN '41-45'
              ELSE '>45'
            END AS nhomTuoi,
            COUNT(*) AS soLuong
          FROM nhansu
          WHERE isNghiHuu = 0
          GROUP BY
            CASE
              WHEN (YEAR(GETDATE()) - CAST(RIGHT(ngaySinh, 4) AS INT)) < 25 THEN '<25'
              WHEN (YEAR(GETDATE()) - CAST(RIGHT(ngaySinh, 4) AS INT)) BETWEEN 25 AND 30 THEN '25-30'
              WHEN (YEAR(GETDATE()) - CAST(RIGHT(ngaySinh, 4) AS INT)) BETWEEN 31 AND 35 THEN '31-35'
              WHEN (YEAR(GETDATE()) - CAST(RIGHT(ngaySinh, 4) AS INT)) BETWEEN 36 AND 40 THEN '36-40'
              WHEN (YEAR(GETDATE()) - CAST(RIGHT(ngaySinh, 4) AS INT)) BETWEEN 41 AND 45 THEN '41-45'
              ELSE '>45'
            END
          ORDER BY nhomTuoi
          `);
    const ns = result.recordset;
    // console.log(ns);
    
    res.json(ns);
  } catch (error) {
    res.status(500).json(error);
  }
});


// cập nhật sang nghỉ việc
router.post("/update-nghi-viec", async (req, res) => {
  // console.log(req.body);

  let dataNhansu = req.body;
  let transaction = null;

  try {
    await pool.connect();
    try {
      transaction = new Transaction(pool);
      await transaction.begin();

      await transaction
        .request()
        .input("_id", dataNhansu._id)
        .input("thoiDiemNghi", dataNhansu.thoiDiemNghi)
        .input("lyDoNghiViec", dataNhansu.lyDoNghiViec).query(`
          UPDATE nhansu SET
            lyDoNghiViec=@lyDoNghiViec, isNghiHuu=1, thoiDiemNghi = @thoiDiemNghi
          WHERE _id = @_id;
        `);

      await transaction.commit();
      res.json({ success: true, message: "Cập nhật thành công" });
    } catch (err) {
      if (transaction) await transaction.rollback();
      console.error("Lỗi khi cập nhật:", err);
      res.status(500).json({
        success: false,
        message: "Lỗi khi cập nhật",
        error: err.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi kết nối cơ sở dữ liệu",
      error: error.message,
    });
  } finally {
    if (pool.connected) await pool.close();
  }
});

// chuyển lên chính thức
router.post("/chuyen-chinh-thuc", async (req, res) => {
  // console.log(req.body);

  let dataNhansu = req.body;
  let transaction = null;

  try {
    await pool.connect();
    try {
      transaction = new Transaction(pool);
      await transaction.begin();

      await transaction
        .request()
        .input("_id", dataNhansu._id).query(`
          UPDATE nhansu SET
            isThoiVu=0
          WHERE _id = @_id;
        `);

      await transaction.commit();
      res.json({ success: true, message: "Cập nhật thành công" });
    } catch (err) {
      if (transaction) await transaction.rollback();
      console.error("Lỗi khi cập nhật:", err);
      res.status(500).json({
        success: false,
        message: "Lỗi khi cập nhật",
        error: err.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi kết nối cơ sở dữ liệu",
      error: error.message,
    });
  } finally {
    if (pool.connected) await pool.close();
  }
});

// xóa nhân sự
router.post("/delete/nhansu", async (req, res) => {
  // console.log(req.body.id);
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.body.id)
      .query(`SELECT * FROM nhansu WHERE _id = @_id`);

    let nhansu = result.recordset.length ? result.recordset[0] : null;
    // console.log(nhansu);
    if (nhansu) {
      // xóa file trong thư mục
      const basePath = folderFileUpload;
      // "D:\\PROJECT\\TCDVTHU\\client\\static\\avatar"; // đổi đường dẫn khi up lên máy chủ
      const fileName = path.basename(nhansu.anhHoSo);
      // Ghép đường dẫn và tên tệp bằng phương thức path.join()
      const filePath = path.join(basePath, fileName);
      //   console.log(filePath);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Đã xảy ra lỗi khi xóa tệp:", err);
          return;
        }
        // console.log("Tệp đã được xóa thành công");
      });
      await pool
        .request()
        .input("_id", req.body.id)
        .query(`DELETE FROM nhansu WHERE _id = @_id;`);
      res.json({ success: true });
    } else {
      res.status(404).json({
        message: "Record not found",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// xóa cổ đông
router.post("/delete/codong", async (req, res) => {
  // console.log(req.body.id);
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.body.id)
      .query(`SELECT * FROM codong WHERE _id = @_id`);

    let nhansu = result.recordset.length ? result.recordset[0] : null;
    // console.log(nhansu);
    if (nhansu) {
      await pool
        .request()
        .input("_id", req.body.id)
        .query(`DELETE FROM codong WHERE _id = @_id;`);
      res.json({ success: true });
    } else {
      res.status(404).json({
        message: "Record not found",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
