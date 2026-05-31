const fs   = require('fs');
const path = require('path');

const dir = path.resolve(__dirname, '../../../dist/demo');

if (fs.existsSync(dir)) {
  fs.rmSync(dir, { recursive: true, force: true });
  console.log('✅  Đã xóa dist/demo/');
} else {
  console.log('ℹ️   dist/demo/ không tồn tại');
}
