import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient!: Client;
  private readonly serverUrl = "ws://34.41.30.134:15674/ws";  // RabbitMQ WebSocket URL
//   private readonly serverUrl = "ws://34.41.30.134:15674/stomp";  // RabbitMQ WebSocket URL
  private readonly queueName = "/queue/orders";  // ✅ FIXED

  constructor() { }

  connect() {
    if (this.stompClient && this.stompClient.active) {
      console.log("✅ WebSocket already connected.");
      return;
    }

    this.stompClient = new Client({
      brokerURL: this.serverUrl,
      connectHeaders: {
        login: "cafeadmin",  // Change credentials if needed
        passcode: "cafeAdminPWD"
      },
      debug: (msg) => console.log("🐇 RabbitMQ STOMP:", msg),
      reconnectDelay: 5000, // Auto-reconnect after 5s
    });

    this.stompClient.onConnect = () => {
      console.log("✅ WebSocket Connected to RabbitMQ");
      this.subscribeToOrders();
    };

    this.stompClient.onStompError = (frame) => {
      console.error("❌ STOMP Error:", frame);
    };

    this.stompClient.onWebSocketError = (error) => {
      console.error("🚨 WebSocket Error:", error);
    };

    this.stompClient.activate();
  }

  subscribeToOrders() {
    if (!this.stompClient || !this.stompClient.active) {
      console.error("❌ WebSocket is not connected. Cannot subscribe.");
      return;
    }

    this.stompClient.subscribe(this.queueName, (message) => {
      console.log("📩 New Order:", message.body);
      alert(`🛒 New Order Received: ${message.body}`);
    });
  }

  sendMessage(order: string) {
    if (!this.stompClient || !this.stompClient.active) {
      console.error("❌ WebSocket is not connected. Cannot send message.");
      return;
    }

    this.stompClient.publish({
      destination: this.queueName,
      body: order
    });

    console.log("📨 Order Sent:", order);
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
      console.log("🔌 WebSocket Disconnected");
    }
  }
}
