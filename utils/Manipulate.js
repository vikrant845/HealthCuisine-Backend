const Exercise = require('../models/exerciseModel');

class Manipulate {
    constructor (query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        let queryClone = { ...this.queryString };
        let orArray = [];
        const fieldsToExclude = [ 'page', 'sort', 'limit', 'fields' ];
        fieldsToExclude.forEach(field => delete queryClone[field]);

        queryClone = JSON.stringify(queryClone).replace(/\b(gt|lt|gte|lte)\b/g, match => `$${ match }`);
        queryClone = JSON.parse(queryClone);
        if (Object.keys(queryClone).length !== 0) {
            for (let query in queryClone) {
                if (typeof queryClone[`${ query }`] === 'object' || query === 'like') continue;
                let obj = {};
                obj[`${ query }`] = { $regex: queryClone[`${ query }`], $options: 'i' };
                delete queryClone[`${ query }`]
                orArray.push(obj);
            }
            queryClone['$or'] = orArray;
        }
        this.query = this.query.find(queryClone);
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortCriteria = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortCriteria);
        } else this.query = this.query.sort('bodyPart');
        return this;
    }

    filterFields() {
        if (this.queryString.fields) {
            const fieldsCriteria = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fieldsCriteria);
        } else this.query = this.query.select('-__v');
        return this;
    }

    async paginate() {
        const page = this.queryString.page ? this.queryString.page * 1 : 1;
        const limit = this.queryString.limit ? this.queryString.limit * 1 : 0;
        const resultsToSkip = (page - 1) * limit;
        const documentCount = await Exercise.countDocuments();

        if (documentCount < resultsToSkip) throw new Error('Not enough results');
        else this.query = this.query.skip(resultsToSkip).limit(limit);
        return this;
    }
}

module.exports = Manipulate;