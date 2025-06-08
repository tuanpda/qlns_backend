const express = require("express");
const router = express.Router();
const { pool } = require("../database/dbinfo");
const multer = require("multer");

// danh mục phòng ban
router.get("/dmphongban", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`SELECT * FROM phongban order by id`);
    const phongban = result.recordset;
    res.json(phongban);
  } catch (error) {
    res.status(500).json(error);
  }
});

// danh mục chi nhánh
router.get("/dmchinhanh", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`SELECT * FROM chinhanh order by id`);
    const chinhanh = result.recordset;
    res.json(chinhanh);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/add-phongban", async (req, res) => {
  try {
    await pool.connect();

    const result = await pool
      .request()
      .input("maPhongBan", req.body.maPhongBan)
      .input("tenPhongBan", req.body.tenPhongBan)
      .input("ghichu", req.body.ghichu)
      .input("createdAt", req.body.createdAt)
      .input("createdBy", req.body.createdBy).query(`
                  INSERT INTO phongban (maPhongBan, tenPhongBan, ghichu,	
                    createdAt, createdBy) 
                  VALUES (@maPhongBan, @tenPhongBan, @ghichu,	
                    @createdAt, @createdBy);
              `);
    const phongban = req.body;
    res.json(phongban);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/add-chinhanh", async (req, res) => {
  try {
    await pool.connect();

    const result = await pool
      .request()
      .input("maChiNhanh", req.body.maChiNhanh)
      .input("tenChiNhanh", req.body.tenChiNhanh)
      .input("ghichu", req.body.ghichu)
      .input("createdAt", req.body.createdAt)
      .input("createdBy", req.body.createdBy).query(`
                  INSERT INTO chinhanh (maChiNhanh, tenChiNhanh, ghichu,	
                    createdAt, createdBy) 
                  VALUES (@maChiNhanh, @tenChiNhanh, @ghichu,	
                    @createdAt, @createdBy);
              `);
    const chinhanh = req.body;
    res.json(chinhanh);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/edit-phongban", async (req, res) => {
  try {
    await pool.connect();

    const result = await pool
      .request()
      .input("maPhongBan", req.body.maPhongBan)
      .input("tenPhongBan", req.body.tenPhongBan)
      .input("ghichu", req.body.ghichu)
      .input("createdAt", req.body.createdAt)
      .input("createdBy", req.body.createdBy).query(`
                  update phongban set maPhongBan = @maPhongBan, tenPhongBan = @tenPhongBan, ghichu = @ghichu
                  where id = ${req.body.id}
              `);
    const phongban = req.body;
    res.json(phongban);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/edit-chinhanh", async (req, res) => {
  try {
    await pool.connect();

    const result = await pool
      .request()
      .input("maChiNhanh", req.body.maChiNhanh)
      .input("tenChiNhanh", req.body.tenChiNhanh)
      .input("ghichu", req.body.ghichu)
      .input("createdAt", req.body.createdAt)
      .input("createdBy", req.body.createdBy).query(`
                  update chinhanh set maChiNhanh = @maChiNhanh, tenChiNhanh = @tenChiNhanh, ghichu = @ghichu
                  where id = ${req.body.id}
              `);
    const chinhanh = req.body;
    res.json(chinhanh);
  } catch (error) {
    res.status(500).json(error);
  }
});

// delete phongban
router.post("/del-phongban", async (req, res) => {
  // console.log(req.body);

  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`delete phongban where id = ${req.body.id}`);
    const pb = result.recordset;
    res.json(pb);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/del-chinhanh", async (req, res) => {
  // console.log(req.body);

  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`delete chinhanh where id = ${req.body.id}`);
    const cn = result.recordset;
    res.json(cn);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
