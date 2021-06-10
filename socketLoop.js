console.log('Runing socketLoop.js Demo WebSocket！');
// 載入Express(Node.js的Web開發框架)
const express = require('express');
// 建立Express伺服器
const app = express();
// REDIS
const redis = require('redis');
// REDIS
const subscriber = redis.createClient();
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
var wsArray = [];

function loopJsonData(json)
{
    // 字串轉JSON
    const jsonData= JSON.parse(json);
    const INTERVAL = 1000;
    jsonData.forEach( function (item, index, arr) {
        setTimeout(() => {
            console.log(item);
        }, INTERVAL * index);
    });
}

/**
 * 事件：建立連線時。(ws：,req：)
 */
wss.on('connection', function(ws, req){
    const ip = req.connection.remoteAddress;
    const port = req.connection.remotePort;
    console.log('新連線：', ip, port);
    ws.port = port;
    ws.currencyId = 1;
    wsArray[port] = ws;

    /**
     * 事件：服務器收到訊息時。(mes：訊息)
     */
    ws.on('message', function(message) {
        // 切換幣種
        const msgData= JSON.parse(message);
        if (msgData && msgData.length !== 0) {
            console.log('切換幣種：', msgData.changeCurrency);
            wsArray[port].currencyId = msgData.changeCurrency;
        }else{
            console.log('錯誤：', msgData);
        }
    });

    /**
     * 事件：離開時。
     */
    ws.on('close', function() {
        console.log('離線：', ip, port);
        // 離開時刪除連線資料
        delete wsArray[port];
    });

    /**
     * 事件：監聽Redis頻道
     */
    subscriber.subscribe('private-channel-name');
    subscriber.on('message', function(channel, message) {
        console.log('監聽Redis：', channel, message);
        loopJsonData(message);
        // // 字串轉JSON
        // const msgData= JSON.parse(message);
        // // 所有用戶輪巡
        // wsArray.forEach( function (item, index, arr) {
        //     // 幣種一樣的才通知
        //     if (item.currencyId === msgData.currency) {
        //         // 發送個人資訊
        //         item.send(message)
        //     }
        // });
    })
});
