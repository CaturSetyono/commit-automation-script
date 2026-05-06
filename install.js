const fs = require("fs");
const path = require("path");

const sourcePush = path.join(__dirname, "push.sh");
const sourceAmend = path.join(__dirname, "amend.sh");

// root project user
const targetDir = process.env.INIT_CWD || process.cwd();

const targetPush = path.join(targetDir, "push.sh");
const targetAmend = path.join(targetDir, "amend.sh");

try {
  if (fs.existsSync(sourcePush)) {
    fs.copyFileSync(sourcePush, targetPush);
    fs.chmodSync(targetPush, "755");
    console.log("✅ push.sh berhasil diinstall ke:", targetDir);
  }

  if (fs.existsSync(sourceAmend)) {
    fs.copyFileSync(sourceAmend, targetAmend);
    fs.chmodSync(targetAmend, "755");
    console.log("✅ amend.sh berhasil diinstall ke:", targetDir);
  }
} catch (err) {
  console.error("❌ Gagal install script:", err);
}
