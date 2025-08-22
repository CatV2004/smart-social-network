import { Socket } from 'socket.io-client';

export class SocketService {
    private socket: Socket | null = null;

    setSocket(socket: Socket) {
        this.socket = socket;
    }

    // Gửi event
    emitEvent(event: string, data: any) {
        if (this.socket) {
            this.socket.emit(event, data);
        }
    }

    // Lắng nghe event
    onEvent(event: string, callback: (data: any) => void) {
        if (this.socket) {
            this.socket.on(event, callback);
        }
    }

    // Hủy lắng nghe event
    offEvent(event: string, callback?: (data: any) => void) {
        if (this.socket) {
            if (callback) {
                this.socket.off(event, callback);
            } else {
                this.socket.off(event);
            }
        }
    }

    // Kiểm tra kết nối
    isConnected(): boolean {
        return this.socket?.connected || false;
    }

    // Disconnect
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}

export const socketService = new SocketService();