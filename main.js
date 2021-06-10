console.log('Runing main.js Demo WebSocket！');
// 載入Express(Node.js的Web開發框架)
const express = require('express');
// 建立Express伺服器
const app = express();
// 用來抓取url內容
const url = require('url');
// 載入WS(Node.js的WebSocket server)
const WebSocketServer = require('ws').Server;
// 設定WebSocket Server使用的Port：8081
wss = new WebSocketServer({port:8081});
// 連線的port：3000
app.listen(3000, function(){
    // 再命令列運作看到的訊息
    console.log('運行WebSocket的連線使用port：3000');
    // 再命令列運作看到的訊息
    console.log('使用指令：wscat -c ws://localhost:8081/{name}');
    // 再命令列運作看到的訊息
    console.log('-----------------------------------------------');
});
// 宣告陣列用來存目前線上數量
var Index = ['0'];
// 宣告物件，用來宣告為WS物件，接收次服氣端傳送的訊息
var wsArray = {};

// 事件：建立連線時。(ws：,req：)
wss.on('connection', function(ws, req){
    // 取得URL
    const location = url.parse(req.url);
    // 取捯名稱，這邊因為uri第一個是名稱所以
    const name = location.path.substring(1);
    // 對服務器發送訊息
    ws.send(name + ' 您好！');

    // 迴圈：對所有人做連線資料紀錄
    for (var i = 0; i <= Index.length; i++) {
        // 還沒儲存過才處理
        if (!Index[i]) {
            // 儲存目前共有幾個連線
            Index[i] = i;
            // 紀錄名稱和ID哈送訊息時備用
            ws.id = i;
            ws.name = name;
            // 宣告內容為WS物件
            wsArray[ws.id] = ws;
            break;
        }
    }

    // 時間
    const time = new Date();
    // 迴圈：對所有人通知
    for (var i = 1; i <= Index.length - 1; i++) {
        // 不傳給自己
        if (i != ws.id) {
            // 發送上線訊息
            wsArray[i].send(name + ' 加入這個房間時間：' + time.toLocaleString());
        }
    }

    // 事件：服務器收到訊息時。(mes：訊息)
    ws.on('message', function(mes) {
        // 伺服器端發送訊息
        // ws.send(mes);
        // 迴圈：目前連線人數
        for (var i = 1; i <= Index.length - 1; i++) {
            // 當ID不是自己時執行
            if (i != ws.id) {
                // 伺服器將訊息傳給array WS其他人
                wsArray[i].send(ws.name + '：' + mes)
            }
        }
    });

    // 事件：離開時。
    ws.on('close', function() {
        // 迴圈：對所有人通知
        for (var i = 1; i <= Index.length - 1; i++) {
            // 離線的人不收到
            if (i != ws.id) {
                // 伺服器將訊息傳給array WS其他人
                wsArray[i].send(ws.name + '：left！！');
            }
        }
    });
});
