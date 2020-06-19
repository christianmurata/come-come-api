import * as restify from 'restify'
import * as mongoose from 'mongoose'

import { Router } from '../common/router'
import { environment } from '../common/environment'
import { handleError } from './error.handler';
import { mergePatchBodyParser } from './merge-patch.parser';

export class Server {

    app: restify.Server;

    initializeDb(): Promise<any> {
        return mongoose.connect(environment.db.url, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true 
        });
    }

    shutdown(): Promise<any> {
        return mongoose.disconnect().then(() => this.app.close());
    }

    initRoutes(routers: Router[]): Promise<any> {
        return new Promise((resolve, reject) => {
            try{

                this.app = restify.createServer({
                    name: 'come-come-api',
                    version: '1.0.0'
                });
                
                this.app.use(restify.plugins.queryParser());
                this.app.use(restify.plugins.bodyParser());
                this.app.use(mergePatchBodyParser);

                // rotas
                for(let router of routers) {
                    router.applyRoutes(this.app);
                }

                this.app.listen(environment.server.port, () => {
                    resolve(this.app);
                });

                this.app.on('restifyError', handleError);

            } catch(error) {
                reject(error);
            }
        });
    }

    bootstrap(routers: Router[] = []): Promise<Server> {
        return this.initializeDb().then(
            () => this.initRoutes(routers).then(() => this)
        );
    }
    
}