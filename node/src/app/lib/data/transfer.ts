// Contract between the server that streams data and the client that receives it.
//
// Server (src/server/lib/data-injector.ts) writes into the stream:
//   <script>(self.__DATA__||=[]).push(["product:1", {...}], ...)</script>
// Client (src/client/receive-server-data.ts) moves the pairs into its DataCache
export const DATA_GLOBAL = '__DATA__';

export type DataPair = [key: string, value: unknown];
