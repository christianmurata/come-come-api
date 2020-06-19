import * as restify from 'restify';

import {EventEmitter} from 'events';
import {NotFoundError} from 'restify-errors';

export abstract class Router extends EventEmitter{
    
    abstract applyRoutes(app: restify.Server): any

    envelope(document: any): any {
        return document;
    }

    envelopeAll(documents: any[], options: any = {}): any {
        return documents;
    }

    render(resp: restify.Response, next: restify.Next) {
        return (document: any) => {
            if(document){
                this.emit('beforeRender', document);
                resp.json(this.envelope(document));
            }

            else{
                throw new NotFoundError('Documento não encontrado');
            }

            return next(false);
        }
    }

    renderAll(resp: restify.Response, next: restify.Next, options: any = {}) {
        return (documents: any[]) => {
            if(documents) {
                documents.map((document, index, array) => {
                    this.emit('beforeRender', document);
                    array[index] = this.envelope(document);
                });

                resp.json(this.envelopeAll(documents, options));
            }

            else {
                resp.json(this.envelopeAll([], options));
            }

            return next(false);
        }
    }
    
}