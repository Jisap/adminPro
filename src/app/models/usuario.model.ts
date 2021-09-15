import { environment } from "src/environments/environment";

const base_url = environment.base_url; // http://localhost:3005/api

export class Usuario {

    constructor(
        public nombre: string,
        public email: string,
        public password?: string,
        public img?: string,
        public google?: boolean,
        public role?: 'ADMIN_ROLE' | 'USER_ROLE',
        public uid?: string
    ){}

    get imagenUrl(){ // del usuario

        if( !this.img ){
            return `${ base_url }/upload/usuarios/NoImage`
        } else if (this.img.includes('https')) {
            return this.img;
        } else if (this.img) {
            return `${base_url}/upload/usuarios/${this.img}`
        } else {
            return `${base_url}/upload/usuarios/NoImage`
        }
    }
}