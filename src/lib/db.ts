//@ts-ignore
const pocketbase_url = import.meta.env?.VITE_POCKETBASE_URL as string;
import PocketBase from 'pocketbase';
import type { TypedPocketBase } from './db.types';


class PocketBaseSingleton {
    private static instance: TypedPocketBase;

    private constructor() { } // prevent direct instantiation

    static getInstance(): TypedPocketBase {
        if (!PocketBaseSingleton.instance) {
            PocketBaseSingleton.instance = new PocketBase(pocketbase_url?.startsWith('http') ? pocketbase_url : `http://${pocketbase_url}`) as TypedPocketBase;
        }
        return PocketBaseSingleton.instance;
    }
}

export default PocketBaseSingleton;
