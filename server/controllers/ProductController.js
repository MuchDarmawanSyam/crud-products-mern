import Product from "../models/ProductModel.js";
import path from "path";
import fs from "fs";


export const getProducts = async(req, res) => {
    try {
        const response = await Product.findAll();
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}


export const getProductById = async(req, res) => {
    try {
        const response = await Product.findOne({
            where: {
                id: req.params.id
            }
        });
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}


export const saveProduct = (req, res) => {
    if(req.files == null) return res.status(400).json({msg: "No File Uploaded"});
    const name = "Product "+req.body.title;
    const file = req.files.file;
    const fileSize = file.data.length;
    const extension = path.extname(file.name);
    const randomNumber = Math.floor(Math.random() * (1000 - 2)) + 2; // Rand angka untuk mencegah error double img
    const fileName = file.md5 + randomNumber + extension;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedType = ['.png', '.jpg', '.jpeg'];

    // Validasi file yang akan disimpan
    if(!allowedType.includes(extension.toLowerCase())) return res.status(422).json({msg: "invalid image"});
    if(fileSize > 5000000) return res.status(422).json({msg: "Image must be less than 5MB"});

    // Simpan fIle upload
    file.mv(`./public/images/${fileName}`, async(err) => {
        if(err) return res.status(500).json({msg: err.message});
        try {
            // Tambah data ke database
            await Product.create({name: name, image: fileName, url: url});
            res.status(201).json({msg: "Product Created Successfully"});
        } catch (error) {
            console.log(error.message);
        }
    });
}


export const updateProduct = async(req, res) => {
    const product = await Product.findOne({
        where: {
            id: req.params.id
        }
    });

    if(!product) return res.status(404).json({msg: "No Data Found"});
    let fileName = "";
    if(req.files === null){ // Jika update tanpa ubah image
        fileName = product.image;
    }else{  // Jika update dengan image
        const file = req.files.file;
        const fileSize = file.data.length;
        const extension = path.extname(file.name);
        const randomNumber = Math.floor(Math.random() * (1000 - 2)) + 2;
        fileName = file.md5 + randomNumber + extension;
        const allowedType = ['.png', '.jpg', '.jpeg'];

        // Validasi file yang akan diupdate
        if(!allowedType.includes(extension.toLowerCase())) return res.status(422).json({msg: "invalid image"});
        if(fileSize > 5000000) return res.status(422).json({msg: "Image must be less than 5MB"});

        // Hapus file lama
        const filepath = `./public/images/${product.image}`;
        fs.unlinkSync(filepath);

        // Simpan fIle upload
        file.mv(`./public/images/${fileName}`, (err) => {
            if(err) return res.status(500).json({msg: err.message});
        });
    }
    const name = req.body.title;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    try {
        await Product.update({name: name, image: fileName, url: url}, {
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Product update successfully"});
    } catch (error) {
        console.log(error.message);
    }
}


export const deleteProduct = async(req, res) => {
    const product = await Product.findOne({
        where: {
            id: req.params.id
        }
    });

    if(!product) return res.status(404).json({msg: "No Data Found"});
    try {
        const filepath = `./public/images/${product.image}`;
        fs.unlinkSync(filepath);
        await Product.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Product Deleted Successfully"});
    } catch (error) {
        console.log(error.message);
    }
}