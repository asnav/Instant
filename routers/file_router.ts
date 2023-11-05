import multer from "multer";
import express, { Request, Response } from "express";
// import { authenticate } from "../controllers/auth_controller";
const router = express.Router();

const base = "http://192.168.68.105:3000/";
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req: Request, file: unknown, cb) => {
    console.log("multer storage callback");
    cb(null, Date.now() + ".jpg"); //Appending .jpg
  },
});

const upload = multer({ storage: storage });

/**
 * @swagger
 * /file/:
 *  post:
 *    summary: upload an image
 *    tags: [File]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      multipart/form-data:
 *        schema:
 *          type: object
 *          properties:
 *            file:
 *              type: string
 *              format: binary
 *    responses:
 *      200:
 *        description: file uploaded successfully
 */
router.post("/upload", upload.single("file"), (req: Request, res: Response) => {
  console.log("router.post(/file: " + base + req.file.path);
  if (req.file) res.status(200).send({ url: base + req.file.path });
  else res.status(400).send("something went wrong");
});

export = router;

/**
 * @swagger
 * tags:
 *  name: File
 *  description: File Upload
 *
 * components:
 *  schemas:
 *    FilePath:
 *      type: object
 *      required:
 *        - url
 *      properties:
 *        url:
 *          type: string
 *          description: The File's path url
 *      example:
 *        message: '192.168.68.105/3000'
 */
