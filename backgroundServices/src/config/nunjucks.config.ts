import nunjucks from "nunjucks";
import app from "../app";
import path from "path";

const templateDir = path.resolve(__dirname, "../../templates/")

// NOTE: allows for code reusability throughout all services
export const nunjucksEnv = nunjucks.configure(templateDir, {
  autoescape: true,
  express: app,
  watch: true,
});

