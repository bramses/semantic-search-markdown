import fs from "fs";
import { join } from "path";

// read a json file and return the data
export const readFile = async (
  file: string
): Promise<String | NodeJS.ErrnoException> => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, "utf8", (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};
export const writeFile = async (
  file: string,
  data: string
): Promise<void | NodeJS.ErrnoException> => {
  const filePath = join(__dirname, "..", "json", file);

  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};
