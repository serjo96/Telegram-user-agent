// types/express.d.ts
import Multer from "multer";

declare namespace Express {
  export interface Multer extends Multer{}
}
