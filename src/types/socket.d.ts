import type { Socket } from "socket.io";

declare module "socket.io" {
    interface Socket {
        user?: {
            name: string;
            email: string;
        };
    }
}
