// 引入模組
const redis = require("redis");
const client = redis.createClient();
// 連接 redis server
client.on("error", function(error) {
  console.error(error);
});
// 設置與取得 key / value
client.get("key", redis.print);
