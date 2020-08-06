import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

function escape_string(str: string, escape: string) {

    if (escape.length !== 1) {
        return;
    }
    const esc = str.split(escape);

    let searchFinally = '';
    let newSearch = '';

    if (esc.length > 1) {
        for (const char of esc) {
            searchFinally += char + '$' + escape;
        }
        for (let i = 0; i < (searchFinally.length - 2); i++) {
            newSearch += searchFinally[i];
        }
    } else {
        newSearch = str;
    }

    return newSearch;
}

function getTokenData(jwtService: JwtService, token: string) {
    const split = token.split('Bearer ');
    const tokenData = jwtService.decode(split[1]);
    return tokenData;
}

async function encryptPasswordHash(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 10);
    return hash;
}

async function comparePasswordHash(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}

export { escape_string, getTokenData, encryptPasswordHash, comparePasswordHash };
