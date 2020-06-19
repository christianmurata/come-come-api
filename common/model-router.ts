import * as mongoose from 'mongoose';

import {Router} from './router';
import {NotFoundError} from 'restify-errors';

export abstract class ModelRouter<D extends mongoose.Document> extends Router {

    path: string;
    limit: number = 4;
    
    constructor(protected model: mongoose.Model<D>) {
        super();

        this.path = `/${this.model.collection.name}`;
    }

    protected prepareOne(query: mongoose.DocumentQuery<D, D>): mongoose.DocumentQuery<D, D> {
        return query;
    }

    envelope(document: any): any {
        let resource = Object.assign({_links: {}}, document.toJSON());

        resource._links.self = `${this.path}/${resource._id}`;
        
        return resource;
    }

    envelopeAll(documents: any[], options: any = {}): any {
        const resource: any = {
            _links: {
                self: `${options.url}`,
            },

            items: documents
        }

        // pagination
        if(options.page && options.count && options.limit){

            // previous
            if(options.page > 1)
                resource._links.previous = `${this.path}?_page=${options.page - 1}`;

            // next
            if((options.count - (options.page * options.limit)) > 0)
                resource._links.next = `${this.path}?_page=${options.page + 1}`;

        }

        return resource;
    }

    validateId = (req, resp, next) => {
        if(!mongoose.Types.ObjectId.isValid(req.params.id))
            next(new NotFoundError('Document Not Found'));

        next();
    }

    findAll = (req, resp, next) => {
        let page = parseInt(req.query._page || 1);
        page = page > 0 ? page : 1;

        const skip = (page - 1) * this.limit;

        this.model.count({}).exec()

        .then((count: Number) => {
            this.model.find()

            .limit(this.limit)
            .skip(skip)
            .then(this.renderAll(resp, next, { page, count, limit: this.limit, url: req.url }))
        })

        .catch(next);
    }

    findById = (req, resp, next) => {
        this.prepareOne(this.model.findById(req.params.id))
        
        .then(this.render(resp, next))
        .catch(next);
    }

    save = (req, resp, next) => {
        let document = new this.model(req.body);

        // salva o documento
        document.save()
        
        .then(this.render(resp, next))
        .catch(next);
    }

    replace = (req, resp, next) => {
        const options = { runValidators: true, overwrite: true };

        this.model.update({_id: req.params.id}, req.body, options).exec()
        
        .then(result => {
            if(result.n)
                return this.model.findById(req.params.id);
            
            throw new NotFoundError('Documento não encontrado');
        })

        .then(this.render(resp, next))
        .catch(next)
    }

    update = (req, resp, next) => {

        const options = { runValidators: true, new : true }

        this.model.findByIdAndUpdate(req.params.id, req.body, options)
            
        .then(this.render(resp, next))
        .catch(next);
    }

    delete = (req, resp, next) => {
        this.model.deleteOne({_id: req.params.id}).exec()
        
        .then((result: any) => {
            if(result.n)
                resp.send(204);

            else 
                throw new NotFoundError('Documento não encontrado');

            return next();
        })
        
        .catch(next);
    }

}