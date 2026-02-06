const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { exec } = require("child_process");
const fs = require("fs");

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });

app.get("/", (req, res) => {
    res.send("PDF Protect API Running");
});

app.post("/protect", upload.single("pdf"), (req, res) => {
    const password = req.body.password;
    const input = req.file.path;
    const output = `protected-${Date.now()}.pdf`;

    const cmd = `qpdf --encrypt ${password} ${password} 256 -- "${input}" "${output}"`;

    exec(cmd, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Encryption failed");
        }

        res.download(output, () => {
            fs.unlinkSync(input);
            fs.unlinkSync(output);
        });
    });
});

app.listen(3000, () => console.log("Server running on port 3000"));