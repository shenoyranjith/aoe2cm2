import express from "express";
import {Server} from "http"
import socketio from "socket.io";
import Player from "./constants/Player";
import {IDraftConfig} from "./types/IDraftConfig";
import {IJoinMessage} from "./types/IJoinMessage";
import {DraftsStore} from "./models/DraftsStore";
import {Validator} from "./models/Validator";
import {ValidationId} from "./constants/ValidationId";
import {DraftEvent} from "./types/DraftEvent";
import {Util} from "./util/Util";
import {AddressInfo} from "net";
import Preset from "./models/Preset";
import {Listeners} from "./util/Listeners";
import * as fs from "fs";

export const DraftServer = {
    serve(port: string | number | undefined):{ httpServerAddr: AddressInfo | string | null; io: SocketIO.Server; httpServer: Server } {
        const app = express();
        app.set("port", port);
        app.use(express.json());

        const server = new Server(app);
        const io = socketio(server, {cookie: false});
        const draftsStore = new DraftsStore();
        const validator = new Validator(draftsStore);

        function connectPlayer(draftId: string, player: Player, name: string) {
            if (!draftsStore.has(draftId)) {
                draftsStore.initDraft(draftId, Preset.SAMPLE);
            }
            draftsStore.connectPlayer(draftId, player, name);
        }

        app.post('/preset/new', (req, res) => {
            console.log('/preset/new', req.body);
            let draftId = Util.newDraftId();
            while(draftsStore.has(draftId)){
                draftId += Util.randomChar();
            }
            const pojo: Preset = req.body.preset as Preset;
            let preset = Preset.fromPojo(pojo);
            const validationErrors = Validator.validatePreset(preset);
            if (validationErrors.length === 0) {
                draftsStore.initDraft(draftId, preset as Preset);
                res.json({status: 'ok', draftId});
            } else {
                res.json({status: 'error', validationErrors});
            }
        });
        app.use('/draft/[a-zA-Z]+', (req, res) => {
            res.sendFile(__dirname + '/index.html');
        });

        app.use(express.static('build'));
        app.use('/', (req, res) => {
            res.sendFile(__dirname + '/index.html');
        });

        io.on("connection", (socket: socketio.Socket) => {
            const draftIdRaw: string = socket.handshake.query.draftId;
            const draftId = Util.sanitizeDraftId(draftIdRaw);

            const roomHost: string = `${draftId}-host`;
            const roomGuest: string = `${draftId}-guest`;
            const roomSpec: string = `${draftId}-spec`;

            console.log("a user connected to the draft", draftId);

            if (!draftsStore.has(draftId)) {
                const path = `data/${draftId}.json`;
                if (fs.existsSync(path)) {
                    console.log("Found recorded draft. Sending replay.", draftId);
                    socket.emit('replay', JSON.parse(fs.readFileSync(path).toString('utf8')));
                } else {
                    console.log("Did not find recorded draft.", draftId);
                    socket.emit('message', 'This draft does not exist.');
                }
                console.log("disconnecting.", draftId);
                socket.disconnect(true);
                return;
            }

            const {nameHost, nameGuest} = draftsStore.getPlayerNames(draftId);

            const rooms = Object.keys(socket.rooms);
            console.log('rooms', rooms);
            let yourPlayerType = Player.NONE;
            if (rooms.includes(roomHost)) {
                socket.join(roomHost);
                yourPlayerType = Player.HOST;
                const message = {nameHost, nameGuest, youAre: Player.HOST};
                console.log('sending', message);
            } else if (rooms.includes(roomGuest)) {
                socket.join(roomGuest);
                yourPlayerType = Player.GUEST;
                const message = {nameHost, nameGuest, youAre: Player.GUEST};
                console.log('sending', message);
            } else {
                socket.join(roomSpec);
                const message = {nameHost, nameGuest, youAre: Player.NONE};
                console.log('sending', message);
            }

            socket.on("join", (message: IJoinMessage, fn: (dc: IDraftConfig) => void) => {
                console.log("player joined:", message);
                const role: Player = Util.sanitizeRole(message.role);
                if (role === Player.HOST) {
                    socket.join(roomHost);
                    socket.leave(roomSpec);
                    connectPlayer(draftId, Player.HOST, message.name);
                    const answer = {nameHost, nameGuest, youAre: Player.HOST};
                    console.log('sending', answer);
                } else if (role === Player.GUEST) {
                    socket.join(roomGuest);
                    socket.leave(roomSpec);
                    connectPlayer(draftId, Player.GUEST, message.name);
                    const answer = {nameHost, nameGuest, youAre: Player.GUEST};
                    console.log('sending', answer);
                }

                socket.nsp
                    .in(roomHost)
                    .in(roomGuest)
                    .in(roomSpec)
                    .emit("player_joined", {name: message.name, playerType: role});
                fn({
                    ...draftsStore.getDraftViewsOrThrow(draftId).getDraftForPlayer(role),
                    yourPlayerType: role
                });
            });

            socket.on("ready", (message: {}, fn: (dc: IDraftConfig) => void) => {
                console.log("player ready:", message);
                let playerType: Player = Player.NONE;
                if (Object.keys(socket.rooms).includes(roomHost)) {
                    draftsStore.setPlayerReady(draftId, Player.HOST);
                    playerType = Player.HOST;
                } else if (Object.keys(socket.rooms).includes(roomGuest)) {
                    draftsStore.setPlayerReady(draftId, Player.GUEST);
                    playerType = Player.GUEST;
                }
                if(draftsStore.playersAreReady(draftId)){
                    draftsStore.startCountdown(draftId, socket)
                }
                socket.nsp
                    .in(roomHost)
                    .in(roomGuest)
                    .in(roomSpec)
                    .emit("player_ready", {playerType});
                fn({
                    ...draftsStore.getDraftViewsOrThrow(draftId).getDraftForPlayer(playerType),
                    yourPlayerType: playerType
                });
            });

            socket.on("act", Listeners.actListener(draftsStore, draftId, validateAndApply, socket, roomHost, roomGuest, roomSpec));

            socket.on('disconnect', function () {
                console.log('Got disconnect! draftId: ' + draftId);
            });

            console.log('emitting "draft_state": ', {
                ...draftsStore.getDraftViewsOrThrow(draftId).getDraftForPlayer(Player.NONE),
                yourPlayerType: yourPlayerType
            });
            socket.emit("draft_state", {
                ...draftsStore.getDraftViewsOrThrow(draftId).getDraftForPlayer(Player.NONE),
                yourPlayerType:yourPlayerType
            });
        });

        const httpServer = server.listen(port, () => {
            console.log("listening on *:" + port);
        });
        const httpServerAddr = httpServer.address();


        function validateAndApply(draftId: string, message: DraftEvent): ValidationId[] {
            return validator.validateAndApply(draftId, message);
        }

        return {httpServer, httpServerAddr, io};
    }
};