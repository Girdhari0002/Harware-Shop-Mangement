import multer from "multer";

const storage = multer.diskStorage({
  destination: "src/uploads",
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

export const upload = multer({ storage });

// In-memory upload for files we only need to parse (e.g. CSV import), not persist to disk.
export const memoryUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 2 * 1024 * 1024 } });