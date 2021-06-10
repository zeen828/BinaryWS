console.log('Runing main.js Demo WebSocket！');

// 用來抓取url內容
const url = require('url');

// 1.載入Express(Node.js的Web開發框架)
const express = require('express');
// 建立Express伺服器
const app = express();
// 連線的port：3000
app.listen(3000, function(){
    // 再命令列運作看到的訊息
    console.log('運行WebSocket的連線使用port：3000');
    // 再命令列運作看到的訊息
    console.log('使用指令：wscat -c ws://localhost:8081/{name}');
    // 再命令列運作看到的訊息
    console.log('-----------------------------------------------');
});

// 2.載入WS(Node.js的WebSocket server)
const WebSocketServer = require('ws').Server;
// 設定WebSocket Server使用的Port：8081
const wss = new WebSocketServer({port:8081});
// 宣告物件，用來宣告為WS物件，接收伺服氣端傳送的訊息
var wsArray = [];

/**
 * 事件：建立連線時。(ws：,req：)
 */
wss.on('connection', function(ws, req){
    const ip = req.connection.remoteAddress;
    const port = req.connection.remotePort;
    console.log('新連線：', ip, port);
    ws.port = port;
    ws.currencyId = 1;
    // 連線客戶端紀錄
    wsArray.push(ws);

    /**
     * 事件：服務器收到訊息時。(mes：訊息)
     */
    ws.on('message', function(message) {
        // 例外處理
        try {
            const msgData= JSON.parse(message);
            // JSON不正確
            if(typeof msgData != 'object' || !msgData || msgData == undefined)
            {
                console.log('格式錯誤(非物件)：', msgData);
                return false;
            }
            // 切換幣種
            if (msgData.changeCurrency != undefined)
            {
                console.log('切換幣種：', msgData.changeCurrency);
                // 找出符合條件的第一個索引
                const key = wsArray.findIndex(e => e.port == port);
                // 修改索引的內容
                wsArray[key].currencyId = msgData.changeCurrency;
            }
            // 測試
            if (msgData.test != undefined)
            {
                console.log('測試：');
            }
        } catch (exception) {
            console.log('格式錯誤(JSON反解錯誤)：', exception, message);
            return false;
        }
    });

    /**
     * 事件：離開時。
     */
    ws.on('close', function() {
        console.log('離線：', ip, port);
        // 找出符合條件的第一個索引
        const key = wsArray.findIndex(e => e.port == port);
        // 刪除陣列索引(key)後的(1)單位資料
        wsArray.splice(key, 1);
    });
});

// 3.REDIS
const redis = require('redis');
// REDIS-建立客戶端
const subscriber = redis.createClient();
// REDIS-設定頻道
subscriber.subscribe('private-channel-name');
/**
 * Redis事件：監聽頻道
 */
subscriber.on('message', function(channel, message) {
    console.log('監聽Redis：', channel, wsArray.length);
    // 例外處理
    try {
        const msgData= JSON.parse(message);
        // JSON不正確
        if(typeof msgData != 'object' || !msgData || msgData == undefined)
        {
            console.log('格式錯誤(非物件)：', msgData);
            return false;
        }
        // 幣種訊息
        if (msgData.currency != undefined)
        {
            wsArray.forEach( function (item, index) {
                if (item.currencyId === msgData.currency) {
                    // 發送個人資訊
                    item.send(message)
                }
            });
        }
    } catch (exception) {
        console.log('格式錯誤(JSON反解錯誤)：', exception, message);
        return false;
    }
});
